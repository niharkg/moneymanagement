import Router from 'vue-router'
import store from '../store/index.js'

// Views
import UserLoginView from '../views/main_pages/user_auth/UserLogin.vue'
import UserSignUpView from '../views/main_pages/user_auth/UserSignUp.vue'
import UserForgetPasswordView from '../views/main_pages/user_auth/ForgetPassword.vue'

import DashboardView from '../views/main_pages/dashboard/Dashboard.vue'
import SettingsView from '../views/main_pages/settings/Settings.vue'
import TransactionsView from '../views/main_pages/transactions/Transactions.vue'
import PredictionsView from '../views/main_pages/predictions/Predictions.vue'


// Error Pages
import NotFoundView from '../views/error_pages/404.vue'

// Permissions
const isNotAuthenticated = (to, from, next) => {
  // If already login
  if (store.getters.is_login) {
    return next({ name: 'dashboard' })
  }
  // Else Refresh token
  store.dispatch('refresh')
    .then(() => {
      // If then logged in
      return next({ name: 'dashboard' })
    })
    // After refresh, if still logged out, go to login page
    .catch(() => next())
}

const isAuthenticated = (to, from, next) => {
  // If already login
  if (store.getters.is_login) return next()

  // Else Refresh token
  store.dispatch('refresh')
    .then(() => next())
    // After refresh, if still logged out, go to login page
    .catch(() => next({ name: 'user_login' }))
}

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    component: UserLoginView,
    name: 'user_login',
    beforeEnter: isNotAuthenticated,
  }, {
    path: '/signup',
    component: UserSignUpView,
    name: 'user_signup',
    beforeEnter: isNotAuthenticated,
  }, {
    path: '/forget_password',
    component: UserForgetPasswordView,
    name: 'user_forget_password',
    beforeEnter: isNotAuthenticated,
  }, {
    path: '/',
    component: DashboardView,
    name: 'dashboard',
    beforeEnter: isAuthenticated,
  }, {
    path: '/transactions',
    component: TransactionsView,
    name: 'transactions',
    beforeEnter: isAuthenticated,
  }, {
    path: '/predictions',
    component: PredictionsView,
    name: 'predictions',
    beforeEnter: isAuthenticated,
  },{
    path: '/settings',
    component: SettingsView,
    name: 'settings',
    beforeEnter: isAuthenticated,
  }, {
    // not found handler
    path: '/404',
    component: NotFoundView,
    name: '404',
  }, {
    path: '*',
    redirect: { name: '404' },
  }],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
  },
})
