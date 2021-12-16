/* eslint-disable no-unused-vars */
import Router from "vue-router"
import Vue from 'vue'
import { isUserLoggedIn, canNavigate } from '@core/auth/utils'
Vue.use(Router)


const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'search-page',
            component: () => import('@/components/SearchPage.vue')
        },
        {
            path: '/login',
            name: 'auth-login',
            component: () => import('@/components/Login.vue'),
            meta: {
                layout: 'full'
            }
        },
    ]
})

router.beforeEach((to, _, next) => {
    if (!canNavigate(to)) {
        const isLoggedIn = isUserLoggedIn()
        //   Redirect to login if not logged in
        if (!isLoggedIn) return next({ name: 'auth-login' })
    }

    return next()
})

export default router