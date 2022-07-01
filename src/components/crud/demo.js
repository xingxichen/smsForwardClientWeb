/** 登录模块接口列表 */
import axios from '@/components/crud/http'
import qs from 'qs'
import SmsForwardUtil from "@/util/tools";

const demo = {
    getCrudData(params) {
        return axios.post(SmsForwardUtil.serverUrl() + '/web/funComCat/searchData', qs.stringify(params))
    }, addCrudData(params) {
        return axios.post(SmsForwardUtil.serverUrl() + '/web/funComCat/saveData', qs.stringify(params))
    }, editCrudData(params) {
        return axios.post(SmsForwardUtil.serverUrl() + '/web/funComCat/updateData', qs.stringify(params))
    }, delCrudData(params) {
        return axios.post(SmsForwardUtil.serverUrl() + '/web/funComCat/deleteDatas', qs.stringify(params))
    }
}

export default demo
