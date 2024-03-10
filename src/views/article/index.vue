<script setup lang="ts">
import Check from "@iconify-icons/ep/check";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, onMounted } from "vue";
import { getArticle } from "@/api/article";
defineOptions({
  name: "ArticleManage"
});
const total = ref<number>(0);
// 查询参数
const queryParams = reactive({
  articleTitle: "",
  currentPage: 1,
  pageSize: 5,
  status: 0
});
const articleList = ref([]);
const loading = ref<boolean>(false);
onMounted(() => {
  getArticleLsit();
});

const getArticleLsit = () => {
  loading.value = true;
  getArticle(queryParams).then((response: any) => {
    articleList.value = response.data.articleList;
    total.value = response.data.total;
    loading.value = false;
  });
};
const reset = () => {
  queryParams.articleTitle = "";
  getArticleLsit();
};
// 切换tabs
const tabClick = (tabPane: any) => {
  queryParams.status = tabPane.props.name;
  articleList.value = [];
  getArticleLsit();
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文章管理</span>
          <el-button :icon="useRenderIcon(EditPen)" type="primary" text
            >写文章</el-button
          >
        </div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="搜索标题">
            <el-input
              v-model="queryParams.articleTitle"
              placeholder="请输入文章标题"
              prop="articleTitle"
            />
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!queryParams.articleTitle"
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getArticleLsit"
          >搜索</el-button
        >
        <el-button type="info" :icon="useRenderIcon(Refresh)" @click="reset"
          >重置</el-button
        >
      </el-row>
      <el-tabs :model-value="0" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="已发布" :name="0">
          <el-table stripe border :data="articleList" v-loading="loading">
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
              label="摘要"
            />
            <el-table-column prop="articleCover" align="center" label="封面">
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
                <el-tag> {{ scope.row.categoryId }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="tagIds" label="标签" />
            <el-table-column align="center" prop="type" label="类型" width="80">
              <template #default="scope">
                <el-tag>
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已下架" :name="1">
          <el-table stripe border :data="articleList" v-loading="loading">
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
              label="摘要"
            />
            <el-table-column prop="articleCover" align="center" label="封面">
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
                <el-tag> {{ scope.row.categoryId }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="tagIds" label="标签" />
            <el-table-column align="center" prop="type" label="类型" width="80">
              <template #default="scope">
                <el-tag>
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="草稿箱" :name="2">
          <el-table stripe border :data="articleList" v-loading="loading">
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="35" />
            <el-table-column
              align="center"
              prop="articleTitle"
              label="文章标题"
            />
            <el-table-column
              align="center"
              prop="articleContent"
              label="文章内容"
              show-overflow-tooltip
              min-width="200"
            />
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
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[5, 10, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getArticleLsit"
          @current-change="getArticleLsit"
        />
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}
</style>
