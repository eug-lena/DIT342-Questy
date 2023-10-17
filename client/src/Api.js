'use strict'

import axios from 'axios'
import router from './router'
import { useUserStore } from './store/UserStore'

const Axios = axios.create(
  {
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api',
    withCredentials: true
  }
)

function updateStore(responseData) {
  const store = useUserStore()
  store.setAuthenticated(true)
  store.setUsername(responseData.username)
  store.setUserID(responseData._id)
}

function resetStore() {
  const store = useUserStore()
  store.setAuthenticated(false)
  store.setUsername('')
  store.setUserID('')
}

export const Api = {

  Axios,

  /*

  Below are the functions that are used to communicate with the API.

  The functions are structured in the following way:
  - The function name describes what the function does.
  - The function takes in the required input data. I.e id, name, url, etc.
  - The function returns the response status and data or message from the API

  */

  // USER  & AUTHENTICATION

  isAuthenticated: async function () {
    await Axios.get('/v1/authenticate/isAuthenticated')
      .then((response) => {
        if (response.data.authenticated === true) {
          updateStore(response.data)
        } else {
          resetStore()
        }
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  Logout: function () {
    Axios.post('/v1/authenticate/logout?_method=DELETE') // Method override
      .then((response) => {
        resetStore()
        alert(response.data.message)
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  Login: async function (user) {
    await Axios.post('/v1/authenticate/login', user)
      .then((response) => {
        updateStore(response.data)
        router.push('/')
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  RegisterAndLogin: async function (user) {
    const returnData = {}
    await Axios.post('/v1/users', user)
      .then((response) => {
        updateStore(response.data)
        returnData.status = response.status
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getUsers: async function (filter) {
    const returnData = {}
    if (filter === undefined || filter === null) {
      filter = ''
    }
    await Axios.get('/v1/users?' + filter)
      .then((response) => {
        returnData.status = response.status
        returnData.users = response.data.users
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getUserById: async function (id) {
    const returnData = {}
    await Axios.get('/v1/users/' + id)
      .then((response) => {
        returnData.status = response.status
        returnData.user = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getUserByUsername: async function (username) {
    const returnData = {}
    await Axios.get('/v1/users?username=' + username)
      .then((response) => {
        returnData.status = response.status
        returnData.user = response.data.users[0]
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getUserFollowingReviews: async function (id) {
    const returnData = {}
    await Axios.get('/v1/users/' + id + '/followingReviews')
      .then((response) => {
        returnData.status = response.status
        returnData.reviews = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getUserRecentActivity: async function (id) {
    const returnData = {}
    await Axios.get('/v1/users/' + id + '/recentActivity')
      .then((response) => {
        returnData.status = response.status
        returnData.data = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  // GAME

  postGame: async function (game) {
    const returnData = {}
    await Axios.post('/v1/games', game)
      .then((response) => {
        returnData.status = response.status
        returnData.game = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getGames: async function (filter) {
    const returnData = {}
    if (filter === undefined || filter === null) {
      filter = ''
    }
    await Axios.get('/v1/games?' + filter)
      .then((response) => {
        returnData.status = response.status
        returnData.games = response.data.games
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getGameById: async function (id) {
    const returnData = {}
    await Axios.get('/v1/games/' + id)
      .then((response) => {
        returnData.status = response.status
        returnData.game = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getGameByName: async function (name) {
    const returnData = {}
    await Axios.get('/v1/games?name=' + name)
      .then((response) => {
        returnData.status = response.status
        returnData.game = response.data.games[0] // name is unique, so there should only be one
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  // REVIEW

  postReview: async function (review) {
    const returnData = {}
    await Axios.post('/v1/reviews', review)
      .then((response) => {
        returnData.status = response.status
        returnData.review = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  async getReviews(filter) {
    const returnData = {}
    if (filter === undefined || filter === null) {
      filter = ''
    }
    await Axios.get('/v1/reviews?' + filter)
      .then((response) => {
        returnData.status = response.status
        returnData.reviews = response.data.reviews
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getReviewById: async function (id) {
    const returnData = {}
    await Axios.get('/v1/reviews/' + id)
      .then((response) => {
        returnData.status = response.status
        returnData.review = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  // HATEOAS

  postByHateoas: async function (url, inputData) {
    const returnData = {}
    await Axios.post(url, inputData)
      .then((response) => {
        returnData.status = response.status
        returnData.data = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  getByHateoas: async function (url) {
    const returnData = {}
    await Axios.get(url)
      .then((response) => {
        returnData.status = response.status
        returnData.data = response.data
      })
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  putByHateoas: async function (url, inputData) {
    const returnData = {}
    await Axios.put(url, inputData)
      .then((response) => {
        returnData.status = response.status
        returnData.data = response.data
      }
      )
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  patchByHateoas: async function (url, inputData) {
    const returnData = {}
    await Axios.patch(url, inputData)
      .then((response) => {
        returnData.status = response.status
        returnData.data = response.data
      }
      )
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  },

  deleteByHateoas: async function (url) {
    const returnData = {}
    await Axios.delete(url)
      .then((response) => {
        returnData.status = response.status
      }
      )
      .catch((error) => {
        returnData.status = error.response.status
        returnData.message = error.response.data.message
      })
    return returnData
  }
}
