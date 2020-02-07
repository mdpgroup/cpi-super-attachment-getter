import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/index'
import Login from '@/components/Login'
import HomePage from '@/components/HomePage'
Vue.use(Router)

export default new Router({
    routes: [
      {
        path: '/',
        name: 'index',
        component: HelloWorld,
        children:
        [
            {
                path: '/Login',
                component: Login
            },
            {
                path:'/HomePage',
                component: HomePage
            }
        ]
        
    }
]
})