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
      .then(() => {
        router.push('/game?name=' + game.name)
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  },

  getGames: async function (filter) {
    let games
    await Axios.get('/v1/games?' + filter)
      .then((response) => {
        games = response.data.games
      })
      .catch((error) => {
        if (error.response.status === 404) {
          if (filter) {
            alert('No games match the criteria')
          } // else nothing, no games is a valid response unless there is a filter
        } else {
          alert(error.response.data.message)
        }
      })
    return games
  },

  getGameById: async function (id) {
    let game
    await Axios.get('/v1/games/' + id)
      .then((response) => {
        game = response.data
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    return game
  },

  getGameByName: async function (name) {
    let game
    await Axios.get('/v1/games?name=' + name)
      .then((response) => {
        game = response.data.games[0] // name is unique, so there should only be one
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    return game
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
    let review
    await Axios.get('/v1/reviews/' + id)
      .then((response) => {
        review = response.data
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    return review
  },

  // HATEOAS

  getByHateoas: async function (url) {
    let returnData
    await Axios.get(url)
      .then((response) => {
        returnData = response.data
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    return returnData
  },

  putByHateoas: async function (url, inputData) {
    let returnData
    await Axios.put(url, inputData)
      .then((response) => {
        returnData = response.status
      }
      )
      .catch((error) => {
        alert(error.response.data.message)
      })
    return returnData
  }
}
