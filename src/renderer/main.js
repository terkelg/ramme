import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'

import './assets/styles/app.less'

import App from './App'
import router from './router'
import store from './store'
import db from './datastore'

Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios
Vue.db = Vue.prototype.$db = db
Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

export { app, router, store }
