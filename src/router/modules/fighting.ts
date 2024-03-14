// 最简代码，也就是这些字段必须有
export default {
  path: "/fighting",
  meta: {
    rank: 9
  },

  children: [
    {
      path: "/fighting",
      name: "Fighting",
      component: () => import("@/views/fighting/index.vue"),
      meta: {
        title: "加油"
      }
    }
  ]
};
