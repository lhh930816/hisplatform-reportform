import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode:"hash",
//  mode: "history", // 去掉#，需要路由模式改为history
//  base: '/dist/', // 这个配置也很重要，否则会出现页面空白情况
  routes: [{
      path: '/',
      redirect: '/GeneralReport'
    },
    {
      path: '/GeneralReport',
      component: resolve => require(['@/view/GeneralReport.vue'], resolve),
      meta: {
        title: '报表'
      }
    },
  ]
})
