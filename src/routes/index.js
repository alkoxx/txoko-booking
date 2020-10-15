import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Calendar from '../components/Calendar'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: Calendar
        }
    ]
})

export default router