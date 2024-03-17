import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  HttpError,
  RequestMethods,
  HttpResponse,
  HttpRequestConfig
} from "./types.d";
import { stringify } from "qs";

// 进度条
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
import { message } from "@/utils/message";
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
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

class Http {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  /** token过期后，暂存待执行的请求 */
  private static requests = [];
  /** 防止重复刷新token */
  private static isRefreshing = false;
  /** 初始化配置对象 */
  private static initConfig: HttpRequestConfig = {};
  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      async (config: HttpRequestConfig): Promise<any> => {
        // 如果是刷新token接口 更换token
        if (config.url == "/refreshToken") {
          config.headers["Authorization"] = formatToken(
            getToken("refreshToken")
          );
        } else {
          config.headers["Authorization"] = formatToken(
            getToken("accessToken")
          );
        }

        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (Http.initConfig.beforeRequestCallback) {
          Http.initConfig.beforeRequestCallback(config);
          return config;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = Http.axiosInstance;
    instance.interceptors.response.use(
      // 成功响应拦截
      (response: HttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (Http.initConfig.beforeResponseCallback) {
          Http.initConfig.beforeResponseCallback(response);
          return response.data;
        }

        return response.data;
      },
      // 失败响应拦截
      async (error: HttpError) => {
        // accessToken过期 不是refreshToken过期
        if (
          error.response.status === 401 &&
          error.config.url != "/refreshToken"
        ) {
          const config = error.config;
          // 判断是否正在刷新token
          if (!Http.isRefreshing) {
            Http.isRefreshing = true;
            return useUserStore()
              .handRefreshToken()
              .then(
                // token刷新成功
                response => {
                  const token = response.data.accessToken;
                  // 设置 Authorization 字段
                  Http.axiosInstance.defaults.headers.common.Authorization =
                    formatToken(token);
                  // //执行requests队列中的请求，（requests中存的不是请求参数，而是请求的Promise函数，这里直接拿来执行就好）
                  Http.requests.forEach(cb => cb(token));
                  // 执行requests队列中的请求后赋值为空
                  Http.requests = [];
                  //重新执行当前未执行成功的请求并返回
                  return instance.request(config);
                },
                reason => {
                  Http.isRefreshing = false;
                  message(reason.message, { type: "error" });
                }
              )
              .catch(err => {
                Http.isRefreshing = false;
                throw err;
              })
              .finally(() => {
                Http.isRefreshing = false;
              });
          } else {
            // 如果正在刷新token，将刷新token过程中的发起的请求存储起来
            return new Promise(resolve => {
              // 将请求放进队列，用一个函数形式来保存，等token刷新后直接执行
              Http.requests = [
                ...Http.requests,
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
            });
          }
        }
        // refreshToken 过期
        else if (
          error.response.status === 401 &&
          error.config.url == "/refreshToken"
        ) {
          Http.isRefreshing = false;
          message("身份过期 , 请重新登录", { type: "error" });
          useUserStore().logOut();
        } else {
          Http.isRefreshing = false;
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
    axiosConfig?: HttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as HttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      Http.axiosInstance
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
    config?: HttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: HttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new Http();
