import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import auth from './modules/auth'
import page from './modules/page'
import category from "./modules/category"
import config from "./modules/config"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    page,
    category,
    config
  },
  strict: process.env.DEV,
})
