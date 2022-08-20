import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import axios from "@/api/http"
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import bootstrap from '@/util/bootstrap'

Vue.config.productionTip = false

// 将axios挂载到原型上
Vue.prototype.$axios = axios;


Vue.use(Antd);


// Vue.directive('title', {
//     inserted: function (el, binding) {
//         console.log(binding)
//         document.title = binding.value.title
//         document.f
//     }
// });
//用法 v-title="$router.currentRoute.meta"

// Vue.prototype.$message.config({
//     top: `10%`,
// duration: 3,
// maxCount: 2,
// });


var vue = new Vue({
    router,
    store,
    created: bootstrap,
    render: h => h(App)
})
vue.$mount('#app');
