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
//为路由对象，添加 beforeEach 导航守卫
//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  //// 如果用户访问的登录页，直接放行
  if (to.path === '/login') {
    return next();

  }
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token');
  // 没有token，强制跳转到登录页
  if (!tokenStr) {
    return next('/login');
  }
  next();//放行

})
export default router
