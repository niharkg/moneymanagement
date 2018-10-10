import axios from 'axios'

import { API_ROOT } from '../config.js'

const apiCall = (method, url, form_data, params) => {
  return axios({
    method: method,
    url: url,
    data: form_data,
    params: params,
    baseURL: API_ROOT + '/transactions/',
    withCredentials: true,
  })
    .then(response => Promise.resolve(response.data))
    .catch((error) => {
      // Error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.headers)
        console.log(error.response.data)
        console.log(error.response.status)
        return Promise.reject(error.response)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
        return Promise.reject(error.request)
      }
    })
}

export default {
  // Get all of a user's transactions
  //  TODO: change user_id to active user when supported
  getRecentTransactions() {
    return apiCall('get', 'get/137985/amount/10/')
  },
  getCurrentMonthCategorySpending(month, year) {
    return apiCall('get', 'get/categories/137985/'+ month + '/' + year + '/')
  },
}
