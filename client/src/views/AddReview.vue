<template>
  <div>
    <div class="background" />
    <div class="content">
      <header>
        <h4>Add a review for</h4>
        <h2>{{ this.game.name }}</h2>
      </header>
      <label for="title" class="sr-only">Title</label>
      <input
        v-model="review.title"
        type="text"
        id="title"
        name="title"
        class="col-12 mt-1"
        placeholder="Title"
        autofocus
      />
      <label for="rating" class="sr-only">Rating</label>

      <b-form-rating
        class="mt-1 mb-1"
        name="rating"
        v-model="review.rating"
      ></b-form-rating>

      <label for="text" class="sr-only">Text</label>
      <b-form-textarea
        id="textarea-auto-height"
        v-model="review.text"
        placeholder="Enter text..."
        rows="8"
        name="text"
        max-rows="16"
      ></b-form-textarea>
      <b-button
        class="m-0 mt-1"
        id="add-review-button"
        variant="primary"
        v-on:click="test()"
      >
        Post review!
      </b-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/Api'
import { useUserStore } from '../store/UserStore'

export default {
  name: 'add-review',
  data() {
    return {
      game: {},
      review: {
        title: '',
        rating: '',
        text: '',
        user: '',
        game: ''
      },
      store: useUserStore()
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    postReview() {
      if (!this.store.isAuthenticated) {
        alert('You must be logged in to post a review!')
      } else {
        this.review.user = this.store.getUserID
        api.postReview(this.review)
      }
    },
    async getGame() {
      this.game = await api.getGameByName(this.$route.query.name)
      this.review.game = this.game._id
    }
  }
}
</script>

<style scoped>
header {
  margin-top: 20px;
  word-wrap: break-word;
  text-align: center;
}
.background {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: -1;
  position: absolute;
}

.content {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: #ffffff;
  width: 40%;
  margin: auto;
  margin-top: 50px;
}

#title {
  height: 5vh;
}

#add-review-button {
  height: 5vh;
  width: 100%;
  background-color: #698f69 !important;
}

@media screen and (max-width: 1200px) {
  .content {
    width: 50%;
  }
}

@media screen and (max-width: 992px) {
  .content {
    width: 60%;
  }
}

@media screen and (max-width: 768px) {
  .content {
    width: 90%;
  }
}
</style>
