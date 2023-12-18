<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Fighting"
});
import { testapi } from "@/api/user";
const test = async () => {
  const result = await testapi();
  console.log(result);
};
</script>

<template>
  <div>
    <h1>加油</h1>
    <el-button @click="test">test</el-button>
  </div>
</template>
