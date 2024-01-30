<template>
  <el-card class="markdow-page">
    <template #header>
      <div>新增文章</div>
    </template>
    <Editor
      :locale="zh"
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
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight"; // 代码高亮
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 缩放图片
import breaks from "@bytemd/plugin-breaks";
import zhHans from "bytemd/locales/zh_Hans.json";
import "bytemd/dist/index.css";
import "juejin-markdown-themes/dist/juejin.min.css"; // 掘金同款样式

// 内容控件所支持的特殊功能插件列表，如：支持代码高亮、图片优化等。
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
  plugins: markRaw(pluginsList),
  zh: zhHans
});
const { value, plugins, zh } = toRefs(state);

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
