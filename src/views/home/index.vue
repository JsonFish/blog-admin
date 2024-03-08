<script setup lang="ts">
import { ref } from "vue";
import Upload from "@/components/ReUpload/test.vue";
import { uploadFile } from "@/api/file";
defineOptions({
  name: "Home"
});
const fileList = ref([]);
const uploadRef = ref();
const files = ref([]);
const getFileList = async fileList => {
  files.value = fileList;
};

const uploadFun = async () => {
  const res = await Promise.all(
    files.value.map(file => {
      const form = new FormData();
      form.append("file", file.raw);
      return new Promise((rev, rej) => {
        uploadFile(form)
          .then(res => rev(res.data))
          .catch(error => rej(error));
      });
    })
  );
  console.log(res);
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
      :limit="5"
      multiple
      :autoUpload="true"
      @getFileList="getFileList"
    />
    <el-button @click="uploadFun" />
  </el-card>
</template>
