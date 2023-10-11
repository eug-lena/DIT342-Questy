'use strict'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      authenticated: '',
      username: '',
      userID: ''
    }
  },
  getters: {
    isAuthenticated: (state) => state.authenticated,
    getUsername: (state) => state.username,
    getUserID: (state) => state.userID
  },
  actions: {
    setAuthenticated(authenticated) {
      this.authenticated = authenticated
    },
    setUsername(username) {
      this.username = username
    },
    setUserID(userID) {
      this.userID = userID
    }
  }
}
)
