import { uploadFiles } from "@/api/file";
import { UrlInfo } from "@/api/file/type";
import { message } from "@/utils/message";
import type { UploadUserFile } from "element-plus";
// 上传多个文件函数返回列表对象格式
export const uploadFileList: UrlInfo[] | any = async (
  fileList: UploadUserFile[]
) => {
  if (fileList) {
    return await Promise.all(
      fileList.map(file => {
        const form = new FormData();
        form.append("file", file.raw);
        return new Promise((rev, rej) => {
          uploadFiles(form)
            .then(res => {
              if (res.code == 200) return rev(res.data);
              message(res.message, { type: "error" });
              return rej(res);
            })
            .catch(error => rej(error));
        });
      })
    );
  }
};
// 上传单个文件返回对象格式
export const uploadFile: UrlInfo | any = async (fileList: UploadUserFile[]) => {
  if (fileList) {
    const form = new FormData();
    form.append("file", fileList[0].raw);
    return new Promise((rev, rej) => {
      uploadFiles(form)
        .then(res => {
          if (res.code == 200) return rev(res.data);
          message(res.message, { type: "error" });
          return rej(res);
        })
        .catch(error => rej(error));
    });
  }
};
