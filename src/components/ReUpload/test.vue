<template>
  <div>
    <el-upload
      :class="[showUpload ? '' : 'hide-upload']"
      ref="uploadRef"
      v-model:file-list="uploadFileList"
      list-type="picture-card"
      :multiple="multiple"
      action="#"
      :before-upload="beforeUpload"
      :on-preview="perview"
      :on-remove="remove"
      :limit="limit"
      :auto-upload="autoUpload"
      :on-change="change"
      :on-exceed="handleExceed"
      :http-request="handleFileUpload"
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
import { uploadFile } from "@/api/file";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";

const props = defineProps({
  // 数量限制
  limit: {
    type: Number,
    default: 1
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 2
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
  },
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: false
  }
  // 文件类型, 例如'png', 'jpg', 'jpeg',字符串，英文逗号隔开
  // fileType: {
  //   type: String,
  //   default: ".png,.jpg,.jpeg"
  // }
});
const emit = defineEmits(["uploadResponse"]);
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
    message(`图片大小不能超过 ${props.fileSize}MB!`, { type: "error" });
    return false;
  }
  return true;
};

// 文件上传超出限制回调函数
const handleExceed = () => {
  message(`最多上传 ${props.limit} 个文件!`, { type: "error" });
};

// 手动上传
const handUploadFile = () => {
  uploadRef.value.submit();
};

// 自定义上传函数 参数为上传的文件
const handleFileUpload = async file => {
  const response = await uploadFile(file);
  emit("uploadResponse", response.data);
};

defineExpose({ handUploadFile });

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

// 监听props.fileList 便于隐藏el-upload
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
