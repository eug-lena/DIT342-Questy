'use strict'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      authenticated: '',
      username: '',
      userID: '',
      admin: ''
    }
  },
  getters: {
    isAuthenticated: (state) => state.authenticated,
    getUsername: (state) => state.username,
    getUserID: (state) => state.userID,
    isAdmin: (state) => state.admin
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
    },
    setAdmin(isAdmin) {
      this.admin = isAdmin
    }
  }
}
)
