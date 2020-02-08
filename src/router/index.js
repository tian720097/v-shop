import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: "/home",
    component: () => import("@/views/Home.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();

  }

  //获取token
  const tokenStr = window.sessionStorage.getItem('token');

  if (!tokenStr) {//没有登录 没有token 直接返回登录页
    return next('/login');
  }
  next();//放行

})
export default router
