<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
// import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
// import { initRouter, getTopMenu } from "@/router/utils";

import { addPathMatch } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";

import { bg, logo, illustration } from "./utils/static";
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
import { getCaptcha } from "@/api/login";
import type { LoginParmars } from "@/api/login/type";
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
const loginForm = reactive<LoginParmars>({
  email: "test@qq.com",
  password: "123456",
  code: ""
});

// 获取图片验证码
const getCaptchaImg = async () => {
  loginForm.code = "";
  const result: BasicResponse = await getCaptcha();
  captchaImage.value = `data:image/jpg;base64,${result.data.imageBase64}`;
};

// 图片验证码防抖
let time: any = null;
const debounce = async () => {
  if (time == null) {
    await getCaptchaImg();
  }
  clearTimeout(time);
  time = setTimeout(() => {
    time = null;
  }, 1000);
};

// 登录
const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    // fields 校验提示消息
    if (valid) {
      loading.value = true;
      useUserStore()
        .loginByEmail(loginForm)
        .then(
          response => {
            if (response.code != 200) {
              return;
            }

            // 静态路由模式
            usePermissionStoreHook().handleWholeMenus([]);
            addPathMatch();
            router.push("/");
            message("登录成功", { type: "success" });
          },
          reason => {
            message(reason.message, { type: "error" });
            loading.value = false;
            getCaptchaImg();
          }
        );
    } else {
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
  getCaptchaImg();
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
          <logo class="avatar" />
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
                  style="width: 65%"
                />

                <div
                  style="width: 30%; height: 100%; margin-left: 5%"
                  @click="debounce"
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
    <div class="link">
      <el-link :underline="false" href="https://beian.miit.gov.cn"
        >豫IP备2024057248号</el-link
      >
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
.link {
  width: 100%;
  position: fixed;
  bottom: 0;
  text-align: center;
}
</style>
