import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";

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
          .then(reponse => {
            console.log(reponse);
            if (reponse.code == 200) {
              setToken(reponse.data);
              resolve(reponse);
            } else {
              reject(reponse);
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
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
