import Dynamic from "@/assets/svg/dynamic.svg?component";
export default {
  path: "/dynamic",
  meta: {
    title: "动态管理",
    icon: Dynamic,
    rank: 2
  },
  children: [
    {
      path: "/dynamic",
      name: "dynamic",
      component: () => import("@/views/dynamic/index.vue"),
      meta: {
        title: "动态管理"
      }
    }
  ]
};
