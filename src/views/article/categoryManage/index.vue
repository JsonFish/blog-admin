<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import { getCategoryList } from "@/api/category";
const categoryList = ref();

onMounted(() => {
  getCategoryList().then(response => {
    console.log(response);
    categoryList.value = response.data;
  });
});
</script>

<template>
  <el-card>
    <template #header>
      <div>专栏管理</div>
    </template>
    <el-form :inline="true">
      <el-form-item label="专栏名称">
        <el-input placeholder="请输入专栏名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon(Search)">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="categoryList" border style="width: 100%">
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" label="序号" width="60" />

      <el-table-column
        prop="categoryName"
        align="center"
        label="专栏名称"
        width="180"
      />
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
        width="180"
      />
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        width="180"
      />
      <el-table-column prop="address" label="操作" />
    </el-table>
  </el-card>
</template>

<style lang="scss" scoped></style>
