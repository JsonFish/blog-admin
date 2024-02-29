import { http } from "@/utils/http";

export interface UserResult {
  code: number;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    role: number;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
  message: string;
}

export type RefreshTokenResult = {
  code: number;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    // /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    // expires: Date;
  };
  message: string;
};

/** 获取图片验证码 */
export const getCaptcha = () => {
  return http.get<any, UserResult>("/user/imageCaptcha");
};

/** 登录 */
export const getLogin = (data: object) => {
  return http.post<any, UserResult>("/user/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data: object) => {
  return http.request<RefreshTokenResult>("post", "/user/refreshToken", {
    data
  });
};
