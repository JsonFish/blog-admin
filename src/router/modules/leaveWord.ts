// 最简代码，也就是这些字段必须有
import LeaveWord from "@/assets/svg/leaveWord.svg?component";
export default {
  path: "/leaveWord",
  meta: {
    title: "留言管理",
    icon: LeaveWord,
    rank: 3
  },
  children: [
    {
      path: "/leaveWord",
      name: "leaveWord",
      component: () => import("@/views/leaveWord/index.vue"),
      meta: {
        title: "留言管理"
      }
    }
  ]
};
