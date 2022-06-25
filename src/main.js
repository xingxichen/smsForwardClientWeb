import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Axios from "axios"

Vue.config.productionTip = false

// 将axios挂载到原型上

Axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Vue.prototype.$axios = Axios;

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

Vue.use(Antd);
console.log(router.getRoutes())
new Vue({
    router, store, render: h => h(App)
}).$mount('#app')
