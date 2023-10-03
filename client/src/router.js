import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Games from './views/Games.vue'
import User from './views/User.vue'
import AddGame from './views/AddGame.vue'
import CommentBox from './views/CommentBox.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/games',
      name: 'games',
      component: Games
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/addgame',
      name: 'addgame',
      component: AddGame
    },
    {
      path: '/commentBox',
      name: 'commentBox',
      component: CommentBox
    }
  ]
})
