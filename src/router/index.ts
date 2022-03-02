import VueRouter, { RouteConfig } from "vue-router"
import Vue from 'vue'
import { isUserLoggedIn, canNavigate } from '@/@core/auth/utils'
Vue.use(VueRouter)

export const constantRoutes: RouteConfig[] = [
    {
        path: '/',
        name: 'search-page',
        component: () => import('@/views/pages/SearchPage.vue')
    },
    {
        path: '/result',
        name: 'result-page',
        component: () => import('@/views/pages/ResultPage.vue')
    },
    {
        path: '/login',
        name: 'auth-login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
            layout: 'full'
        }
    },
    {
        path: '/analytic',
        name: 'analytic',
        component: () => import('@/views/pages/Analytic.vue'),
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/pages/SettingPage.vue'),
        children: [
            {
                path: 'pinned-query/:pinnedQueryId/:pinnedQueryLabel',
                name: 'pinnedQueryDetail',
                props: true,
                component: () => import('@/components/settings/PinnedQuestionDraggable.vue')
            }
        ]
    },
]

const createRouter = () => new VueRouter({
    mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    base: process.env.BASE_URL,
    routes: constantRoutes
})

const router = createRouter()

router.beforeEach((to, _, next) => {
    if (!canNavigate(to)) {
        const isLoggedIn = isUserLoggedIn()
        //   Redirect to login if not logged in
        if (!isLoggedIn) return next({ name: 'auth-login' })
    }

    return next()
})

export default router