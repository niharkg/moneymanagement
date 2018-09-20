import transactionApi from '../../api/transaction-api.js'
import * as types from '../mutation-types.js'

const state = {
  transaction: {}
}

const getters = {
  me_wallet: state => state.wallet,
  balances: state => {
    if (state.wallet) return state.wallet.balances
    return null
  },
  transactions: state => {
    if (state.wallet) return state.transactions
    return null
  }
}

const actions = {
  listTransactions({ commit }) {
    return transactionApi.getWallet()
      .then((response) => {
        commit(types.LIST_TRANSACTIONS, response)
        return Promise.resolve(response)
      })
      .catch((error) => Promise.reject(error))
  },
}

const mutations = {
  [types.LIST_TRANSACTIONS](state, response) {
    state.wallet = response
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
