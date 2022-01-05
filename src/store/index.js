import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import auth from './modules/auth'
import page from './modules/page'
import category from "./modules/category"
import config from "./modules/config"
import analytic from "./modules/analytic"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    page,
    category,
    config,
    analytic
  },
  strict: process.env.DEV,
})
