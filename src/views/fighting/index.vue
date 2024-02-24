<template>
  <Viewer :locale="zh" :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import { reactive, toRefs, markRaw } from "vue";
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight-ssr"; // 代码高亮
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 缩放图片
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
  plugins: markRaw(pluginsList),
  zh: zhHans
});
const { value, plugins, zh } = toRefs(state);
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
