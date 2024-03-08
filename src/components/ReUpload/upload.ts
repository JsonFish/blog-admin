import { uploadFile } from "@/api/file";
import { message } from "@/utils/message";
// 上传文件函数返回列表对象格式
export const uploadFileList = async fileList => {
  if (fileList) {
    return await Promise.all(
      fileList.map(file => {
        const form = new FormData();
        form.append("file", file.raw);
        return new Promise((rev, rej) => {
          uploadFile(form)
            .then(res => {
              if (res.code == 200) return rev(res.data);
              message(res.message, { type: "error" });
            })
            .catch(error => rej(error));
        });
      })
    );
  }
};
