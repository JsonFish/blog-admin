<script setup lang="ts">
import { ref } from "vue";
import Upload from "@/views/fighting/effort.vue";
defineOptions({
  name: "Home"
});
const fileList = ref([]);
const uploadRef = ref();
const upload = () => {
  uploadRef.value.handUploadFile();
};
const getUrl = fileUrl => {
  console.log(fileUrl);
};
</script>

<template>
  <el-card>
    <template #header>
      <div>首页</div>
    </template>
    <Upload
      ref="uploadRef"
      v-model:fileList="fileList"
      :limit="2"
      multiple
      :autoUpload="true"
      @uploadResponse="getUrl"
    />
    <template #footer>
      <el-button @click="upload">上传</el-button>
    </template>
  </el-card>
</template>
