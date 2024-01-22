<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
// import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
// import { initRouter, getTopMenu } from "@/router/utils";

import { setToken } from "@/utils/auth";
import { addPathMatch } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";

import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import captchaIcon from "@/assets/svg/captcha.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Email from "@iconify-icons/ri/mail-line";
// import { useUserMedia } from "@vueuse/core";
import { useUserStore } from "@/store/modules/user";
import { getCaptcha } from "@/api/user";
defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref<boolean>(false);
const loginFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
// const { title } = useNav();
// 图片验证码 base64格式
const captchaImage = ref<string>();
const loginForm = reactive({
  // email: "test@qq.com",
  // password: "admin123",
  // captcha: ""
  email: "1557392527@qq.com",
  password: "123456",
  code: "",
  captchaId: ""
});
// 获取图片验证码
const getCaptchaImg = async () => {
  loginForm.code = "";
  const result: any = await getCaptcha();
  captchaImage.value = `data:image/jpg;base64,${result.data.imageBase64}`;
  loginForm.captchaId = result.data.id;
};
getCaptchaImg();
// 登录
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    // fields 校验提示消息
    if (valid) {
      useUserStore()
        .loginByEmail(loginForm)
        .then(
          res => {
            // 静态路由模式
            console.log(res);
            usePermissionStoreHook().handleWholeMenus([]);
            addPathMatch();
            setToken({
              accessToken: res.data.accessToken
            } as any);
            router.push("/");
            message("登录成功", { type: "success" });
          },
          reason => {
            message(reason.errorMessage, { type: "error" });
            getCaptchaImg();
            loading.value = false;
            return fields;
          }
        );
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(loginFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <!-- <h2 class="outline-none">{{ title }}</h2> -->
            <h2 class="outline-none">JSON's blogAdmin</h2>
          </Motion>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                  }
                ]"
                prop="email"
              >
                <el-input
                  clearable
                  v-model="loginForm.email"
                  placeholder="邮箱"
                  :prefix-icon="useRenderIcon(Email)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="loginForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                  }
                ]"
                prop="code"
              >
                <el-input
                  clearable
                  v-model="loginForm.code"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon(captchaIcon)"
                  style="width: 60%"
                />

                <div
                  style="width: 35%; height: 100%; margin-left: 5%"
                  @click="getCaptchaImg"
                >
                  <img
                    style="width: 100%; height: 100%"
                    :src="captchaImage"
                    alt=""
                  />
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(loginFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
