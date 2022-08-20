import Vue from 'vue'
import Vuex from 'vuex'
import * as KEYS from "@/store/storeKeys";
import Storage from "vue-ls";
import * as tools from '@/util/tools'

Vue.use(Storage);
Vue.use(Vuex)

let STATE;

function storeInitFunc() {
    let stored = true;
    setInterval(() => {
        if (!stored && STATE) {
            console.log("save store:", STATE)
            Vue.ls.set(KEYS.STORAGE, STATE, 1000 * 60 * 60 * 24 * 30)
            STATE = null
            stored = true
        } else {
            stored = false
        }
    }, 1000)
    return Vue.ls.get(KEYS.STORAGE, {});
}

function commitStorage(state) {
    STATE = state;
}

export default new Vuex.Store({
    state: storeInitFunc(),
    getters: {
        [KEYS.INITED]: state => {
            let orDefault = tools.getOrDefault(state, KEYS.HISTORY_SERVER, []);
            return orDefault.length > 0 && orDefault[0][KEYS.SERVER_URL];
        },
        [KEYS.SECRET]: state => {
            let orDefault = tools.getOrDefault(state, KEYS.HISTORY_SERVER, []);
            return orDefault.length > 0 ? tools.getOrDefault(orDefault[0], KEYS.SECRET, "") : "";
        },
        [KEYS.SERVER_URL]: state => {
            let orDefault = tools.getOrDefault(state, KEYS.HISTORY_SERVER, []);
            return orDefault.length > 0 ? tools.getOrDefault(orDefault[0], KEYS.SERVER_URL, "") : "";
        },
        [KEYS.HISTORY_SERVER]: state => tools.getOrDefault(state, KEYS.HISTORY_SERVER, []),
        [KEYS.CONFIG_QUERY]: state => tools.getOrDefault(state, KEYS.CONFIG_QUERY, {}),
        [KEYS.ENABLE_API_BATTERY_QUERY]: state => tools.getOrDefault(state, KEYS.ENABLE_API_BATTERY_QUERY, false),
    },
    mutations: {
        [KEYS.STORAGE](state, o) {
            commitStorage(state)
        },
        [KEYS.HISTORY_SERVER](state, data) {
            let key = KEYS.HISTORY_SERVER;
            let val = tools.getOrDefault(state, key, []);
            let newVar = tools.unique([data, ...val], o => o[KEYS.SERVER_URL]);
            Vue.set(state, key, newVar)
            commitStorage(state)
        },
        [KEYS.DEL_SERVER](state, data) {
            let val = tools.getOrDefault(state, KEYS.HISTORY_SERVER, []);
            let newVal = val.filter(it => !data || data !== it[KEYS.SERVER_URL]);
            Vue.set(state, KEYS.HISTORY_SERVER, newVal);
            commitStorage(state)
        },
        [KEYS.CONFIG_QUERY](state, data) {
            Vue.set(state, KEYS.CONFIG_QUERY, data);
            commitStorage(state)
        },
    },
    actions: {
        [KEYS.STORAGE]({dispatch, commit}, secret) {
            commit(KEYS.STORAGE, secret);
        },
        [KEYS.HISTORY_SERVER]({dispatch, commit}, data) {
            commit(KEYS.HISTORY_SERVER, data)
        },
        [KEYS.CONFIG_QUERY]({dispatch, commit}, data) {
            commit(KEYS.CONFIG_QUERY, data);
        },
        [KEYS.DEL_SERVER]({dispatch, commit}, data) {
            commit(KEYS.DEL_SERVER, data);
        }
    }
})
