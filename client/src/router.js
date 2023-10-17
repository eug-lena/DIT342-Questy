import Vue from 'vue'
import Router from 'vue-router'
import { Api } from '@/Api'

// Default
import Home from './views/Home.vue'
import NotFound from './views/404.vue'

// User
import User from './views/user/User.vue'
import Login from './views/user/Login.vue'

// Game
import Game from './views/game/Game.vue'
import AllGames from './views/game/AllGames.vue'
import AddGame from './views/game/AddGame.vue'
import EditGame from './views/game/EditGame.vue'

// Review
import Review from './views/review/Review.vue'
import AddReview from './views/review/AddReview.vue'
import EditReview from './views/review/EditReview.vue'

// Comment

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '/edit-review',
      name: 'edit-review',
      component: EditReview
    },
    {
      path: '/404',
      component: NotFound,
      name: 'not-found'
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  await Api.isAuthenticated()
  next()
})

export default router
