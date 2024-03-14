// 最简代码，也就是这些字段必须有
import LeaveWord from "@/assets/svg/leaveWord.svg?component";
export default {
  path: "/messgae",
  meta: {
    title: "留言管理",
    icon: LeaveWord,
    rank: 3
  },
  children: [
    {
      path: "/messgae",
      name: "Messgae",
      component: () => import("@/views/message/index.vue"),
      meta: {
        title: "留言管理"
      }
    }
  ]
};
