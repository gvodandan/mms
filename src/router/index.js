import Vue from "vue";
import VueRouter from "vue-router";
// import Login from "../views/login/index.vue"
//下面情况会默认导入../views/login目录下的index.vue组件
import Login from "../views/login"
import Layout from "../components/Layout.vue"
import Home from "../views/home"
import Member from "../views/member"
import Staff from "../views/staff"
import Supplier from "../views/supplier"
import Goods from "../views/goods"

// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const routes = [
  {
    path: '/login',
    name: 'login',  //只是给路由取的一个名称
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: Home,
        meta: { title: '首页' }
      },
    ]
  },
  {
    path: "/member",
    component: Layout,
    children: [
      {
        path: "/",    //    /member/
        component: Member,
        meta: { title: '会员管理' }
      }
    ]
  },
  {
    path: "/supplier",
    component: Layout,
    children: [
      {
        path: "/",
        component: Supplier,
        meta: { title: '供应商管理' }
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: "/",
        component: Goods,
        meta: { title: '商品管理' }
      }
    ]
  },
  {
    path: "/staff",
    component: Layout,
    children: [
      {
        path: "/",
        component: Staff,
        meta: { title: '员工管理' }

      }
    ]
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
