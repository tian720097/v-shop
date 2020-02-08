import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/css/glob.css'
import axios from 'axios'
Vue.config.productionTip = false
axios.defaults.baseURL = '/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
