import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { message } from "@/utils/message";
export const useUserStore = defineStore("user", {
  state: (): userType => ({
    // 用户名
    email: storageSession().getItem<DataInfo<number>>(sessionKey)?.email ?? "",
    // 页面级别权限
    role: storageSession().getItem<DataInfo<number>>(sessionKey)?.role ?? 0
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(email: string) {
      this.email = email;
    },
    /** 存储角色 */
    SET_ROLES(role: number) {
      this.role = role;
    },
    /** 登入 */
    async loginByEmail(data: any) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(response => {
            if (response.code == 200) {
              // setToken(response.data);
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
        const refreshToken = localStorage.getItem("refreshToken");
        // 没有 refershToken 直接退出,重新登录
        if (!refreshToken) {
          message("身份认证失败，请重新登录", { type: "error" });
          this.logOut();
          return;
        }
        refreshTokenApi({ refreshToken })
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
