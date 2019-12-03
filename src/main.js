// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import FormMaking from './index'
import {
  post,
  get
} from './api/index'
Vue.use(FormMaking)

Vue.use(ElementUI, {
  size: 'small'
})


//Vue.prototype.$axios = axios
Vue.prototype.$post = post;
Vue.prototype.$get = get;

//开发环境
if (process.env.NODE_ENV === "development") {
  Vue.prototype.baseURL = "/apis";
  
} else if (process.env.NODE_ENV === 'production') {   //生产环境
  $.ajax({
    url: 'serverconfig.json',
    async: false,
    type: 'get',
    dataType: 'json'
  }).done(function(data){
    if(data.ApiUrl) {
      Vue.prototype.baseURL = data.ApiUrl;
    }
  })
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
