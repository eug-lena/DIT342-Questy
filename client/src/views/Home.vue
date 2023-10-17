<template>
  <div>
    <div class="background m-0" />
    <h1 class="m-3" align="center">Welcome to Questy!</h1>
    <div>
      <h3 class="m-3">Check out these games that just got released!</h3>
      <b-list-group id="list-group" horizontal>
        <game-item
          v-for="game in this.newlyReleasedGames"
          :key="game._id"
          :game="game"
        ></game-item>
      </b-list-group>
    </div>
    <div>
      <h3 class="m-3">Check out these newly added games!</h3>
      <b-list-group id="list-group" horizontal>
        <game-item
          v-for="game in this.newestGames"
          :key="game._id"
          :game="game"
        ></game-item>
      </b-list-group>
    </div>
    <div>
      <h3>Check out these recent reviews from people you follow</h3>
      <b-list-group id="list-group" horizontal>
        <review-item
          v-for="review in this.followingReviews"
          :key="review._id"
          :review="review"
        ></review-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'pinia'
import { Api } from '@/Api'
import GameItem from '@/components/SmallGameBox.vue'
import ReviewItem from '@/components/ReviewBox.vue'
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'home',
  components: {
    'game-item': GameItem,
    'review-item': ReviewItem
  },
  data() {
    return {
      store: useUserStore(),
      imgUrl: '',
      perPage: 9,
      currentPage: 1,
      followingReviews: [],
      newlyReleasedGames: [],
      newestGames: [],
      filter: {
        name: '',
        tag: ''
      },
      loading: true
    }
  },
  mounted() {
    this.getGamesByReleaseDate()
    this.getGamesByPostedDate()
    this.getReviewsFromFollowers()
  },
  methods: {
    async getReviewsFromFollowers() {
      const response = await Api.getUserFollowingReviews(this.store.getUserID)
      if (response.status === 200) {
        this.followingReviews = response.reviews
      } else if (response.status !== 404) {
        alert(response.message)
      }
      this.loading = false
    },
    async getGamesByReleaseDate() {
      const response = await Api.getGames('sort=-releaseDate&limit=6')
      if (response.status === 200) {
        this.newlyReleasedGames = response.games
      } else if (response.status !== 404) {
        alert(response.message)
      }
      this.loading = false
    },
    async getGamesByPostedDate() {
      const response = await Api.getGames('sort=-_id&limit=6')
      if (response.status === 200) {
        this.newestGames = response.games
      } else if (response.status !== 404) {
        alert(response.message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.background {
  position: absolute;
  min-height: 100vh;
  top: 0;
  z-index: -1;
  background-color: #f6f7f8;
}

h1 {
  text-align: center;
  font-weight: bold;
}

#list-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
