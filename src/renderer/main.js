import Vue from 'vue'
import axios from 'axios'
import Element from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'
import 'element-ui/lib/theme-chalk/index.css'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
