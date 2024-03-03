<template>
  <el-upload
    class="avatar-uploader"
    v-model:file-list="fileList"
    :action="uploadImgUrl"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="beforeUpload"
    :limit="limit"
    :on-exceed="handleExceed"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { getTokens, formatToken } from "@/utils/auth";

const props = defineProps({
  // imageUrl: {
  //   type: String,
  //   required: true
  // },
  // 数量限制
  limit: {
    type: Number,
    default: 2
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 2
  },
  // 上传图片url
  uploadImgUrl: {
    type: String,
    // default: `${import.meta.env.VITE_APP_BASE_API}/file/upload`
    default: "/api/file/upload"
  }
  // 文件类型, 例如'png', 'jpg', 'jpeg',字符串，英文逗号隔开
  // fileType: {
  //   type: String,
  //   default: ".png,.jpg,.jpeg"
  // },
  // 上传的请求头部
  // headers: {
  //   required: false,
  //   default: { Authorization: `Bearer ${getToken()}` }
  // },
  // 上传请求的url

  // 是否显示提示
  // isShowTip: {
  //   type: Boolean,
  //   default: true
  // },
  // 默认上传图片数组
  // fileList: {
  //   type: Array,
  //   required: false
  // },
  // 照片墙盒子的宽度
  // fileWidth: {
  //   type: String,
  //   default: "146px"
  // },
  // 照片墙盒子的高度
  // fileHeight: {
  //   type: String,
  //   default: "146px"
  // }
  // disabled: {
  //   type: Boolean,
  //   default: false
  // }
});
const fileList = reactive([]);
const emit = defineEmits(["uploadSuccess"]);
const headers = {
  Authorization: formatToken(getTokens("accessToken"))
};
const imageUrl = ref<string>("");

// 上传错误回调函数
const handleUploadError = error => {
  message(error, { type: "error" });
};
// 文件上传前回调函数
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    message("图片必须是 JPG 或 PNG 格式 !", { type: "error" });
    return false;
  } else if (rawFile.size / 1024 / 1024 > props.fileSize) {
    message(`图片大小不能 ${props.fileSize}MB!`, { type: "error" });
    return false;
  }
  return true;
};
// 文件上传超出限制回调函数
const handleExceed = () => {
  message(`上传文件数量不能超过 ${props.limit} 个!`, { type: "error" });
};
// 文件上传成功回调函数
const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  if (response.code == 200) {
    imageUrl.value = response.data.path;
    emit("uploadSuccess", response.data.path);
    message("上传成功", { type: "success" });
  } else {
    message("上传失败", { type: "error" });
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}
</style>
