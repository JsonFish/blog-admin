<!--
  不自动上传，确认按钮上传
  限制上传为1的时候没加号
  有预览和删除图标
  avatar-uploader
 -->
<template>
  <div>
    <el-upload
      :class="[showUpload ? '' : 'hide-upload']"
      ref="uploadRef"
      v-model:file-list="uploadFileList"
      list-type="picture-card"
      :multiple="multiple"
      :action="uploadImgUrl"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-preview="perview"
      :on-remove="remove"
      :limit="limit"
      :auto-upload="true"
      :on-change="change"
      :on-exceed="handleExceed"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-image-viewer
      v-if="imageViewer"
      :url-list="uploadFileList.map((item:any) => item.url)"
      :initial-index="previewIndex"
      :teleported="true"
      :hide-on-click-modal="true"
      @close="closeImgViewer"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { UploadInstance } from "element-plus";

import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { getTokens, formatToken } from "@/utils/auth";

const props = defineProps({
  // 数量限制
  limit: {
    type: Number,
    default: 1
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 3
  },
  // 上传图片请求路径
  uploadImgUrl: {
    type: String,
    // default: `${import.meta.env.VITE_APP_BASE_API}/file/upload`
    default: "/api/file/upload"
  },
  // 是否可以一次上传多个文件
  multiple: {
    type: Boolean,
    default: false
  },
  // 默认上传图片数组 用于回显
  fileList: {
    type: Array<object>,
    default: () => {}
  }
  // 文件类型, 例如'png', 'jpg', 'jpeg',字符串，英文逗号隔开
  // fileType: {
  //   type: String,
  //   default: ".png,.jpg,.jpeg"
  // }
  // 上传的请求头部
  // headers: {
  //   required: false,
  //   default: { Authorization: `Bearer ${getToken()}` }
  // },
  // 上传请求的url
});
const emit = defineEmits(["upload"]);
// 请求头
const headers = {
  Authorization: formatToken(getTokens("accessToken"))
};
// 上传图片的列表
const uploadFileList = ref([]);
// 控制预览图片的显示隐藏
const imageViewer = ref<boolean>(false);
// 初始预览图像索引
const previewIndex = ref(0);
// 获取el-upload实例
const uploadRef = ref<UploadInstance>();
// 控制el-upload显示与隐藏
const showUpload = ref<boolean>(true);

// 文件状态改变时的钩子
const change = (uploadFile, uploadFiles) => {
  if (uploadFiles.length >= props.limit) {
    showUpload.value = false;
  }
};

// 文件上传前钩子
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    message("图片必须是 JPG 或 PNG 格式 !", { type: "error" });
    return false;
  } else if (rawFile.size / 1024 / 1024 > props.fileSize) {
    message(`图片大小不能超过 ${props.fileSize}!`, { type: "error" });
    return false;
  }
  return true;
};

// 文件上传超出限制回调函数
const handleExceed = () => {
  message(`最多上传 ${props.limit} 个文件!`, { type: "error" });
};

// 文件上传成功回调函数
const handleUploadSuccess: UploadProps["onSuccess"] = response => {
  if (response.code == 200) {
    emit("upload", response.data);
    message("上传成功", { type: "success" });
  } else {
    message(response.message, { type: "error" });
  }
};

// 预览
const perview = file => {
  previewIndex.value = uploadFileList.value.findIndex(
    (item: any) => item.uid == file.uid
  );
  imageViewer.value = true;
};

// 关闭预览
const closeImgViewer = () => {
  imageViewer.value = false;
};

// 移除
const remove = (file, files) => {
  if (files.length <= props.limit) {
    showUpload.value = true;
  }
};

// 监听 便于隐藏el-upload
watch(
  () => props.fileList,
  newVal => {
    uploadFileList.value = newVal;
    if (newVal.length >= props.limit) {
      showUpload.value = false;
    }
    if (!newVal.length) {
      showUpload.value = true;
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<style scoped>
.hide-upload {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
