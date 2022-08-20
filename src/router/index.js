import Vue from 'vue'
import VueRouter from 'vue-router'
import * as tools from "@/util/tools";
import store from "@/store";
import {
    ENABLE_API_BATTERY_QUERY,
    ENABLE_API_CALL_QUERY,
    ENABLE_API_CLONE,
    ENABLE_API_CONTACT_QUERY,
    ENABLE_API_SMS_QUERY,
    ENABLE_API_SMS_SEND,
    INITED
} from "@/store/storeKeys";

// import IndexPage from "@/views/IndexPage.vue"
// import BatteryQuery from "@/components/BatteryQuery.vue"
// import QueryConfig from "@/components/QueryConfig.vue"
// import QuerySmsNew from "@/components/QuerySms.vue"
// import QueryCall from "@/components/QueryCall.vue"
// import QueryContact from "@/components/QueryContact.vue"
// import SendSms from "@/components/SendSms.vue"

Vue.use(VueRouter)


Vue.directive('auth', {
    inserted: function (el, binding) {
        console.log(binding)
        console.log(el)
        let auth = binding.value.auth();
        if (!auth) {
            el.setAttribute("disabled", "disabled")
            setTimeout(() => el.setAttribute("disabled", "disabled"), 500)
        }
    }
});


export const INDEX_PATH = "/index"

let router = new VueRouter({
    // mode: 'history',
    mode: "hash",
    base: process.env.BASE_URL, routes: [{
        path: INDEX_PATH, alias: ["/"], name: 'index', meta: {
            hide: true, title: '主页'
        }, // 懒加载模式
        component: () => import('@/components/LoginPage.vue')
        // component:IndexPage
    }, {
        path: '/batteryQuery', name: 'batteryQuery', meta: {
            title: '查电量', auth: ENABLE_API_BATTERY_QUERY
        }, // 懒加载模式
        component: () => import('@/components/BatteryQuery.vue')
    }, {
        path: '/querySms', name: 'querySms', meta: {
            title: '查短信', auth: ENABLE_API_SMS_QUERY
        }, // 懒加载模式
        component: () => import('@/components/QuerySms.vue')
        // component:QuerySmsNew
    }, {
        path: '/queryCall', name: 'queryCall', meta: {
            title: '查通话', auth: ENABLE_API_CALL_QUERY
        }, // 懒加载模式
        component: () => import('@/components/QueryCall.vue')
        // component: QueryCall
    }, {
        path: '/queryContact', name: 'queryContact', meta: {
            title: '查联系人', auth: ENABLE_API_CONTACT_QUERY
        }, // 懒加载模式
        component: () => import('@/components/QueryContact.vue')
        // component: QueryContact
    }, {
        path: '/sendSms', name: 'sendSms', meta: {
            title: '发短信', icon: require("@/assets/sms.png"), auth: ENABLE_API_SMS_SEND
        }, // 懒加载模式
        component: () => import('@/components/SendSms.vue')
        // component:SendSms
    }, {
        path: '/pull', name: 'pull', meta: {
            title: '克隆', auth: ENABLE_API_CLONE
        }, // 懒加载模式
        component: () => import('@/components/QueryConfig.vue')
        // component: QueryConfig
    }, {
        path: '/404', component: () => import('@/views/404'), meta: {
            hide: true
        }
    }, {
        path: '*', redirect: '/404', hidden: true, meta: {
            hide: true
        }
    }]
});

// 挂载路由导航守卫
// to 将要访问的路径
// from 代表从哪个路径跳转而来
// next 是个函数，表示放行 next() 放行  next('/login') 强制跳转
router.beforeEach((to, from, next) => {
    //beforeEach是router的钩子函数，在进入路由前执行
    if (to.meta.title) {//判断是否有标题
        document.title = to.meta.title
    }
    if (to.meta.icon) {
        tools.setIcon(to.meta.icon)
    }
    console.log(to)
    if (to.path === INDEX_PATH || store.getters[INITED]) {
        next()  //执行进入路由，如果不写就不会进入目标页
    } else {
        next(INDEX_PATH)
    }
})

export default router
