import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
// use feather icon
import FeatherIcon from '@/components/common/FeatherIcon.vue'
Vue.component(FeatherIcon.name, FeatherIcon)
// use bootstrap style
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// style scss
require('@/assets/scss/style.scss')
// use axios
import "@/axios"
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
