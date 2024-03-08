<template>
  <div>
    <el-card>
      <template #header>
        <div>用户管理</div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="用户名">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名"
              prop="tagName"
            />
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!queryParams.username"
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getUsers"
          >搜索</el-button
        >
        <el-button type="info" :icon="useRenderIcon(Refresh)" @click="reset"
          >重置</el-button
        >
        <!-- <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="dialogVisible = true"
          >新增</el-button
        > -->
        <el-button
          :disabled="idList.length > 0 ? false : true"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="deleteUserBtn"
          >批量删除</el-button
        >
      </el-row>
      <el-table
        v-loading="loading"
        :data="userList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column
          prop="username"
          align="center"
          label="用户名"
          width="150"
        />
        <el-table-column prop="avatar" label="头像" align="center" width="100">
          <template v-slot="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          align="center"
          label="邮箱"
          min-width="200"
        />
        <el-table-column prop="role" align="center" label="角色">
          <template #default="scope">
            <el-tag>{{ scope.row.role == 2 ? "超级管理员" : "用户" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          align="center"
          label="创建时间"
          width="200"
        />
        <el-table-column
          prop="update_time"
          align="center"
          label="更新时间"
          width="200"
        />
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <div class="btnClass">
              <el-button link type="primary" :icon="useRenderIcon(EditPen)"
                >修改</el-button
              >
              <el-popconfirm
                width="220"
                :title="`是否删除用户 ${scope.row.username} ?`"
                :icon="useRenderIcon(Warning)"
                icon-color="#f56c6c"
                @confirm="deleteUserBtn(scope.row)"
              >
                <template #reference>
                  <el-button link type="danger" :icon="useRenderIcon(Delete)"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
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
  </div>
</template>

<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Users"
});
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getUserList, deleteUser } from "@/api/user";
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
// dialog
const dialogVisible = ref<boolean>(false);
// 查询参数
const queryParams = reactive<any>({
  username: "",
  currentPage: 1,
  pageSize: 10
});
// 表单参数
const userForm = reactive<any>({
  id: "",
  username: ""
});
const loading = ref<boolean>(false);
const total = ref<number>(0);
const userList = ref([]);
// 批量删除存储id
const idList = ref<number[]>([]);
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
  queryParams.username = "";
  getUsers();
};
// checkBox处理
const handleSelectionChange = (userList: any) => {
  idList.value = userList.map((userInfo: any) => {
    return userInfo.id;
  });
};
// 删除
const deleteUserBtn = (row: any) => {
  delete userForm.username;
  if (row.id) {
    idList.value = [];
    idList.value.push(row.id);
  }
  userForm.id = idList.value;
  deleteUser(userForm).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getUsers();
    } else {
      message("删除失败", { type: "error" });
    }
  });
  userForm.id = ""; // 重置id
  idList.value = [];
};
</script>

<style scoped lang="scss"></style>
