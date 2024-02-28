import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** `accessToken`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string;
  /** 用户名 */
  email?: string;
  /** 当前登陆用户的角色 */
  role?: number;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}
export function getTokens(key: string) {
  return localStorage.getItem(key);
}
/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo<Date>) {
  let expires = 0;
  const { accessToken, refreshToken } = data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  expires = new Date(data.expires).getTime(); // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
  // const cookieString = JSON.stringify({ accessToken, expires });

  // expires > 0
  //   ? Cookies.set(TokenKey, cookieString, {
  //     expires: (expires - Date.now()) / 86400000
  //   })
  //   : Cookies.set(TokenKey, cookieString);

  function setSessionKey(username: string, role: number) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(role);
    storageSession().setItem(sessionKey, {
      refreshToken,
      expires,
      username,
      role
    });
  }

  if (data.email && data.role) {
    const { email, role } = data;
    setSessionKey(email, role);
  } else {
    const username =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.email ?? "";
    const role =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.role ?? [];
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
