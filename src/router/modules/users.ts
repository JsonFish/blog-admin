// 最简代码，也就是这些字段必须有
import User from "@/assets/svg/user.svg?component";
export default {
  path: "/users",
  meta: {
    title: "用户管理",
    icon: User,
    rank: 3
  },
  children: [
    {
      path: "/users/manage",
      name: "Users",
      component: () => import("@/views/users/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
};
