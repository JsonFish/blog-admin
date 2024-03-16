import { http } from "@/utils/http";
enum API {
  Dynamic = "/daily"
}
export const getDynamic = () => {
  return http.request<BasicResponse>("get", API.Dynamic);
};
export const addDynamic = (data: any) => {
  return http.request<BasicResponse>("post", API.Dynamic, { data });
};
export const deleteDynamic = (data: any) => {
  return http.request<BasicResponse>("delete", API.Dynamic, { data });
};
