import { http } from "@/utils/http";

export interface LoginResult {
  code: number;
  data: {
    avatar: string;
    /** 用户名 */
    username: string;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
  };
  message: string;
}

export type RefreshTokenResult = {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
};

/** 获取图片验证码 */
export const getCaptcha = () => {
  return http.get<any, BaseResponse<any>>("/imageCaptcha");
};

/** 登录 */
export const getLogin = (data: object) => {
  return http.post<any, LoginResult>("/login", { data });
};

/** 刷新token */
export const refreshTokenApi = () => {
  return http.request<RefreshTokenResult>("get", "/refreshToken");
};
