<script setup lang="ts">
import { ref } from "vue";
import Upload from "@/views/fighting/index.vue";
defineOptions({
  name: "Home"
});
const uploadComponent = ref();
const fileList = ref([
  // {
  //   name: "food.jpeg",
  //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  // }
]);
const upload = fileData => {
  console.log(fileData);
};
</script>

<template>
  <el-card>
    <template #header>
      <div>首页</div>
    </template>
    <Upload
      ref="uploadComponent"
      v-model:fileList="fileList"
      :limit="1"
      multiple
      @upload="upload"
    />
  </el-card>
</template>
