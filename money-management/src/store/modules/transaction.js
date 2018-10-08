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
  // Get all of  a user's transactions
  getRecentTransactions({ commit }) {
    return transactionApi.getRecentTransactions()
    .then((response) => {
      return (response)
    })
    .catch((error) => Promise.reject(error))
  }, 
  // Get all of  a user's transactions
  getCurrentMonthCategorySpendings({ commit },params) {
    return transactionApi.getCurrentMonthCategorySpending(params.month, params.year)
    .then((response) => {
      return (response)
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
