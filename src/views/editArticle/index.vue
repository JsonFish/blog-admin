<template>
  <div>
    <el-card>
      <template #header>
        <div class="header">
          <div>{{ articleForm.id ? "编辑文章" : "新增文章" }}</div>
          <el-row>
            <el-link
              v-if="!articleForm.id || articleForm.status == 2"
              style="margin-right: 20px"
              :underline="false"
              :icon="useRenderIcon(Files)"
              type="info"
              @click="openDialog"
              >存草稿</el-link
            >
            <el-button
              plain
              :icon="useRenderIcon(Promotion)"
              type="primary"
              @click="openDrawer"
              >发布</el-button
            >
          </el-row>
        </div>
      </template>
      <MdEditor
        style="height: 72vh"
        v-model="articleForm.articleContent"
        @onUploadImg="onUploadImg"
      />
      <el-drawer
        :close-on-click-modal="false"
        v-model="drawerVisible"
        @close="closeDrawer"
        :show-close="false"
      >
        <template #header="{ close, titleId, titleClass }">
          <div
            style="
              position: relative;
              display: felx;
              border-bottom: 1px solid gray;
              padding-bottom: 10px;
            "
          >
            <span :id="titleId" :class="titleClass"> 发布 </span>
            <el-button
              size="large"
              link
              style="position: absolute; top: 4px; right: 5px"
              :icon="useRenderIcon(Close)"
              :underline="false"
              @click="close"
            />
          </div>
        </template>
        <el-form ref="articleFormRef" :model="articleForm" label-width="80px">
          <el-form-item
            label="文章标题"
            :rules="[
              {
                required: true,
                message: '标题不能为空 !'
              }
            ]"
            prop="articleTitle"
          >
            <el-input
              placeholder="请输入文章标题"
              v-model="articleForm.articleTitle"
            />
          </el-form-item>
          <el-form-item
            label="摘要"
            prop="articleSummary"
            :rules="[
              {
                required: true,
                message: '摘要不能为空 !'
              }
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入文章摘要"
              v-model="articleForm.articleSummary"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item
            label="分类"
            prop="categoryId"
            :rules="[
              {
                required: true,
                message: '分类不能为空 !'
              }
            ]"
          >
            <el-select
              v-model="articleForm.categoryId"
              placeholder="请选择文章分类"
              clearable
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tagIds"
            :rules="[
              {
                required: true,
                message: '标签不能为空 !'
              }
            ]"
          >
            <el-select
              multiple
              v-model="articleForm.tagIds"
              clearable
              placeholder="请选择标签"
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.tagName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="upload"
            label="封面"
            prop="articleCover"
            :rules="[
              {
                required: true,
                message: '请上传封面 !'
              }
            ]"
          >
            <Upload
              :limit="1"
              :fileSize="4"
              @getFileList="getFileList"
              v-model:fileList="coverList"
            />
          </el-form-item>
          <el-form-item label="置顶" prop="isTop">
            <el-switch
              v-model="articleForm.isTop"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              :active-icon="useRenderIcon(Check)"
              :inactive-icon="Close"
            />
          </el-form-item>
          <el-form-item label="排序" prop="order" v-show="articleForm.isTop">
            <el-input-number :min="1" v-model="articleForm.order" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="articleForm.type">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
              <el-radio :label="2">翻译</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="作者"
            prop="author"
            :rules="[
              {
                required: true,
                message: '作者不能为空 !'
              }
            ]"
            v-if="articleForm.type == 1"
          >
            <el-input
              v-model="articleForm.author"
              placeholder="请输入原文章作者"
            />
          </el-form-item>
          <el-form-item
            label="链接"
            prop="originUrl"
            v-if="articleForm.type != 0"
            :rules="[
              {
                required: true,
                message: '链接不能为空 !'
              }
            ]"
          >
            <el-input
              v-model="articleForm.originUrl"
              placeholder="请输入原文链接"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div style="border-top: 1px solid gray; padding-top: 10px">
            <el-button @click="closeDrawer">取消</el-button>
            <el-button type="primary" @click="publishArticle(articleFormRef)"
              >确定</el-button
            >
          </div>
        </template>
      </el-drawer>
    </el-card>
    <el-dialog
      title="存草稿"
      v-model="dialogVisible"
      width="30%"
      :before-close="closeDialog"
    >
      <el-form
        :model="articleForm"
        ref="dialogFormRef"
        label-width="80px"
        :inline="false"
      >
        <el-form-item
          label="文章标题"
          prop="articleTitle"
          :rules="[
            {
              required: true,
              message: '标题不能为空 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="articleForm.articleTitle" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="savaDraft(dialogFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Promotion from "@iconify-icons/ep/promotion";
import Files from "@iconify-icons/ep/files";
import Check from "@iconify-icons/ep/check";
import Close from "@/assets/svg/close.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/ReUpload/index.vue";
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { UploadUserFile, FormInstance } from "element-plus";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {
  getArticle,
  addArticle,
  getDraft,
  addDraft,
  updateArticle,
  updateDraft
} from "@/api/article";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { uploadFiles } from "@/api/file";
import { message } from "@/utils/message";
import { uploadFile } from "@/utils/upload";
defineOptions({
  name: "AddArticle"
});
const route = useRoute();
const router = useRouter();
const dialogVisible = ref<boolean>(false);
const articleFormRef = ref<FormInstance>();

const dialogFormRef = ref<FormInstance>();
const drawerVisible = ref<boolean>(false);
const articleForm = reactive({
  id: "",
  articleTitle: "", // 标题
  articleSummary: "", // 摘要
  articleContent: "", // 文章内容
  articleCover: "", // 封面url
  categoryId: "", // 分类
  tagIds: [], // 标签
  isTop: 0, // 0 不置顶 1 置顶
  order: 0, // 置顶文章的排序
  status: 0, // 状态 0 公开 1下架(私密) 2 草稿 3 删除
  type: 0, // 类型 0 原创 1 转载 2 翻译
  author: "", // 原文作者
  originUrl: "" // 原文链接
});
const categoryList = ref<any>();
const tagList = ref<any>();
const coverList = ref<UploadUserFile[]>([]);

onMounted(async () => {
  // 文章
  if (route.query.id && !route.query.status) {
    await getArticle({ id: route.query.id }).then(response => {
      delete response.data.articleList[0].create_time;
      delete response.data.articleList[0].update_time;
      delete response.data.articleList[0].categoryName;
      delete response.data.articleList[0].tags;
      delete response.data.articleList[0].browse;
      delete response.data.articleList[0].upvote;
      Object.assign(articleForm, response.data.articleList[0]);
    });
  }
  // 草稿
  if (route.query.id && route.query.status) {
    // 获取草稿详情
    getDraft({ id: route.query.id }).then(response => {
      articleForm.id = response.data.articleList[0].id;
      articleForm.articleTitle = response.data.articleList[0].articleTitle;
      articleForm.articleContent = response.data.articleList[0].articleContent;
      articleForm.status = response.data.articleList[0].status;
    });
  }
});

// 打开Drawer回调函数
const openDrawer = async () => {
  if (articleForm.articleCover) {
    coverList.value[0] = {
      name: articleForm.articleTitle,
      url: articleForm.articleCover
    };
  }
  await getCategoryList().then(response => {
    categoryList.value = response.data.categoryList;
  });
  await getTagList().then(response => {
    tagList.value = response.data.tagList;
  });
  drawerVisible.value = true;
};

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogFormRef.value.resetFields();
  dialogVisible.value = false;
};

// 关闭Drawer
const closeDrawer = () => {
  drawerVisible.value = false;
  articleFormRef.value.resetFields();
  coverList.value = [];
};

// Upload组件 上传成功回调
const getFileList = fileList => {
  coverList.value = fileList;
};

// markDown上传图片
const onUploadImg = async (files, callback) => {
  // files 上传文件数组
  const res = await Promise.all(
    files.map(file => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);
        uploadFiles(form)
          .then(res => {
            if (res.code == 200) return rev(res.data);
            message("图片上传失败", { type: "error" });
          })
          .catch(error => rej(error));
      });
    })
  );
  callback(res.map(item => item.url));
};

// 发布文章
const publishArticle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 没选择封面| 删除了封面
  if (coverList.value.length == 0) {
    articleForm.articleCover = "";
  }
  if (
    // 更换了封面
    coverList.value.length != 0 &&
    coverList.value[0].url != articleForm.articleCover
  ) {
    // 防止删除封面后校验 上传新的封面校验不通过
    articleForm.articleCover = "test";
  }

  await formEl.validate(async (valid, fields) => {
    if (
      coverList.value.length != 0 &&
      coverList.value[0].url != articleForm.articleCover &&
      valid
    ) {
      if (!articleForm.articleContent) {
        message("文章内容不能为空 !", { type: "warning" });
        return;
      }
      await uploadFile(coverList.value).then(response => {
        articleForm.articleCover = response.url;
      });
    }
    if (valid) {
      // 修改
      if (articleForm.id) {
        updateArticle(articleForm).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            articleForm.articleContent = "";
            articleForm.id = "";
            router.push("/article/manage");
          } else {
            message(response.message, { type: "error" });
          }
          closeDrawer();
        });
      } else {
        // 新增
        delete articleForm.id;
        articleForm.status = 0;
        addArticle(articleForm).then(response => {
          if (response.code == 200) {
            message("发布成功", { type: "success" });
            articleForm.articleContent = "";
            router.push("/article/manage");
          } else {
            message(response.message, { type: "error" });
          }
          closeDrawer();
        });
      }
    } else {
      return fields;
    }
  });
};

// 存草稿
const savaDraft = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!articleForm.articleContent) {
        message("文章内容不能为空 !", { type: "warning" });
        return;
      }
      if (articleForm.id) {
        updateDraft(articleForm).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            closeDialog();
            router.push("/article/manage");
          } else {
            message(response.message, { type: "error" });
          }
        });
      } else {
        addDraft(articleForm).then(response => {
          if (response.code == 200) {
            message("保存成功", { type: "success" });
            articleForm.articleContent = "";
            closeDialog();
          } else {
            message(response.message, { type: "error" });
          }
        });
      }
    } else {
      return fields;
    }
  });
};
</script>

<style lang="css" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload {
  :deep(.el-form-item__content) {
    width: 320px !important;
    height: 180px !important;
  }

  :deep(.el-upload-list__item) {
    width: 320px !important;
    height: 180px !important;
    margin: 0 !important;
    border: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 320px !important;
    height: 180px !important;
  }

  :deep(.el-upload-list--picture-card) {
    width: 320px !important;
    height: 180px !important;
    margin: 0 !important;
    border: none !important;
  }
}
</style>
