<template>
  <div>
    <el-card>
      <template #header>
        <div>留言管理</div>
      </template>
      <el-button
        size="small"
        :disabled="idList.length > 0 ? false : true"
        type="danger"
        :icon="useRenderIcon(Delete)"
        @click="deleteBtn"
        >批量删除</el-button
      >
      <el-tabs :model-value="1" @tab-click="tabClick">
        <el-tab-pane label="审核通过" :name="1">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            :data="messageList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 350px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="50" />
            <el-table-column
              prop="username"
              align="center"
              label="用户"
              width="150"
            />
            <el-table-column
              prop="avatar"
              label="头像"
              align="center"
              width="100"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="message"
              align="center"
              label="留言内容"
              min-width="200"
            />
            <el-table-column
              prop="create_time"
              align="center"
              label="留言时间"
              width="200"
            />
            <el-table-column label="操作" width="250">
              <template #default="scope">
                <el-popconfirm
                  width="250"
                  :title="`是否删除用户 ${scope.row.username} 的留言 ?`"
                  :icon="useRenderIcon(Warning)"
                  icon-color="#f56c6c"
                  @confirm="deleteBtn(scope.row)"
                >
                  <template #reference>
                    <el-button link type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
        <el-tab-pane label="待审核" :name="0">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            :data="messageList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 372px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="50" />
            <el-table-column
              prop="username"
              align="center"
              label="用户"
              width="150"
            />
            <el-table-column
              prop="avatar"
              label="头像"
              align="center"
              width="100"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="message"
              align="center"
              label="留言内容"
              min-width="200"
            />
            <el-table-column
              prop="create_time"
              align="center"
              label="留言时间"
              width="200"
            />
            <el-table-column label="操作" width="250">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="agreeApply(scope.row)"
                  :icon="useRenderIcon(Check)"
                  >通过</el-button
                >
                <el-popconfirm
                  width="220"
                  :title="`是否删除 ${scope.row.username} 的留言?`"
                  :icon="useRenderIcon(Warning)"
                  icon-color="#f56c6c"
                  @confirm="deleteBtn(scope.row)"
                >
                  <template #reference>
                    <el-button link type="danger" :icon="useRenderIcon(Close)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
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
          @size-change="getMessageList"
          @current-change="getMessageList"
        />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Delete from "@iconify-icons/ep/delete";
import Warning from "@iconify-icons/ep/warning";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, reactive } from "vue";
import { getMessage, updateMessage, deleteMessage } from "@/api/message";
import { message } from "@/utils/message";
defineOptions({
  name: "Message"
});
const queryParams = reactive<any>({
  currentPage: 1,
  pageSize: 10,
  status: 1
});
const messageForm = reactive<any>({
  id: ""
});
const total = ref<number>(0);
const loading = ref<boolean>(false);
const messageList = ref<any[]>();
// 存储批量删除的id
const idList = ref<Array<number>>([]);
onMounted(() => {
  getMessageList();
});

// 获取留言
const getMessageList = () => {
  loading.value = true;
  getMessage(queryParams).then(response => {
    messageList.value = response.data.messageList;
    total.value = response.data.total;
    loading.value = false;
  });
};

// 切换tabs
const tabClick = (tabPane: any) => {
  queryParams.status = tabPane.props.name;
  messageList.value = [];
  getMessageList();
};

// checkBox处理
const handleSelectionChange = messageList => {
  // 获取选中数据的id
  idList.value = messageList.map(messageInfo => {
    return messageInfo.id;
  });
};
// 删除按钮回调
const deleteBtn = row => {
  // 单点删除 而不是批量删除
  if (row.id) {
    idList.value.push(row.id);
  }
  deleteMessage({ id: idList.value }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getMessageList();
    } else {
      message(response.message, { type: "error" });
    }
  });
  messageForm.id = ""; // 重置id
  idList.value = [];
};
// 同意留言
const agreeApply = row => {
  updateMessage({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
    } else {
      message(response.message, { type: "error" });
    }
    getMessageList();
  });
};
</script>
