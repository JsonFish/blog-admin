<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between">
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
    <MdEditor v-model="articleForm.content" @onUploadImg="onUploadImg" />
    <el-drawer v-model="drawerVisible" title="发布文章">
      <el-form :data="articleForm" label-width="80px">
        <el-form-item label="文章标题">
          <el-input placeholder="请输入文章标题" v-model="articleForm.title" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
            type="textarea"
            placeholder="请输入文章摘要"
            v-model="articleForm.abstract"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="articleForm.category"
            placeholder="请选择分类"
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
        <el-form-item label="标签">
          <el-select
            multiple
            v-model="articleForm.tagList"
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
      </el-form>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import Promotion from "@iconify-icons/ep/promotion";
import Files from "@iconify-icons/ep/files";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { reactive, ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { uploadFile } from "@/api/file";

const drawerVisible = ref<boolean>(false);
const articleForm = reactive({
  id: "",
  title: "",
  abstract: "",
  content: "", // 文章内容
  cover: "", // 封面url
  category: null, // 分类
  tagList: [], // 标签
  top: 0, // 0 不置顶 1 置顶
  order: 1, // 置顶文章的排序
  status: 0, // 状态 1 公开 2 私密 3 回收站（相当于草稿）
  type: 0, // 类型 0 原创 1 翻译 2 转载
  author: 0, // 作者
  link: "" // 原文链接 翻译或转载才需要填
});
const categoryList = ref<any>();
const tagList = ref<any>();
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
// 上传图片
const onUploadImg = async (files, callback) => {
  // files 上传文件数组
  const res = await Promise.all(
    files.map(file => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);
        uploadFile(form)
          .then(res => rev(res))
          .catch(error => rej(error));
      });
    })
  );
  callback(res.map(item => item.data.url));
};
</script>
