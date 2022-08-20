import axios from "axios"
import Vue from "vue";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

//这个是设置请求拦截器的api，传入两个回调，第一个成功回调，第二个失败回调。
export const LOADING_MSG_KEY = 'LOADING_MSG_KEY'
axios.interceptors.request.use(function (config) {
    // console.log("请求拦截器1调用成功");
    Vue.prototype.$message.loading({content: '加载中...', key: LOADING_MSG_KEY, duration: 0,});
    return config;
}, function (error) {
    Vue.prototype.$message.error({content: '请求异常:' + error.message, key: LOADING_MSG_KEY, duration: 2,});
    // console.log("请求拦截器1调用失败");
    return Promise.reject(error)
})

//这个是设置响应拦截器的api，第一个成功回调，第二个失败回调
axios.interceptors.response.use(function (response) {
    // console.log("响应拦截器1调用成功");
    if (response.data.code === 200) {
        Vue.prototype.$message.success({content: response.data.msg, key: LOADING_MSG_KEY, duration: 2,});
        return response;
    } else {
        Vue.prototype.$message.error({
            content: '响应异常:code:' + response.data.code + response.data.msg,
            key: LOADING_MSG_KEY,
            duration: 2
        });
        return Promise.reject(response);
    }
}, function (error) {
    // console.log("响应拦截器1调用失败");
    Vue.prototype.$message.error({content: '响应异常:' + error.message, key: LOADING_MSG_KEY, duration: 2});
    return Promise.reject(error);
})

export default axios
