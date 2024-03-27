import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为6-16位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  // /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,16}$/;
  /^[a-zA-Z0-9]{5,15}$/; // 由5到15位英文或者数字组成

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error("密码格式应为5-15位数字, 字母或两种组合"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
