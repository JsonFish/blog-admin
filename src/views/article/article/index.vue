<script setup lang="ts">
defineOptions({
  name: "ArticleManage"
});
import Check from "@iconify-icons/ep/check";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, onMounted } from "vue";
import { getArticle } from "@/api/article";
import { getCategoryList } from "@/api/category";
// 查询参数
const queryParams = reactive({
  articleTitle: "",
  currentPage: 1,
  pageSize: 10,
  status: 0
});
const articleList = ref();
const categoryList = ref([]);
const loading = ref<boolean>(false);
onMounted(() => {
  getArticleLsit();
  getCategoryList().then(response => {
    categoryList.value = response.data.categoryList;
  });
});

const getArticleLsit = () => {
  loading.value = true;
  getArticle(queryParams).then(response => {
    articleList.value = response.data.articleList;
    loading.value = false;
  });

  // const getCategoryNameById = id => {
  //   const category = categoryList.value.find(item => item.id === id);
  //   return category.categoryName;
  // };
};
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
        <el-table border :data="articleList">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column type="index" align="center" label="#" width="35" />
          <el-table-column
            align="center"
            prop="articleTitle"
            label="文章标题"
          />
          <el-table-column
            align="center"
            prop="articleSummary"
            label="文章摘要"
          />
          <el-table-column prop="articleCover" align="center" label="文章封面">
            <template #default="scope">
              <el-image
                style="width: 90px; height: 50px"
                :src="scope.row.articleCover"
                fit="fill"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="categoryId"
            label="分类"
            width="80"
          >
            <template #default="scope">
              <el-tag>
                {{ scope.row.categoryId }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="tagIds" label="标签" />
          <el-table-column align="center" prop="type" label="类型" width="80">
            <template #default="scope">
              <el-tag type="primary">
                {{
                  scope.row.type == 0
                    ? "原创"
                    : scope.row.type == 1
                    ? "转载"
                    : "翻译"
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isTop" label="置顶">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isTop"
                :active-value="1"
                :inactive-value="0"
                inline-prompt
                :active-icon="useRenderIcon(Check)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="create_time"
            label="创建时间"
            min-width="100"
          />
          <el-table-column
            align="center"
            prop="update_time"
            label="修改时间"
            min-width="100"
          />
          <el-table-column prop="address" label="操作" min-width="100">
            <template #default="scope">
              <div class="btnClass">
                <el-button link type="primary" :icon="useRenderIcon(EditPen)"
                  >修改</el-button
                >
                <el-popconfirm
                  width="220"
                  :title="`是否删除分类: ${scope.row.articleTitle} ?`"
                  :icon="useRenderIcon(Warning)"
                  icon-color="#f56c6c"
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
      </el-tab-pane>
      <el-tab-pane label="草稿箱">Config</el-tab-pane>
      <el-tab-pane label="回收站">Config</el-tab-pane>
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
