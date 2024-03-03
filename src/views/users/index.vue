<template>
  <div>
    <el-card>
      <template #header>
        <div>用户管理</div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="标签名称">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入标签名称"
              prop="tagName"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getTagInfo"
          >搜索</el-button
        >
        <el-button type="info" :icon="useRenderIcon(Refresh)" @click="reset"
          >重置</el-button
        >
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="dialogVisible = true"
          >新增</el-button
        >
        <el-button
          :disabled="idList.length > 0 ? false : true"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="deleteTagBtn"
          >批量删除</el-button
        >
      </el-row>
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

import { reactive } from "vue";

const queryParams = reactive<any>({
  username: "",
  currentPage: 1,
  pageSize: 10
});
// 重置按钮回调
const reset = () => {};
</script>

<style scoped lang="scss"></style>
