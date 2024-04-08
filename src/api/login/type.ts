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

export interface LoginParmars {
  email: string;
  password: string;
  code: number | string;
}
