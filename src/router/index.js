import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history', base: process.env.BASE_URL, routes: [{
        path: '/', name: 'home', meta: {
            title: '主页'
        }, // 懒加载模式
        component: () => import( '@/components/index.vue')
    }, {
        path: '/pull', name: 'pull', meta: {
            title: '拉取配置'
        }, // 懒加载模式
        component: () => import( '@/components/Pull.vue')
    }, {
        path: '/sendSms', name: 'sendSms', meta: {
            title: '发送短信'
        }, // 懒加载模式
        component: () => import( '@/components/SendSms.vue')
    }, {
        path: '/querySms', name: 'querySms', meta: {
            title: '查短信'
        }, // 懒加载模式
        component: () => import( '@/components/QuerySms.vue')
    }, {
        path: '/queryCall', name: 'queryCall', meta: {
            title: '查通话'
        }, // 懒加载模式
        component: () => import( '@/components/QueryCall.vue')
    }, {
        path: '/queryContact', name: 'queryContact', meta: {
            title: '查联系人'
        }, // 懒加载模式
        component: () => import( '@/components/QueryContact.vue')
    }/*,  {
        path: '/about',
        name: 'about',
        component: () => import( '../views/AboutView.vue')
    }, {
        path: '/crud',
        name: 'crud',
        component: () => import('../components/crud/Crud.vue')
    }*/]
})
