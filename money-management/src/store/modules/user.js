import userApi from '../../api/user-api'
import * as types from '../mutation-types'
import router from '../../router/index'

// initial state
const state = {
  // me
  me: {},
  // other
  is_login: false,
  logs: [],
}

// getters
const getters = {
  is_login: state => state.is_login,
  verification_level: state => state.me.verification_level,
  me: state => {
    if (state.is_login && state.me) return state.me
    return {}
  },
  me_phone: state => {
    if (state.is_login && state.me) return state.me.user.phone_country_code + state.me.user.phone
    return {}
  },
  me_name: state => {
    if (state.is_login) return state.me.first_name + ' ' + state.me.last_name
    return ''
  },
  logs: state => state.logs,

}

// actions
const actions = {
  // Auth
  signup({ commit, dispatch }, form_data) {
    return userApi.signup(form_data)
      .then((response) => {
        commit(types.REGISTER_SUCCESS, response)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  login({ commit, dispatch }, form_data) {
    return userApi.login(form_data)
      .then((response) => {
        commit(types.LOGIN_SUCCESS, response)
        return Promise.resolve(response)
      })
      .catch(error => {
        commit(types.LOGIN_FAILED)
        return Promise.reject(error)
      })
  },
  logout({ commit }) {
    return userApi.logout()
      .then(() => commit(types.LOGOUT))
  },
  refresh({ commit }) {
    return userApi.refresh()
      .then(response => {
        commit(types.REFRESH_SUCCESS, response)
        return Promise.resolve()
      })
      .catch(error => {
        commit(types.REFRESH_FAILED)
        return Promise.reject(error)
      })
  },
  forgotPasswordSendCode({ commit }, params) {
    return userApi.forgotPasswordSendCode(params)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  forgotPasswordVerifyCode({ commit }, form_data) {
    return userApi.forgotPasswordVerifyCode(form_data)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  forgotPasswordUpdate({ commit }, form_data) {
    return userApi.forgotPasswordUpdate(form_data)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },

  // Change Password
  changePassword({ commit }, form_data) {
    return userApi.changePassword(form_data)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },

  // Load Data
  getMe({ commit }) {
    return userApi.getMe()
      .then((response) => {
        commit(types.LOAD_ME, response)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  updateMe({ commit }, form_data) {
    return userApi.updateMe(form_data)
      .then(() => {
        commit(types.UPDATE_ME)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
}

// mutations
const mutations = {
  // auth
  [types.LOGIN_SUCCESS](state, response) {
    // If response has data field as 'success', then login directly
    if (response.data === 'success') {
      state.is_login = true
      state.me = response
      router.push({ name: 'dashboard' })
    }
  },

  [types.LOGIN_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  [types.LOGOUT](state) {
    state.is_login = false
    state.me = {}
    router.push({ name: 'user_login' })
  },
  [types.REFRESH_SUCCESS](state, response) {
    state.is_login = true
    state.me = response
  },
  [types.REFRESH_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  [types.REGISTER_SUCCESS](state, response) {
    state.is_login = true
    state.me = response
    router.push({ name: 'dashboard' })
  },
  [types.REGISTER_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  // load data
  [types.LOAD_ME](state, response) {
    state.me = response
  },
  [types.UPDATE_ME]() {
  },
  [types.LOAD_LOG](state, response) {
    state.logs = response
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
