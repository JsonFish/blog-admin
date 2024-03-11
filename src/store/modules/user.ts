import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/login";
import { LoginResult, RefreshTokenResult } from "@/api/login";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
export const useUserStore = defineStore("user", {
  state: (): userType => ({
    avatar: localStorage.getItem("avatar"),
    // 用户名
    username: localStorage.getItem("username"),
    // storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    // 页面级别权限
    role: storageSession().getItem<DataInfo>(sessionKey)?.role ?? 0
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(role: number) {
      this.role = role;
    },
    /** 登入 */
    async loginByEmail(data: any) {
      return new Promise<LoginResult>((resolve, reject) => {
        getLogin(data)
          .then(response => {
            if (response.code == 200) {
              setToken(response.data);
              resolve(response);
            } else {
              reject(response);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 退出登录（不调用接口） */
    logOut() {
      this.email = "";
      this.role = 0;
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      // resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken() {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi()
          .then(response => {
            // 刷新成功
            if (response.code == 200) {
              // 存储token
              setToken({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
              } as any);
              resolve(response);
            } else {
              reject(response);
            }
          })
          .catch(error => {
            throw error;
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
