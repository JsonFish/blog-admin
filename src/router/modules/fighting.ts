// 最简代码，也就是这些字段必须有
export default {
  path: "/fighting",
  meta: {
    title: "励志",
    rank: 999
  },

  children: [
    {
      path: "/fighting/index",
      name: "Fighting",
      component: () => import("@/views/fighting/index.vue"),
      meta: {
        title: "加油"
      }
    },
    {
      path: "/fighting/effort",
      name: "Effort",
      component: () => import("@/views/fighting/effort.vue"),
      meta: {
        title: "努力"
      }
    }
  ]
};
