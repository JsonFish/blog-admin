const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");
import Home from "@/assets/svg/home.svg?component";
export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: Home,
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Home",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "首页",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
