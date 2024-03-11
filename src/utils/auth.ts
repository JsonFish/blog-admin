import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
  /** token */
  accessToken: string;
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string;
  /** 用户名 */
  username?: string;
  /** 当前登陆用户的角色 */
  role?: number;
  avatar?: string;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
// export function getToken(): DataInfo {
//   // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
//   return Cookies.get(TokenKey)
//     ? JSON.parse(Cookies.get(TokenKey))
//     : storageSession().getItem(sessionKey);
// }
export function getToken(key: string) {
  return localStorage.getItem(key);
}
/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  // let expires = 0;
  const { accessToken, refreshToken, username, avatar } = data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  if (username && avatar) {
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);
  }

  function setSessionKey(username: string, role: number) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(role);
    storageSession().setItem(sessionKey, {
      refreshToken,
      username,
      role
    });
  }

  if (data.username && data.role) {
    const { username, role } = data;
    setSessionKey(username, role);
  } else {
    const username =
      storageSession().getItem<DataInfo>(sessionKey)?.username ?? "";
    const role = storageSession().getItem<DataInfo>(sessionKey)?.role ?? 0;
    setSessionKey(username, role);
  }
}
// export function setToken(data) {
//   if (data.accessToken) {
//     localStorage.setItem("accessToken", data.accessToken);
//   }
//   if (data.refreshToken) {
//     localStorage.setItem("refreshToken", data.refreshToken);
//   }
// }
/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
