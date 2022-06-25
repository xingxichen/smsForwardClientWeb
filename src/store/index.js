import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        secret: '',
        serverUrl: '',
    },
    getters: {
        secret: state => state.secret,
        serverUrl: state => state.serverUrl,
    },
    mutations: {
        setSecret(state, secret) {
            state.secret = secret;
        },
        setServerUrl(state, serverUrl) {
            state.serverUrl = serverUrl;
        }
    },
    actions: {
        setSecret({commit}, secret) {
            commit('setSecret', secret);
        },
        setServerUrl({commit}, serverUrl) {
            commit('setServerUrl', serverUrl);
        }
    },
    modules: {
        config: {
            namespaced: true,
            state: {
                secret: '',
                serverUrl: ''
            }
        }
    }
})
