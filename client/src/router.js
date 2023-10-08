import Vue from 'vue'
import Router from 'vue-router'

// Default
import Home from './views/Home.vue'

// User
import User from './views/User.vue'
import Login from './views/Login.vue'

// Game
import Game from './views/Game.vue'
import AllGames from './views/AllGames.vue'
import AddGame from './views/AddGame.vue'
import EditGame from './views/EditGame.vue'

// Review
import Review from './views/Review.vue'
import AddReview from './views/AddReview.vue'

// Comment

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
      path: '/review',
      name: 'review',
      component: Review
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/edit-game',
      name: 'edit-game',
      component: EditGame
    },
    {
      path: '/add-review',
      name: 'add-review',
      component: AddReview
    }
  ]
})
