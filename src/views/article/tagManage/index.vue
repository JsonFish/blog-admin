<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, reactive } from "vue";
import { getTagList, deleteTagInfo } from "@/api/tag";
const tagList = ref();
// 查询参数
const queryParams = reactive({
  tagName: "",
  currentPage: 1,
  pageSize: 10
});
onMounted(() => {
  getAllTag();
});
const getAllTag = () => {
  getTagList(queryParams).then(response => {
    console.log(response);
    tagList.value = response.data;
  });
};
const update = (row: any) => {
  console.log(row);
};
const deleteTag = (row: any) => {
  const id = row.id;
  deleteTagInfo(id).then(response => {
    console.log(response);
  });
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div>标签管理</div>
      </template>
      <el-form :inline="true">
        <el-form-item label="标签名称">
          <el-input placeholder="请输入标签名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="useRenderIcon(Search)"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary">新增标签</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tagList" border style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" align="center" label="序号" width="60" />
        <el-table-column
          prop="tagName"
          align="center"
          label="标签名"
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
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <div class="btnClass">
              <el-button
                link
                type="primary"
                @click="update(scope.row)"
                :icon="useRenderIcon(EditPen)"
                >修改</el-button
              >

              <el-button
                link
                type="danger"
                @click="deleteTag(scope.row)"
                :icon="useRenderIcon(Delete)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="position: absolute; bottom: 0; right: 0"
        v-model:current-page="queryParams.currentPage"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 15, 20]"
        :small="true"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="10"
        @size-change="getAllTag"
        @current-change="getAllTag"
      />
      <template #footer>Footer content</template>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
