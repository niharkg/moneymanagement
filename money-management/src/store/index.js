import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import transaction from './modules/transaction'

Vue.use(Vuex)

const store = new Vuex.Store({
  // plugins: [PersistedState()],
  modules: {
    user,
    transaction,
  },
})
export default store
