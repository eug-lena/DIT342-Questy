<template>
  <div
    id="img-container"
    :style="{
      '--backgroundImage': 'url(' + this.game.background_image + ')'
    }"
  >
    <div v-if="this.game">
      <b-row class="m-0" id="game-content-row">
        <b-col class="game-content-col col-12 col-md-5 col-lg-4 col-xl-3">
          <h1 id="game-name">{{ this.game.name }}</h1>
          <h3 id="game-author">Created by: {{ this.game.author }}</h3>
          <p id="release-date">
            Release Date: {{ this.game.releaseDate.split('T')[0] }}
          </p>
          <b-row class="m-0 tag-row">
            <h5
              id="tag-text"
              class="m-2"
              v-for="tag in this.game.tag"
              :key="tag"
            >
              {{ tag }}
            </h5>
          </b-row>
          <b-row class="tag-row m-0"
            ><b-button
              id="deleteButton"
              class="m-1"
              variant="danger"
              v-on:click="deleteGame()"
              :hidden="!this.store.isAuthenticated"
              >Delete</b-button
            >
            <b-button
              id="reviewButton"
              class="m-1"
              variant="success"
              v-on:click="createReview()"
              :hidden="!this.store.isAuthenticated"
              :disabled="this.game.releaseDate > this.getCurrentDate()"
              v-b-tooltip.hover title="This game has not been released yet!"
              >Add review</b-button
            >
            <b-button
              id="editButton"
              class="m-1"
              variant="info"
              v-on:click="editGame()"
              :hidden="!this.store.isAuthenticated"
              >Edit</b-button
            >
          </b-row>
        </b-col>
      </b-row>
      <b-row class="m-0">
        <h5
          id="not-found-text"
          class="text-center w-100 mt-5"
          v-if="!this.reviews.length > 0"
        >
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
          ></review-item> </b-list-group
      ></b-row>
    </div>
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
import ReviewItem from '@/components/ReviewBox.vue'

import { Api } from '@/Api'
import { useUserStore } from '@/store/UserStore'

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
      loading: true,
      currentDate: ''
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    async getGame() {
      const response = await Api.getGameByName(this.$route.params.name)
      if (response.status === 200) {
        await this.getBackgroundImage(response.game)
        this.game = response.game
        this.getReviews()
      } else {
        this.loading = false
      }
    },
    async getBackgroundImage(game) {
      const response = await Api.Axios.get(
        `https://api.rawg.io/api/games?key=f03d0f9f77614eae833b143d4ca60103&search=${game.name}`,
        { withCredentials: false }
      )
      if (response.data.results.length === 0) return
      const backgroundImage = response.data.results[0].background_image
      // backgroundImage = backgroundImage.replace('media/', 'media/crop/600/400/')
      game.background_image = backgroundImage
    },
    async getReviews() {
      const response = await Api.getByHateoas(this.game.links.reviews.href)
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
        params: { gamename: this.game.name }
      })
    },
    editGame() {
      this.$router.push({
        name: 'edit-game',
        params: { name: this.game.name }
      })
    },
    getCurrentDate() {
      const date = new Date()
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style scoped>
#img-container {
  background-color: rgb(255, 255, 255);
  background-image: var(--backgroundImage);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
  min-height: 90vh;
  width: 100%;
  top: 0;
  z-index: -1;
  padding: 0;
}
.game-content-col {
  text-align: center;
  margin-bottom: 10px;
  border: 5px solid #ccc;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 15px;
  min-height: 30vh;
  background: rgba(0, 0, 0, 0.6);
}

#game-name {
  margin-top: 10px;
  font-size: 50px;
  word-break: break-word;
  color: white;
}
h5 {
  word-break: break-word;
  color: white;
}
#game-author {
  color: white;
}

#release-date {
  color: white;
}

.tag-row {
  justify-content: center;
}

#tag-text {
  color: white;
}

.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

#not-found-box {
  margin-top: 100px;
}

#not-found-text {
  -webkit-text-stroke: 1px black;
  color: white;
  font-weight: bold;
  font-size: 30px;
}

b-list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 768px) {
  #game-content-row {
    margin: 0;
    padding: 15px;
  }
  .game-content-col {
    margin: 0px;
  }

  #game-name {
    font-size: 35px;
  }

  #game-author {
    font-size: 20px;
  }

  #release-date {
    font-size: 15px;
  }

  #tag-text {
    font-size: 20px;
  }
}
</style>
