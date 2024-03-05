// 最简代码，也就是这些字段必须有
import friendlink from "@/assets/svg/friendlink.svg?component";
export default {
  path: "/friendLink",
  meta: {
    title: "友链管理",
    icon: friendlink,
    rank: 4
  },
  children: [
    {
      path: "/friendLink",
      name: "friendLink",
      component: () => import("@/views/friendlink/index.vue"),
      meta: {
        title: "友链管理"
      }
    }
  ]
};
