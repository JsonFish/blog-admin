<template>
  <div>
    <el-card>
      <template #header>
        <div>友链管理</div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="网站名称">
            <el-input
              v-model="queryParams.siteName"
              placeholder="请输入网站名称"
              prop="siteName"
            />
          </el-form-item>
        </el-form>
        <el-button
          size="small"
          :disabled="!queryParams.siteName"
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getFriendLinkList"
          >搜索</el-button
        >
        <el-button
          size="small"
          type="info"
          :icon="useRenderIcon(Refresh)"
          @click="reset"
          >重置</el-button
        >
        <el-button
          size="small"
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="dialogVisible = true"
          >新增</el-button
        >
        <el-button
          size="small"
          :disabled="idList.length > 0 ? false : true"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="deleteBtn"
          >批量删除</el-button
        >
      </el-row>
      <el-tabs :model-value="1" @tab-click="tabClick">
        <el-tab-pane label="审核通过" :name="1">
          <el-table
            stripe
            v-loading="loading"
            :data="friendLinkList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 372px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              prop="siteName"
              align="center"
              label="网站名称"
              width="180"
            />
            <el-table-column
              prop="siteAvatar"
              label="头像"
              align="center"
              width="80"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.siteAvatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="siteDesc"
              align="center"
              label="网站描述"
              width="220"
            />
            <el-table-column
              prop="siteUrl"
              align="center"
              label="网址"
              width="220"
            />
            <el-table-column
              prop="create_time"
              align="center"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="update_time"
              align="center"
              label="更新时间"
              width="180"
            />
            <el-table-column label="操作" min-width="180">
              <template #default="scope">
                <div>
                  <el-button
                    link
                    type="primary"
                    @click="updateBtn(scope.row)"
                    :icon="useRenderIcon(EditPen)"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="220"
                    :title="`是否删除: ${scope.row.siteName} ?`"
                    :icon="useRenderIcon(Warning)"
                    icon-color="#f56c6c"
                    @confirm="deleteBtn(scope.row)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                        :icon="useRenderIcon(Delete)"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
        <el-tab-pane label="待审核" :name="0">
          <el-table
            stripe
            v-loading="loading"
            :data="friendLinkList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 372px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              prop="siteName"
              align="center"
              label="网站名称"
              width="180"
            />
            <el-table-column
              prop="siteAvatar"
              label="头像"
              align="center"
              width="80"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.siteAvatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="siteDesc"
              align="center"
              label="网站描述"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              prop="siteUrl"
              align="center"
              label="网址"
              width="220"
            />
            <el-table-column
              prop="create_time"
              align="center"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="applicant"
              align="center"
              label="申请者用户名"
              width="180"
            />
            <el-table-column label="操作" min-width="180">
              <template #default="scope">
                <div>
                  <el-popconfirm
                    width="220"
                    :title="`是否同意 ${scope.row.siteName} 的友链申请?`"
                    :icon="useRenderIcon(Check)"
                    icon-color="#218c3f"
                    @confirm="agreeApply(scope.row)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="primary"
                        :icon="useRenderIcon(Check)"
                        >同意</el-button
                      >
                    </template>
                  </el-popconfirm>

                  <el-popconfirm
                    width="220"
                    :title="`是否拒绝 ${scope.row.siteName} 的友链申请?`"
                    :icon="useRenderIcon(Warning)"
                    icon-color="#f56c6c"
                    @confirm="deleteBtn(scope.row)"
                  >
                    <template #reference>
                      <el-button link type="danger" :icon="useRenderIcon(Close)"
                        >拒绝</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>

      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 15, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getFriendLinkList"
          @current-change="getFriendLinkList"
        />
      </template>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="friendLink.id ? '修改友链' : '新增友链'"
      v-model="dialogVisible"
      width="30%"
      :before-close="cancel"
    >
      <el-form :model="friendLink" ref="friendLinkFormRef" label-width="100px">
        <el-form-item
          label="网站名称"
          prop="siteName"
          :rules="[
            {
              required: true,
              min: 2,
              max: 10,
              message: '名称长度2-10位 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="friendLink.siteName"
            placeholder="请输入网站名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="网站描述"
          prop="siteDesc"
          :rules="[
            {
              required: true,
              min: 2,
              max: 10,
              message: '名称长度2-10位 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="friendLink.siteDesc"
            placeholder="请输入网站描述"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="网址"
          prop="siteUrl"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '网址不能为空'
            }
          ]"
        >
          <el-input
            v-model="friendLink.siteUrl"
            placeholder="请输入网址"
            clearable
          />
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
          prop="siteAvatar"
        >
          <Upload
            @getFileList="getFileList"
            v-model:fileList="friendLinkImageList"
            :fileSize="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(friendLinkFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/ReUpload/index.vue";
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getFriendLink,
  addFriendLink,
  updateFriendLink,
  deleteFriendLink,
  agreeLink
} from "@/api/link";
import { uploadFile } from "@/utils/upload";
import { message } from "@/utils/message";
import type { FormInstance, UploadUserFile } from "element-plus";
defineOptions({
  name: "FriendLink"
});

const queryParams = reactive<any>({
  siteName: "",
  currentPage: 1,
  pageSize: 10,
  status: 1
});
const queryFormRef = ref<FormInstance>();
const friendLinkFormRef = ref<FormInstance>();

const friendLinkImageList = ref<UploadUserFile[]>([]);
const friendLink = reactive<any>({
  id: "",
  siteName: "",
  siteUrl: "",
  siteDesc: "",
  siteAvatar: ""
});
const total = ref<number>(0);
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const friendLinkList = ref<any[]>();

// 存储批量删除分类id
const idList = ref<Array<number>>([]);

onMounted(() => {
  getFriendLinkList();
});

// 获取友链数据
const getFriendLinkList = () => {
  loading.value = true;
  getFriendLink(queryParams).then(response => {
    friendLinkList.value = response.data.LinkList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 重置按钮回调
const reset = () => {
  // queryFormRef.value.resetFields(); // 无法重置
  queryParams.siteName = "";
  getFriendLinkList();
};
// 切换tabs
const tabClick = (tabPane: any) => {
  queryParams.status = tabPane.props.name;
  friendLinkList.value = [];
  getFriendLinkList();
};
// dialog取消按钮回调
const cancel = () => {
  dialogVisible.value = false;
  friendLinkFormRef.value.resetFields();
  friendLink.id = ""; // id不能重置
  friendLinkImageList.value = [];
};
// 修改按钮回调
const updateBtn = row => {
  dialogVisible.value = true;
  // dialog + form resetFields() 无法重置问题
  nextTick(() => {
    friendLink.id = row.id;
    friendLink.siteName = row.siteName;
    friendLink.siteUrl = row.siteUrl;
    friendLink.siteDesc = row.siteDesc;
    friendLink.siteAvatar = row.siteAvatar;
    friendLinkImageList.value[0] = {
      url: row.siteAvatar,
      name: row.siteName
    };
  });
};

// 获取要上传的文件
const getFileList = fileList => {
  friendLinkImageList.value = fileList;
};

// dialog确定按钮回调
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (friendLink.id) {
    // 修改
    // 先判断是否更换封面
    if (friendLinkImageList.value.length == 0) {
      friendLink.friendLinkImage = "";
    }
    if (
      friendLinkImageList.value.length != 0 &&
      friendLinkImageList.value[0].url != friendLink.siteAvatar
    ) {
      await uploadFile(friendLinkImageList.value).then(response => {
        friendLink.siteAvatar = response.url;
      });
    }
    // 再校验
    formEl.validate(async (valid, fields) => {
      if (valid) {
        updateFriendLink(friendLink).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            getFriendLinkList();
            cancel();
          } else {
            message(response.message, { type: "error" });
          }
        });
      } else {
        return fields;
      }
    });
  } else {
    // 添加
    // 先上传封面
    if (friendLinkImageList.value.length != 0) {
      await uploadFile(friendLinkImageList.value).then(response => {
        friendLink.siteAvatar = response.url;
      });
    }
    // 再校验
    formEl.validate((valid, fields) => {
      if (valid) {
        delete friendLink.id;
        friendLink.status = 1;
        addFriendLink(friendLink).then(response => {
          if (response.code == 200) {
            message("添加成功", { type: "success" });
            cancel();
            getFriendLinkList();
          } else {
            message(response.message, { type: "error" });
          }
        });
      } else {
        return fields;
      }
    });
  }
};
// checkBox处理
const handleSelectionChange = friendLinkList => {
  // 获取选中数据的id
  idList.value = friendLinkList.map(friendLinkInfo => {
    return friendLinkInfo.id;
  });
};
// 删除按钮回调
const deleteBtn = row => {
  if (row.id) {
    idList.value.push(row.id);
  }
  friendLink.id = idList.value;
  deleteFriendLink(friendLink).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getFriendLinkList();
    } else {
      message(response.message, { type: "error" });
    }
  });
  friendLink.id = ""; // 重置id
  idList.value = [];
};
// 同意友链申请
const agreeApply = row => {
  friendLink.id = row.id;
  agreeLink(friendLink).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
    } else {
      message(response.message, { type: "error" });
    }
    friendLink.id = "";
    getFriendLinkList();
  });
};
</script>

<style lang="scss" scoped></style>
