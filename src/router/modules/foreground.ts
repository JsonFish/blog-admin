import Foreground from "@/assets/svg/foreground.svg?component";
import Picture from "@iconify-icons/ep/picture";
import Memo from "@iconify-icons/ep/memo";
export default {
  path: "/foreground",
  redirect: "/information",
  meta: {
    icon: Foreground,
    title: "前台管理",
    rank: 8
  },
  children: [
    {
      path: "/information",
      name: "Information",
      component: () => import("@/views/foreground/information/index.vue"),
      meta: {
        title: "信息管理",
        icon: Memo
      }
    },
    {
      path: "/background",
      name: "Background",
      component: () => import("@/views/foreground/background/index.vue"),
      meta: {
        title: "背景管理",
        icon: Picture
      }
    }
  ]
} as RouteConfigsTable;
