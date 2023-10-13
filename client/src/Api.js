'use strict'

import axios from 'axios'
import router from './router'
import { useUserStore } from './store/UserStore'

export const Api = axios.create(
  {
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api',
    withCredentials: true
  }
)

const Axios = axios.create(
  {
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api',
    withCredentials: true
  }
)

function updateStore(response) {
  const store = useUserStore()
  store.setAuthenticated(true)
  store.setUsername(response.data.username)
  store.setUserID(response.data._id)
}

function resetStore() {
  const store = useUserStore()
  store.setAuthenticated(false)
  store.setUsername('')
  store.setUserID('')
}

export const api = {

  Axios,

  // USER AUTHENTICATION

  isAuthenticated: function () {
    Axios.get('/v1/authenticate/isAuthenticated')
      .then((response) => {
        if (response.data.authenticated === true) {
          updateStore(response)
        } else {
          resetStore()
        }
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  Logout: function () {
    Axios.delete('/v1/authenticate/logout')
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
        updateStore(response)
        router.push('/')
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  RegisterAndLogin: function (user) {
    Axios.post('/v1/authenticate/register', user)
      .then((response) => {
        updateStore(response)
        router.push('/')
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  // GAME

  postGame: function (game) {
    Axios.post('/v1/games', game)
      .then((response) => {
        router.push('/game?name=' + this.game.name)
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  getGames: async function (filter) {
    let returnData
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

  postReview: function (review) {
    Axios.post('/v1/reviews', review)
      .then((response) => {
        router.push('/review?id=' + response.data._id)
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
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
