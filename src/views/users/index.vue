<template>
  <div>
    <el-card>
      <template #header>
        <div>用户管理</div>
      </template>
      <el-row>
        <el-form
          size="small"
          :model="queryParams"
          :inline="true"
          ref="queryFormRef"
        >
          <el-form-item label="用户名">
            <el-input
              size="small"
              clearable
              v-model="queryParams.username"
              placeholder="请输入用户名"
              prop="tagName"
            />
          </el-form-item>
        </el-form>
        <el-button
          size="small"
          :disabled="!queryParams.username"
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getUsers"
          >搜索</el-button
        >
        <el-button
          size="small"
          type="info"
          :icon="useRenderIcon(Refresh)"
          @click="reset"
          >重置</el-button
        >
      </el-row>
      <el-table
        size="small"
        style="height: calc(100vh - 320px)"
        v-loading="loading"
        :data="userList"
        border
      >
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column
          prop="username"
          align="center"
          label="用户名"
          min-width="100"
        />
        <el-table-column prop="avatar" label="头像" align="center" width="100">
          <template v-slot="scope">
            <el-avatar :size="50" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          align="center"
          label="邮箱"
          min-width="150"
        />
        <el-table-column prop="role" align="center" label="角色">
          <template #default="scope">
            <el-tag>{{
              scope.row.role == 2
                ? "超级管理员"
                : scope.row.role == 1
                ? "管理员"
                : "普通用户"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="ipAddress"
          align="center"
          label="ip"
          min-width="100"
        />
        <el-table-column
          prop="create_time"
          align="center"
          label="注册日期"
          min-width="180"
        />
        <el-table-column
          prop="update_time"
          align="center"
          label="更新日期"
          min-width="180"
        />
        <el-table-column width="200" align="center" prop="status" label="状态">
          <template #default="scope">
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.status"
              class="mt-2"
              :active-value="1"
              :inactive-value="0"
              inactive-text="正常"
              active-text="拉黑"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" width="80" label="操作" align="center">
          <template #default="scope">
            <div class="btnClass">
              <el-button
                link
                type="primary"
                :icon="useRenderIcon(EditPen)"
                @click="updateBtn(scope.row)"
                size="small"
                >修改</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 15, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getUsers"
          @current-change="getUsers"
        />
      </template>
    </el-card>
    <el-dialog
      @close="cancel"
      title="修改用户信息"
      v-model="dialogVisible"
      width="30%"
    >
      <el-form :model="userForm" ref="userFormRef" label-width="100px">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            {
              required: true,
              min: 2,
              max: 10,
              message: '用户名长度2-10位 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            {
              required: true,
              message: '邮箱不能为空 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="角色"
          :rules="[
            {
              required: true,
              message: '请选择角色 !',
              trigger: 'blur'
            }
          ]"
          prop="role"
        >
          <el-select v-model="userForm.role" placeholder="请选择角色" clearable>
            <el-option :key="1" label="普通用户" :value="0" />
            <el-option :key="2" label="管理员" :value="1" />
            <el-option :key="2" label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="头像"
          :rules="[
            {
              required: true,
              message: '请上传头像 !',
              trigger: 'blur'
            }
          ]"
          prop="avatar"
        >
          <Upload
            @getFileList="getFileList"
            v-model:fileList="avatarList"
            :fileSize="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(userFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import EditPen from "@iconify-icons/ep/edit-pen";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/ReUpload/index.vue";
import { getUserList, updateUser, changeUserStatus } from "@/api/user";
import type { QueryParams, UserInfo } from "@/api/user/type";
import { uploadFile } from "@/utils/upload";
import { ref, reactive, onMounted, nextTick } from "vue";
import { message } from "@/utils/message";
import type { FormInstance, UploadUserFile } from "element-plus";
defineOptions({
  name: "Users"
});

const dialogVisible = ref<boolean>(false);
// 查询参数
const queryParams = reactive<QueryParams>({
  username: "",
  currentPage: 1,
  pageSize: 10
});
// 表单参数
const userForm = reactive<UserInfo>({
  id: null,
  email: "",
  username: "",
  role: null,
  status: null
});
const userFormRef = ref<FormInstance>();
const loading = ref<boolean>(false);
const total = ref<number>(0);
const userList = ref<UserInfo[]>([]);
const avatarList = ref<UploadUserFile[]>([]);
onMounted(() => {
  getUsers();
});
// 查询
const getUsers = () => {
  loading.value = true;
  getUserList(queryParams).then(response => {
    userList.value = response.data.userList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 重置按钮回调
const reset = () => {
  queryParams.username = null;
  getUsers();
};
// 修改按钮回调
const updateBtn = (row: UserInfo) => {
  dialogVisible.value = true;
  // dialog + form resetFields() 无法重置问题
  nextTick(() => {
    userForm.id = row.id;
    userForm.username = row.username;
    userForm.avatar = row.avatar;
    userForm.email = row.email;
    userForm.role = row.role;
    avatarList.value[0] = {
      url: row.avatar,
      name: row.username
    };
  });
};
// dialog关闭 取消按钮回调
const cancel = () => {
  dialogVisible.value = false;
  userFormRef.value.resetFields();
  avatarList.value = [];
};
const getFileList = (fileList: UploadUserFile[]) => {
  avatarList.value = fileList;
};
// 修改提交按钮
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (avatarList.value.length == 0) {
    // 删除了头像
    userForm.avatar = "";
  }
  if (
    // 更换了头像
    avatarList.value.length != 0 &&
    avatarList.value[0].url != userForm.avatar
  ) {
    // 防止删除头像后校验 上传新的头像校验不通过
    userForm.avatar = "更换了头像";
  }
  formEl.validate(async (valid, fields) => {
    if (
      // 更换了头像 其他数据校验通过
      avatarList.value.length != 0 &&
      avatarList.value[0].url != userForm.avatar &&
      valid
    ) {
      // 上传头像
      await uploadFile(avatarList.value).then(response => {
        userForm.avatar = response.url;
      });
    }
    if (valid) {
      // 更新数据
      delete userForm.status;
      updateUser(userForm).then(response => {
        if (response.code == 200) {
          message("修改成功", { type: "success" });
          getUsers();
        } else {
          message(response.message, { type: "error" });
        }
        cancel();
      });
    } else {
      return fields;
    }
  });
};
// 拉黑/拉出用户
const changeStatus = (row: UserInfo) => {
  changeUserStatus({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
    } else {
      message(response.message, { type: "error" });
    }
  });
};
</script>

<style scoped lang="scss"></style>
