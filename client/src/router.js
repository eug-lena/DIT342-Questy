import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import AllGames from './views/AllGames.vue'
import User from './views/User.vue'
import AddGame from './views/AddGame.vue'
import CommentBox from './components/CommentBox.vue'

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
      path: '/all-games',
      name: 'all-games',
      component: AllGames
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/add-game',
      name: 'add-game',
      component: AddGame
    },
    {
      path: '/commentBox',
      name: 'commentBox',
      component: CommentBox
    }
  ]
})
