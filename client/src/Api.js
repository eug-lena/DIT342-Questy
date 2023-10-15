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

  isAuthenticated: function () {
    Axios.get('/v1/authenticate/isAuthenticated')
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

  Login: function (user) {
    Axios.post('/v1/authenticate/login', user)
      .then((response) => {
        updateStore(response.data)
        router.push('/')
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  RegisterAndLogin: async function (user) {
    let returnData
    await Axios.post('/v1/users', user)
      .then((response) => {
        updateStore(response.data)
        const status = response.status
        returnData = { status }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
        alert(error.response.data.message)
      })
    return returnData
  },

  getUsers: async function (filter) {
    let returnData
    if (filter === undefined || filter === null) {
      filter = ''
    }
    await Axios.get('/v1/users?' + filter)
      .then((response) => {
        const status = response.status
        const users = response.data.users
        returnData = { status, users }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message, users: null }
      })
    return returnData
  },

  getUserById: async function (id) {
    let returnData
    await Axios.get('/v1/users/' + id)
      .then((response) => {
        const status = response.status
        const user = response.data
        returnData = { status, user }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message, user: null }
      })
    return returnData
  },

  getUserByUsername: async function (username) {
    let returnData
    await Axios.get('/v1/users?username=' + username)
      .then((response) => {
        const status = response.status
        const user = response.data.users[0]
        returnData = { status, user }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message, user: null }
      })
    return returnData
  },

  // GAME

  postGame: async function (game) {
    let returnData
    await Axios.post('/v1/games', game)
      .then((response) => {
        const status = response.status
        const game = response.data
        returnData = { status, game }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  getGames: async function (filter) {
    let returnData
    if (filter === undefined || filter === null) {
      filter = ''
    }
    await Axios.get('/v1/games?' + filter)
      .then((response) => {
        const status = response.status
        const games = response.data.games
        returnData = { status, games }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  getGameById: async function (id) {
    let returnData
    await Axios.get('/v1/games/' + id)
      .then((response) => {
        const status = response.status
        const game = response.data
        returnData = { status, game }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  getGameByName: async function (name) {
    let returnData
    await Axios.get('/v1/games?name=' + name)
      .then((response) => {
        const status = response.status
        const game = response.data.games[0] // name is unique, so there should only be one
        returnData = { status, game }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  // REVIEW

  postReview: async function (review) {
    let returnData
    await Axios.post('/v1/reviews', review)
      .then((response) => {
        const status = response.status
        const review = response.data
        returnData = { status, review }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  getReviewById: async function (id) {
    let returnData
    await Axios.get('/v1/reviews/' + id)
      .then((response) => {
        const status = response.status
        const review = response.data
        returnData = { status, review }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  // HATEOAS

  postByHateoas: async function (url, inputData) {
    let returnData
    await Axios.post(url, inputData)
      .then((response) => {
        const status = response.status
        const data = response.data
        returnData = { status, data }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  getByHateoas: async function (url) {
    let returnData
    await Axios.get(url)
      .then((response) => {
        const status = response.status
        const data = response.data
        returnData = { status, data }
      })
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  putByHateoas: async function (url, inputData) {
    let returnData
    await Axios.put(url, inputData)
      .then((response) => {
        const status = response.status
        returnData = { status }
      }
      )
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  },

  deleteByHateoas: async function (url) {
    let returnData
    await Axios.delete(url)
      .then((response) => {
        const status = response.status
        returnData = { status }
      }
      )
      .catch((error) => {
        const status = error.response.status
        const message = error.response.data.message
        returnData = { status, message }
      })
    return returnData
  }
}
