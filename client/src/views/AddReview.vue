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
        v-model="title"
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
        v-model="rating"
      ></b-form-rating>

      <label for="text" class="sr-only">Text</label>
      <b-form-textarea
        id="textarea-auto-height"
        v-model="text"
        placeholder="Enter text..."
        rows="8"
        name="text"
        max-rows="16"
      ></b-form-textarea>
      <b-button
        class="m-0 mt-1"
        id="add-review-button"
        variant="primary"
        v-on:click="postReview()"
      >
        Post review!
      </b-button>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'add-review',
  data() {
    return {
      game: {},
      title: '',
      rating: '',
      text: '',
      userId: ''
    }
  },
  mounted() {
    this.isAuthenticated()
  },
  methods: {
    postReview() {
      Api.post('/v1/reviews', {
        title: this.title,
        rating: this.rating,
        text: this.text,
        game: this.game._id,
        user: this.userId
      })
        .then((response) => {
          this.$router.push('/review?id=' + response.data._id)
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    getGame() {
      Api.get('/v1/games?name=' + this.$route.query.name)
        .then((response) => {
          this.game = response.data.games[0]
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    isAuthenticated() {
      Api.get('/v1/authenticate/isAuthenticated')
        .then((response) => {
          if (response.data.authenticated === true) {
            this.userId = response.data.userId
            this.getGame()
          } else {
            alert('You must be logged in to add a review')
            this.$router.push('/game?name=' + this.$route.query.name)
          }
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
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
