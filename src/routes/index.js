import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import GeneralLayout from '../layouts/GeneralLayout'
import LoginLayout from '../layouts/LoginLayout'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Calendar from '../components/Calendar'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            name: 'login',
            component: Login,
            meta: { layout: LoginLayout }
        },
        {
            path: '/',
            name: 'login',
            component: Login,
            meta: { layout: LoginLayout }
        },
        {
            path: '/sign-up',
            name: 'signUp',
            component: SignUp,
            meta: { layout: LoginLayout }
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: Calendar,
            meta: { layout: GeneralLayout, requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(requiresAuth && !currentUser){
        next('login')
    }else if(!requiresAuth && currentUser){
        next('calendar');
    }else{
        next()
    }    
})

export default router