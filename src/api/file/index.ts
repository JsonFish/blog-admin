import { http } from "@/utils/http";

export const uploadFile = (data: any) => {
  return http.request<BaseResponse<any>>(
    "post",
    "/file/upload",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest"
      }
    }
  );
};
