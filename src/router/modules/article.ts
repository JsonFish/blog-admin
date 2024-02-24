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
      name: "ArticleManage",
      component: () => import("@/views/article/addOrEditArticle/index.vue"),
      meta: {
        title: "文章管理",
        icon: Document
      }
    },
    {
      path: "/article/category",
      name: "Category",
      component: () => import("@/views/article/category/index.vue"),
      meta: {
        title: "专栏管理",
        icon: specialColumn
      }
    },
    {
      path: "/article/tag",
      name: "Tag",
      component: () => import("@/views/article/tag/index.vue"),
      meta: {
        title: "标签管理",
        icon: Tag
      }
    }
  ]
} as RouteConfigsTable;
