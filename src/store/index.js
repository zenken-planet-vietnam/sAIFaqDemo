import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import auth from './modules/auth'
import page from './modules/page'
import category from "./modules/category"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    page,
    category
  },
  strict: process.env.DEV,
})
