// 最简代码，也就是这些字段必须有
import friendlink from "@/assets/svg/dynamic.svg?component";
export default {
  path: "/dynamic",
  meta: {
    title: "动态管理",
    icon: friendlink,
    rank: 6
  },
  children: [
    {
      path: "/dynamic",
      name: "dynamic",
      component: () => import("@/views/friendlink/index.vue"),
      meta: {
        title: "动态管理"
      }
    }
  ]
};
