import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";

// 进度条
import NProgress from "../progress";
// import { setToken } from "@/utils/auth";
import { getTokens, formatToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
// import { refreshTokenApi } from "@/api/user";
import { message } from "@/utils/message";
// import { useRouter } from "vue-router";
// const router = useRouter();
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 5000,
  // 请求头
  headers: {
    Accept: "application/json, text/plain, multipart/form-data, */*",
    "X-Requested-With": "XMLHttpRequest"
  },
  baseURL: "/api", // 向 /api 路径发请求(会被vite拦截跨域)
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  /** token过期后，暂存待执行的请求 */
  private static requests = [];
  /** 防止重复刷新token */
  private static isRefreshing = false;
  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};
  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  // private static retryOriginalRequest(config: PureHttpRequestConfig) {
  //   return new Promise(resolve => {
  //     PureHttp.requests.push((token: string) => {
  //       config.headers["Authorization"] = formatToken(token);
  //       resolve(config);
  //     });
  //   });
  // }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // if (!getTokens("accessToken")) {
        //   console.log("accessToken", getTokens("accessToken"));
        //   return config;
        // }
        config.headers["Authorization"] = formatToken(getTokens("accessToken"));
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        // const whiteList = ["/refreshToken", "/user/login"];
        // return whiteList.some(v => config.url.indexOf(v) > -1)
        //   ? config
        //   : new Promise(resolve => {
        //       const data = getToken();
        //       if (data) {
        //         // 获取当前时间
        //         const now = new Date().getTime();
        //         // 获取accessToken过期时间
        //         const expired = parseInt(data.expires) - now <= 0;
        //         if (expired) {
        //           if (!PureHttp.isRefreshing) {
        //             PureHttp.isRefreshing = true;
        //             // token过期刷新
        //             useUserStoreHook()
        //               .handRefreshToken({ refreshToken: data.refreshToken })
        //               .then(res => {
        //                 const token = res.data.accessToken;
        //                 config.headers["Authorization"] = formatToken(token);
        //                 PureHttp.requests.forEach(cb => cb(token));
        //                 PureHttp.requests = [];
        //               })
        //               .finally(() => {
        //                 PureHttp.isRefreshing = false;
        //               });
        //           }
        //           resolve(PureHttp.retryOriginalRequest(config));
        //         } else {
        //           config.headers["Authorization"] = formatToken(
        //             data.accessToken
        //           );
        //           resolve(config);
        //         }
        //       } else {
        //         resolve(config);
        //       }
        //     });
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        // refershToken 过期
        if (response.data.code == 401) {
          message(response.data.message, { type: "error" });
          useUserStore().logOut();
        }
        // 无权限操作数据
        if (response.data.code == 403) {
          message(response.data.message, { type: "error" });
          return;
        }

        return response.data;
      },
      // 错误响应拦截
      async (error: PureHttpError) => {
        // accessToken过期 不是刷新refreshToken过期
        if (
          error.response.status === 401 &&
          error.config.url != "/refershToken"
        ) {
          // 判断是否正在刷新token
          const config = error.config;

          if (!PureHttp.isRefreshing) {
            PureHttp.isRefreshing = true;
            return useUserStore()
              .handRefreshToken()
              .then(
                // token刷新成功
                response => {
                  console.log("token 刷新成功");
                  const token = response.data.accessToken;
                  // 设置 Authorization 字段
                  PureHttp.axiosInstance.defaults.headers.common.Authorization =
                    formatToken(token);
                  // //执行requests队列中的请求，（requests中存的不是请求参数，而是请求的Promise函数，这里直接拿来执行就好）
                  PureHttp.requests.forEach(cb => cb(token));
                  // 执行requests队列中的请求后赋值为空
                  PureHttp.requests = [];
                  //重新执行当前未执行成功的请求并返回
                  return instance.request(config);
                },
                // token刷新失败 退出登录
                reason => {
                  PureHttp.isRefreshing = false;
                  message(reason.message, { type: "error" });
                }
              )
              .catch(err => {
                PureHttp.isRefreshing = false;
                throw err;
              })
              .finally(() => {
                PureHttp.isRefreshing = false;
              });
          } else {
            // 如果正在刷新token，将刷新token过程中的发起的请求存储起来
            return new Promise(resolve => {
              // 将请求放进队列，用一个函数形式来保存，等token刷新后直接执行
              PureHttp.requests = [
                ...PureHttp.requests,
                token =>
                  resolve(
                    instance.request({
                      ...error.config,
                      headers: {
                        ...(error.config.headers || {}),
                        Authorization: formatToken(token)
                      }
                    })
                  )
              ];
              // PureHttp.requests.push(() => {
              //   resolve(instance.request(config));
              // });
            });
          }
        } else {
          const $error = error;
          let msg: string;
          if ($error.response.status) {
            switch ($error.response.status) {
              case 404:
                msg = "页面未找到";
                break;
              case 500:
                msg = "系统维护中";
                break;
              case 505:
                msg = "网络错误";
            }
            message(msg, { type: "error" });
          }
          $error.isCancelRequest = Axios.isCancel($error);
          // 所有的响应异常 区分来源为取消请求/非取消请求
          return Promise.reject($error);
        }
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp();
