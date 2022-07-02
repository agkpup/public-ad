import Vue from 'vue'
import Vuex from 'vuex'
import authUser from './authUser'
import notification from './notification'
import cities from './city.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cities:cities,
    authUser:authUser,
    notification:notification
  }
})
