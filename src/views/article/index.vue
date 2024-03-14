<script setup lang="ts">
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Hide from "@iconify-icons/ep/hide";
import View from "@iconify-icons/ep/view";
import type { TabsPaneContext } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { QueryParams } from "@/api/article/type";
import {
  getArticle,
  getDraft,
  deletArticle,
  deleteDraft,
  updateStatus
} from "@/api/article";

defineOptions({
  name: "ArticleManage"
});
// 查询参数
const queryParams = reactive<QueryParams>({
  articleTitle: "",
  currentPage: 1,
  pageSize: 10,
  status: 0
});
const router = useRouter();
const total = ref<number>(0);
const articleList = ref([]);
const loading = ref<boolean>(false);

onMounted(() => {
  getArticleLsit();
});
// 获取文章列表
const getArticleLsit = () => {
  loading.value = true;
  getArticle(queryParams).then(response => {
    articleList.value = response.data.articleList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 获取草稿列表
const getDraftList = () => {
  loading.value = true;
  getDraft(queryParams).then(response => {
    articleList.value = response.data.articleList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 重置按钮
const reset = () => {
  queryParams.articleTitle = "";
  getArticleLsit();
};

// 切换tabs
const tabClick = (tabPane: TabsPaneContext) => {
  queryParams.status = tabPane.props.name as number;
  articleList.value = [];
  if (queryParams.status == 2) {
    getDraftList();
    return;
  }
  getArticleLsit();
};

// 编辑文章
const updateArticle = row => {
  router.push({ path: "/article/add", query: { id: row.id } });
};

// 编辑草稿
const edidDraft = row => {
  router.push({
    path: "/article/add",
    query: { id: row.id, status: row.status }
  });
};

// 显示隐藏文章
const updateArticleStatus = row => {
  updateStatus({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
      getArticleLsit();
    } else {
      message(response.message, { type: "error" });
    }
  });
};

// 删除文章
const deleteBtn = row => {
  deletArticle({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      if (queryParams.status == 2) {
        getDraftList();
      } else {
        getArticleLsit();
      }
    } else {
      message(response.message, { type: "error" });
    }
  });
};

// 删除草稿
const deleteDraftBtn = row => {
  deleteDraft({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      if (queryParams.status == 2) {
        getDraftList();
      } else {
        getArticleLsit();
      }
    } else {
      message(response.message, { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文章管理</span>
          <el-button
            @click="router.push('/article/add')"
            :icon="useRenderIcon(EditPen)"
            type="primary"
            text
            >写文章</el-button
          >
        </div>
      </template>
      <el-row class="top">
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="搜索标题">
            <el-input
              clearable
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
      <el-tabs :model-value="0" @tab-click="tabClick">
        <el-tab-pane label="已发布" :name="0">
          <el-table
            size="small"
            stripe
            border
            :data="articleList"
            v-loading="loading"
          >
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              align="center"
              prop="articleTitle"
              label="文章标题"
              min-width="100"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              prop="articleSummary"
              label="摘要"
              show-overflow-tooltip
              width="140"
            />

            <el-table-column
              prop="articleCover"
              align="center"
              label="封面"
              min-width="180px"
            >
              <template #default="scope">
                <el-image
                  preview-teleported
                  hide-on-click-modal
                  :preview-src-list="[scope.row.articleCover]"
                  style="width: 160px; height: 90px"
                  :src="scope.row.articleCover"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="tags"
              label="标签"
              min-width="210"
            >
              <template #default="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="(tag, index) in scope.row.tags"
                  :key="index"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="categoryName" label="分类">
              <template #default="scope">
                <el-tag> {{ scope.row.categoryName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="type" width="70" label="类型">
              <template #default="scope">
                {{
                  scope.row.type == 0
                    ? "原创"
                    : scope.row.type == 1
                    ? "转载"
                    : "翻译"
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="isTop" label="置顶排序">
              <template #default="scope">
                {{ scope.row.isTop == 0 ? "未置顶" : scope.row.order }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="create_time"
              label="创建时间"
              min-width="160"
            />
            <el-table-column
              align="center"
              prop="update_time"
              label="修改时间"
              min-width="160"
            />
            <el-table-column label="操作" min-width="190">
              <template #default="scope">
                <div class="btnClass">
                  <el-button
                    @click="updateArticle(scope.row)"
                    link
                    type="primary"
                    size="small"
                    :icon="useRenderIcon(EditPen)"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="220"
                    :title="`是否隐藏文章 ${scope.row.articleTitle} ?`"
                    :icon="useRenderIcon(Hide)"
                    @confirm="updateArticleStatus(scope.row)"
                    icon-color="#f3d6a9"
                  >
                    <template #reference>
                      <el-button
                        size="small"
                        link
                        type="warning"
                        :icon="useRenderIcon(Hide)"
                        >隐藏</el-button
                      >
                    </template>
                  </el-popconfirm>
                  <el-popconfirm
                    width="220"
                    :title="`是否删除文章: ${scope.row.articleTitle} ?`"
                    :icon="useRenderIcon(Warning)"
                    @confirm="deleteBtn(scope.row)"
                    icon-color="#f56c6c"
                  >
                    <template #reference>
                      <el-button
                        link
                        size="small"
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
        <el-tab-pane label="已隐藏" :name="1">
          <el-table
            size="small"
            stripe
            border
            :data="articleList"
            v-loading="loading"
          >
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              align="center"
              prop="articleTitle"
              label="文章标题"
              min-width="100"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              prop="articleSummary"
              label="摘要"
              show-overflow-tooltip
              width="140"
            />

            <el-table-column
              prop="articleCover"
              align="center"
              label="封面"
              min-width="180px"
            >
              <template #default="scope">
                <el-image
                  preview-teleported
                  hide-on-click-modal
                  :preview-src-list="[scope.row.articleCover]"
                  style="width: 160px; height: 90px"
                  :src="scope.row.articleCover"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="tags"
              label="标签"
              min-width="210"
            >
              <template #default="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="(tag, index) in scope.row.tags"
                  :key="index"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="categoryName" label="分类">
              <template #default="scope">
                <el-tag> {{ scope.row.categoryName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="type" width="70" label="类型">
              <template #default="scope">
                {{
                  scope.row.type == 0
                    ? "原创"
                    : scope.row.type == 1
                    ? "转载"
                    : "翻译"
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="isTop" label="置顶排序">
              <template #default="scope">
                {{ scope.row.isTop == 0 ? "未置顶" : scope.row.order }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="create_time"
              label="创建时间"
              min-width="160"
            />
            <el-table-column
              align="center"
              prop="update_time"
              label="修改时间"
              min-width="160"
            />
            <el-table-column label="操作" min-width="190">
              <template #default="scope">
                <div class="btnClass">
                  <el-button
                    @click="updateArticle(scope.row)"
                    link
                    size="small"
                    type="primary"
                    :icon="useRenderIcon(EditPen)"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="220"
                    :title="`是否公开文章 ${scope.row.articleTitle} ?`"
                    :icon="useRenderIcon(View)"
                    @confirm="updateArticleStatus(scope.row)"
                    icon-color="#90c23a"
                  >
                    <template #reference>
                      <el-button
                        link
                        size="small"
                        type="success"
                        :icon="useRenderIcon(View)"
                        >公开</el-button
                      >
                    </template>
                  </el-popconfirm>
                  <el-popconfirm
                    width="220"
                    :title="`是否删除文章 ${scope.row.articleTitle} ?`"
                    :icon="useRenderIcon(Warning)"
                    @confirm="deleteBtn(scope.row)"
                    icon-color="#f56c6c"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                        size="small"
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
          <el-table
            size="small"
            stripe
            border
            :data="articleList"
            v-loading="loading"
          >
            <el-table-column type="index" align="center" label="#" width="35" />
            <el-table-column
              align="center"
              prop="articleTitle"
              label="文章标题"
              show-overflow-tooltip
              min-width="130"
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
              min-width="150"
            />
            <el-table-column
              align="center"
              prop="update_time"
              label="修改时间"
              min-width="150"
            />
            <el-table-column prop="address" label="操作" min-width="180">
              <template #default="scope">
                <div class="btnClass">
                  <el-button
                    size="small"
                    link
                    type="primary"
                    :icon="useRenderIcon(EditPen)"
                    @click="edidDraft(scope.row)"
                    >编辑</el-button
                  >
                  <el-popconfirm
                    width="220"
                    :title="`是否删除草稿 ${scope.row.articleTitle} ?`"
                    :icon="useRenderIcon(Warning)"
                    @confirm="deleteDraftBtn(scope.row)"
                    icon-color="#f56c6c"
                  >
                    <template #reference>
                      <el-button
                        size="small"
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
.top {
  margin-top: -13px;
  height: 35px;
}
</style>
