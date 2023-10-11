<template>
  <div>
    <div class="background" />
    <b-row class="m-3">
      <div class="game-content col-12">
        <h1 id="game-name">{{ this.game.name }}</h1>
        <h3 id="game-author">Created by: {{ this.game.author }}</h3>
        <p id="release-date">Release Date: {{ this.game.releaseDate.split('T')[0] }}</p>
        <b-row class="m-1 tag-row">
          <h5 class="m-2" v-for="tag in this.game.tag" :key="tag">{{ tag }}</h5>
        </b-row>
        <b-button
          id="deleteButton"
          class=""
          variant="danger"
          v-on:click="deleteGame()"
          >Delete</b-button
        >
        <b-button
          id="reviewButton"
          class="m-3"
          variant="primary"
          v-on:click="createReview()"
          :disabled="!this.store.isAuthenticated"
          >Add review</b-button
        >
        <b-button
          id="editButton"
          class="3"
          variant="info"
          v-on:click="editGame()"
          >Edit</b-button
        >
      </div>
      <h5 class="text-center w-100 mt-5" v-if="!this.reviews.length > 0">
        There seem to be no reviews, but you can go ahead and create one!
      </h5>
      <b-list-group horizontal>
        <review-item
          v-for="review in reviews"
          :key="review._id"
          :review="review"
        ></review-item>
      </b-list-group>
    </b-row>
  </div>
</template>

<script>
import ReviewItem from '../components/ReviewBox.vue'

import { Api, api } from '@/Api'
import { useUserStore } from '../store/UserStore'

export default {
  name: 'home',
  components: {
    'review-item': ReviewItem
  },
  data() {
    return {
      game: [],
      reviews: [],
      error: '',
      store: useUserStore()
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    async getGame() {
      this.game = await api.getGameByName(this.$route.query.name)
      this.getReviews()
    },
    getReviews() {
      Api.get(this.game.links.reviews.href) // HATEOAS link
        .then((response) => {
          this.reviews = response.data.reviews
        })
        .catch((error) => {
          if (error.response.status !== 404) {
            alert(error.response.data.message)
          }
        })
    },
    deleteGame() {
      if (confirm('Are you sure you want to delete this game?')) {
        Api.delete(this.game.links.self.href) // HATEOAS link
          .then((response) => {
            this.$router.push('/all-games')
          })
          .catch((error) => {
            alert(error.response.data.message)
          })
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

b-list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
