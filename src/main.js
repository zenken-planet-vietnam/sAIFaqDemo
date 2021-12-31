/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from "@/router"
import FeatherIcon from '@/components/questions/FeatherIcon.vue'
Vue.component(FeatherIcon.name, FeatherIcon)
// Import Bootstrap an BootstrapVue CSS files (order is important)
// require('@/assets/scss/app.scss')
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@axios'
import store from "@/store"
// style scss
require('@/assets/scss/style.scss')


Vue.config.productionTip = false
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
