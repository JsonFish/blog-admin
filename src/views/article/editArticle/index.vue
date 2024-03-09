<template>
  <el-card>
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>新增文章</div>
        <el-row>
          <el-link
            style="margin-right: 20px"
            :underline="false"
            :icon="useRenderIcon(Files)"
            type="info"
            @click="openDrawer"
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
      style="height: 70vh"
      v-model="articleForm.articleContent"
      @onUploadImg="onUploadImg"
    />
    <el-drawer v-model="drawerVisible" @close="closeDrawer" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <div
          style="
            position: relative;
            display: felx;
            border-bottom: 1px solid gray;
            padding-bottom: 10px;
          "
        >
          <span :id="titleId" :class="titleClass">发布文章</span>
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
            :fileSize="3"
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
            >发布</el-button
          >
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import Promotion from "@iconify-icons/ep/promotion";
import Files from "@iconify-icons/ep/files";
import Check from "@iconify-icons/ep/check";
import Close from "@/assets/svg/close.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/ReUpload/index.vue";
import { reactive, ref } from "vue";
import type { UploadUserFile, FormInstance } from "element-plus";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { addOrUpdateArticle } from "@/api/article";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { uploadFiles } from "@/api/file";
import { message } from "@/utils/message";
import { uploadFile } from "@/utils/upload";
defineOptions({
  name: "AddArticle"
});
const articleFormRef = ref<FormInstance>();
const drawerVisible = ref<boolean>(false);
const articleForm = reactive({
  id: "",
  articleTitle: "", // 标题
  articleSummary: "", // 摘要
  articleContent: "", // 文章内容
  articleCover: "", // 封面url
  categoryId: null, // 分类
  tagIds: [], // 标签
  isTop: 0, // 0 不置顶 1 置顶
  order: 1, // 置顶文章的排序
  status: 0, // 状态 0 公开 1 草稿
  type: 0, // 类型 0 原创 1 转载 2 翻译
  author: "", // 作者
  originUrl: "" // 原文链接
});
const categoryList = ref<any>();
const tagList = ref<any>();
const coverList = ref<UploadUserFile[]>([]);

// 打开Drawer回调函数
const openDrawer = async () => {
  drawerVisible.value = true;
  await getCategoryList().then(response => {
    categoryList.value = response.data.categoryList;
  });
  getTagList().then(response => {
    tagList.value = response.data.tagList;
  });
};

// 关闭Drawer
const closeDrawer = () => {
  drawerVisible.value = false;
  articleFormRef.value.resetFields();
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
  if (coverList.value.length != 0) {
    // 上传封面
    const response = await uploadFile(coverList.value);
    articleForm.articleCover = response.url;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!articleForm.articleContent) {
        message("文章内容不能为空 !", { type: "warning" });
        return;
      }
      addOrUpdateArticle(articleForm).then(response => {
        if (response.code == 200) {
          message("发布成功", { type: "success" });
          closeDrawer();
          articleForm.articleContent = "";
        } else {
          message("发布失败", { type: "error" });
        }
      });
    } else {
      return fields;
    }
  });
};
</script>
@/utils/upload
