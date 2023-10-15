<template>
  <div>
    <div class="background" />
    <b-row v-if="this.game" class="m-3">
      <div class="game-content col-12">
        <h1 id="game-name">{{ this.game.name }}</h1>
        <h3 id="game-author">Created by: {{ this.game.author }}</h3>
        <p id="release-date">
          Release Date: {{ this.game.releaseDate.split('T')[0] }}
        </p>
        <b-row class="m-1 tag-row">
          <h5 class="m-2" v-for="tag in this.game.tag" :key="tag">{{ tag }}</h5>
        </b-row>
        <b-button
          id="deleteButton"
          class=""
          variant="danger"
          v-on:click="deleteGame()"
          :hidden="!this.store.isAuthenticated"
          >Delete</b-button
        >
        <b-button
          id="reviewButton"
          class="m-3"
          variant="success"
          v-on:click="createReview()"
          :hidden="!this.store.isAuthenticated"
          >Add review</b-button
        >
        <b-button
          id="editButton"
          class="3"
          variant="info"
          v-on:click="editGame()"
          :hidden="!this.store.isAuthenticated"
          >Edit</b-button
        >
      </div>
      <h5 class="text-center w-100 mt-5" v-if="!this.reviews.length > 0">
        {{
          this.loading
            ? 'Loading...'
            : 'There seem to be no reviews, but you can go ahead and create one!'
        }}
      </h5>
      <b-list-group horizontal>
        <review-item
          v-for="review in reviews"
          :key="review._id"
          :review="review"
        ></review-item>
      </b-list-group>
    </b-row>
    <div v-else class="text-center" id="not-found-box">
      <b-spinner v-if="this.loading" label="Loading..."></b-spinner>
      <div v-else>
        <h1>Game not found</h1>
        <router-link to="/all-games">Go to All Games</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewItem from '../../components/ReviewBox.vue'

import { Api } from '@/Api'
import { useUserStore } from '../../store/UserStore'

export default {
  name: 'home',
  components: {
    'review-item': ReviewItem
  },
  data() {
    return {
      game: '',
      reviews: '',
      error: '',
      store: useUserStore(),
      loading: true
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    async getGame() {
      const response = await Api.getGameByName(this.$route.query.name)
      if (response.status === 200) {
        this.game = response.game
        this.getReviews()
      } else {
        this.loading = false
      }
    },
    async getReviews() {
      const response = await Api.getByHateoas(this.game.links.reviews.href)
      console.log(response)
      if (response.status === 200) {
        this.reviews = response.data.reviews
      } else {
        if (response.status !== 404) {
          alert(response.message)
        }
      }
      this.loading = false
    },
    async deleteGame() {
      if (confirm('Are you sure you want to delete this game?')) {
        const response = await Api.deleteByHateoas(this.game.links.self.href)
        if (response.status === 200) {
          this.$router.push('/all-games')
        } else {
          alert(response.message)
        }
      }
    },
    createReview() {
      this.$router.push({
        name: 'add-review',
        query: { name: this.game.name }
      })
    },
    editGame() {
      this.$router.push({
        name: 'edit-game',
        query: { name: this.game.name }
      })
    }
  }
}
</script>

<style scoped>
.game-content {
  text-align: center;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  padding: 10px;
}
#game-name {
  margin-top: 10px;
  font-size: 50px;
  word-break: break-word;
}

.tag-row {
  justify-content: center;
}

.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

#not-found-box {
  margin-top: 100px;
}

b-list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
