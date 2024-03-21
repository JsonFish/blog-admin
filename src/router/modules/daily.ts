import Daily from "@/assets/svg/dynamic.svg?component";
export default {
  path: "/daily",
  meta: {
    title: "日常管理",
    icon: Daily,
    rank: 2
  },
  children: [
    {
      path: "/daily",
      name: "Daily",
      component: () => import("@/views/daily/index.vue"),
      meta: {
        title: "日常管理"
      }
    }
  ]
};
