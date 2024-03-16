<script setup lang="ts">
import { ref } from "vue";
import Upload from "@/components/ReUpload/index.vue";
import { uploadFiles } from "@/api/file";
defineOptions({
  name: "Home"
});
const fileList = ref([
  {
    url: "http://sa6qp7vwh.hb-bkt.clouddn.com/1710462107180.png"
  },
  {
    url: "http://sa6qp7vwh.hb-bkt.clouddn.com/1710462107180.png"
  }
]);
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
        uploadFiles(form)
          .then(res => rev(res.data))
          .catch(error => rej(error));
      });
    })
  );
  console.log(res);
};
</script>

<template>
  <el-card style="height: 100%">
    <template #header>
      <div>首页</div>
    </template>
    <Upload
      ref="uploadRef"
      v-model:fileList="fileList"
      :limit="4"
      multiple
      @getFileList="getFileList"
    />
    <el-button @click="uploadFun">上传</el-button>
  </el-card>
</template>
