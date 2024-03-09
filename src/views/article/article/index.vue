<script setup lang="ts">
defineOptions({
  name: "ArticleManage"
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>文章管理</span>
        <el-button class="button" text>Operation button</el-button>
      </div>
    </template>
    <el-tabs type="border-card">
      <el-tab-pane label="公开文章">
        <el-table border>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" align="center" label="#" width="60" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="草稿箱">Config</el-tab-pane>
    </el-tabs>
    <template #footer>Footer content</template>
  </el-card>
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
