import { http } from "@/utils/http";
import { FileData } from "./type";
export const uploadFiles = (data: FormData) => {
  return http.request<BasicResponse<FileData>>(
    "post",
    "/file/upload",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
