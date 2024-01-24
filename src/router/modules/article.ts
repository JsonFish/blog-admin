import Article from "@iconify-icons/ri/article-fill";
import Document from "@iconify-icons/ep/document";
import specialColumn from "@iconify-icons/ri/layout-2-line";
import Tag from "@iconify-icons/ri/bookmark-3-line";
export default {
  path: "/article",
  redirect: "/article/manage",
  meta: {
    icon: Article,
    title: "文章",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/article/manage",
      name: "articleManage",
      component: () => import("@/views/article/articleManage/index.vue"),
      meta: {
        title: "文章管理",
        icon: Document
      }
    },
    {
      path: "/article/category",
      name: "category",
      component: () => import("@/views/article/categoryManage/index.vue"),
      meta: {
        title: "专栏管理",
        icon: specialColumn
      }
    },
    {
      path: "/article/tag",
      name: "tagManage",
      component: () => import("@/views/article/tagManage/index.vue"),
      meta: {
        title: "标签管理",
        icon: Tag
      }
    }
  ]
} as RouteConfigsTable;
