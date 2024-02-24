<template>
  <el-card class="markdow-page">
    <template #header>
      <div>新增文章</div>
    </template>
    <el-form>
      <el-form-item label="文章标题">
        <el-input placeholder="请输入文章标题" />
      </el-form-item>
    </el-form>
    <Editor
      :locale="zhHans"
      :upload-images="handleUploadFile"
      :value="value"
      :plugins="plugins"
      @change="handleChange"
    />
  </el-card>
</template>
<script lang="ts" setup>
import { Editor } from "@bytemd/vue-next";
import { reactive, toRefs, markRaw } from "vue";
import gfm from "@bytemd/plugin-gfm"; // 支持 GFM（自动链接文字、删除线、表格、任务列表）
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight-ssr"; // 代码高亮
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 放大图像
import breaks from "@bytemd/plugin-breaks";
import zhHans from "bytemd/locales/zh_Hans.json"; // 中文
import "juejin-markdown-themes/dist/juejin.min.css"; // 掘金同款样式

// 内容控件所支持的特殊功能插件列表，如：支持代码高亮、图片优化等。
// 插件列表
const pluginsList = [
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks()
  //
];
const state = reactive({
  value: "",
  plugins: markRaw(pluginsList)
});
const { value, plugins } = toRefs(state);

const handleChange = val => {
  console.log(val);
  state.value = val;
};
const handleUploadFile = files => {
  const imgUrl =
    "https://gimg3.baidu.com/search/src=http%3A%2F%2Fpics0.baidu.com%2Ffeed%2Fd01373f082025aaf7ee4d3c473a75d68024f1a46.jpeg%40f_auto%3Ftoken%3D494d4c323769e5dd89e717ab39dd3ea1&refer=http%3A%2F%2Fwww.baidu.com&app=2021&size=f360,240&n=0&g=0n&q=75&fmt=auto?sec=1698339600&t=627f5e7dc03e0de8d0f69b1030a2d08f";
  const fromData = new FormData();
  fromData.append("file", files[0]);
  // const res = await uploadImg(fromData)
  // console.log(res)
  return [
    {
      title: "xxx",
      url: imgUrl
    }
  ];
};
</script>
<style lang="scss" scoped>
.markdow-page {
  // width: 100%;
  height: 100%;
  :deep() {
    .bytemd {
      height: calc(70vh);
    }
  }
}
</style>
<!-- <template>
  <div class="markdown-page">
    <Editor
      :locale="zhHans"
      :value="mdValue"
      :plugins="mdPlugins"
      @change="handleChange"
      :upload-images="handleUploadImages"
      @paste="handlePaste"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Editor, Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight";
import frontmatter from "@bytemd/plugin-frontmatter";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import breaks from "@bytemd/plugin-breaks";
import zhHans from "bytemd/locales/zh_Hans.json";
import "bytemd/dist/index.css";
import "juejin-markdown-themes/dist/juejin.min.css";
// import { imgConverter, uploadImage, htmlToMarkdown } from "@/api/public";

const mdValue = ref("");

const mdPlugins = ref([
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks()
]);

const handleChange = (val: any) => {
  val.value = val;
};

const handlePaste = async (event: any) => {
  // 获取 'html' 格式的数据,数据是一个字符串，而不是实际的DOM元素
  const htmlData = event.clipboardData.getData("text/html");

  // 转成DOM元素
  const parser = new DOMParser();
  const doc: any = parser.parseFromString(htmlData, "text/html");

  // 由于粘贴的是第三方内容，图片需要处理一下
  const images = doc.getElementsByTagName("img");

  if (images.length) {
    const tasks: any = [];
    // 你是否会觉得下面的代码为啥要用images[i]而不用item？ 因为此处的images[i] != item
    Array.from(images).forEach((item: any, i: number) => {
      // 如果图片不是可信赖的（自己公司的）
      if (!images[i].src.includes("https://img.xxx.com")) {
        tasks.push(
          // 将第三方图片转成自己公司的，dataset是因为粘贴公众号的内容会发现公众号的图片没有src属性，需要转换一下
          imgConverter({ url: images[i].src || images[i].dataset.src }).then(
            (result: any) => {
              images[i].src = result.data;
            }
          )
        );
      }
    });
    await Promise.all(tasks);
  }
  // 转回html字符串传给后端
  const serializer = new XMLSerializer();
  let str = "";
  for (const node of doc.body.childNodes) {
    str += serializer.serializeToString(node);
  }

  htmlToMarkdown({ text: str }).then((res: any) => {
    mdValue.value = res.data;
  });
};

const handleUploadImages = async (files: any) => {
  const imgs: any = [];
  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    const fromData = new FormData();
    fromData.append("file", item);
    const res = await uploadImage(fromData); // 上传到阿里云
    imgs.push({
      title: item.name,
      url: res.url
    });
  }
  return imgs;
};
</script>

<style lang="scss" scoped>
.markdown-page {
  height: 100%;
  :deep() {
    .bytemd {
      height: 800px;
    }
  }
}
</style> -->
