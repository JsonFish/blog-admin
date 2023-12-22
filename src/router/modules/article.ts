export default {
  path: "/article",
  redirect: "/article/manage",
  meta: {
    icon: "informationLine",
    title: "文章",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/article/manage",
      name: "",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: "文章管理"
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "发布文章"
      }
    },
    {
      path: "/error/500",
      name: "500",
      component: () => import("@/views/error/500.vue"),
      meta: {
        title: "500"
      }
    }
  ]
} as RouteConfigsTable;
