<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
// import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
// import { useUserStoreHook } from "@/store/modules/user";
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
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
// const { title } = useNav();
// 图片验证码 svg格式
const captchaSvg = ref<SVGAElement>();
// 后端返回来的验证码
const captcha = ref<string>("");
const ruleForm = reactive({
  email: "test@qq.com",
  password: "admin123",
  captcha: ""
});
// 登录
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    // const result: any = await useUserStoreHook().loginByUsername(ruleForm);
    // console.log(result);
    // console.log(fields);
    if (valid) {
      // 判断用户输入的验证码是否正确
      if (ruleForm.captcha.toLowerCase() == captcha.value.toLowerCase()) {
        useUserStore()
          .loginByEmail(ruleForm)
          .then(
            res => {
              // 静态路由模式
              if (res.code == 200) {
                usePermissionStoreHook().handleWholeMenus([]);
                addPathMatch();
                setToken({
                  accessToken: res.data.token
                } as any);
                router.push("/");
                message("登录成功", { type: "success" });
              }
            },
            reason => {
              message(reason.message, { type: "error" });
              getCaptchaImg();
              loading.value = false;
              return fields;
            }
          );
      } else {
        message("验证码错误", { type: "error" });
        ruleForm.captcha = "";
        getCaptchaImg();
        loading.value = false;
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

// 获取图片验证码
const getCaptchaImg = async () => {
  const result: any = await getCaptcha();
  captcha.value = result.data.captcha;
  captchaSvg.value = result.data.img;
};

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
          <avatar class="avatar" />
          <Motion>
            <!-- <h2 class="outline-none">{{ title }}</h2> -->
            <h2 class="outline-none">JSON's blogadmin</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
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
                  v-model="ruleForm.email"
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
                  v-model="ruleForm.password"
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
                prop="captcha"
              >
                <el-input
                  clearable
                  v-model="ruleForm.captcha"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon(captchaIcon)"
                  style="width: 65%"
                />
                <div
                  style="width: 30%; height: 100%; margin-left: 2%"
                  v-html="captchaSvg"
                  @click="getCaptchaImg"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
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
