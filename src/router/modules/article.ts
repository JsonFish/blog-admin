import Article from "@/assets/svg/article.svg?component";
import Document from "@iconify-icons/ri/article-line";
import specialColumn from "@iconify-icons/ri/layout-2-line";
import Tag from "@iconify-icons/ri/bookmark-3-line";
import Edit from "@iconify-icons/ri/file-edit-line";
export default {
  path: "/article",
  redirect: "/article/manage",
  meta: {
    icon: Article,
    title: "文章",
    rank: 1
  },
  children: [
    {
      path: "/article/manage",
      name: "ArticleManage",
      component: () => import("@/views/article/article/index.vue"),
      meta: {
        title: "文章管理",
        icon: Document
      }
    },
    {
      path: "/article/add",
      name: "AddArticle",
      component: () => import("@/views/article/editArticle/index.vue"),
      meta: {
        title: "新增文章",
        icon: Edit,
        showLink: true
      }
    },
    {
      path: "/category",
      name: "Category",
      component: () => import("@/views/article/category/index.vue"),
      meta: {
        title: "分类管理",
        icon: specialColumn
      }
    },
    {
      path: "/tag",
      name: "Tag",
      component: () => import("@/views/article/tag/index.vue"),
      meta: {
        title: "标签管理",
        icon: Tag
      }
    }
  ]
} as RouteConfigsTable;
