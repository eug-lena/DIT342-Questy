<template>
  <div>
    <div class="background" />
    <div v-if="this.review" class="content">
      <header>
        <h4>Edit your review for</h4>
        <h2>{{ this.review.game.name }}</h2>
      </header>

      <label for="title" class="sr-only">Title</label>
      <input
        v-model="review.title"
        type="text"
        id="title"
        name="title"
        class="textbox col-12"
        placeholder="Review Title"
        autocomplete="title"
        autofocus
      />
      <label for="rating" class="sr-only">Rating</label>

      <b-form-rating
        class="mt-1 mb-1"
        name="rating"
        v-model="review.rating"
      ></b-form-rating>

      <!-- text -->
      <b-form-textarea
        id="textarea-auto-height"
        v-model="review.text"
        placeholder="Review Text"
        rows="8"
        max-rows="16"
      ></b-form-textarea>

      <b-row class="m-0">
        <b-button
          id="edit-review-button"
          class="mr-auto"
          variant="info"
          v-on:click="updateReview()"
          :disabled="this.posting || !this.review.title || !this.review.rating"
          >Edit Review
        </b-button>

        <b-button
          id="delete-review-button"
          class="ml-auto"
          variant="danger"
          v-on:click="deleteReview()"
          :disabled="this.posting"
          >Delete Review
        </b-button>
      </b-row>
    </div>
    <div v-else class="text-center" id="not-found-box">
      <b-spinner v-if="this.loading" label="Loading..."></b-spinner>
      <div v-else>
        <h1>Review not found</h1>
        <router-link to="/">Go to homepage</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'edit-review',
  data() {
    return {
      review: '',
      loading: true,
      posting: false
    }
  },
  mounted() {
    this.getReview()
  },
  methods: {
    async getReview() {
      const response = await Api.getReviewById(this.$route.params.id)
      if (response.status === 200) {
        this.review = response.review
      } else {
        alert(response.message)
      }
      this.loading = false
    },
    async updateReview() {
      this.posting = true
      const response = await Api.putByHateoas(
        this.review.links.self.href,
        this.review
      )
      if (response.status === 201) {
        this.$router.push({ name: 'review', params: { id: this.review._id } })
      } else {
        alert(response.message)
      }
      this.posting = false
    },
    async deleteReview() {
      if (
        confirm(
          'Are you sure you want to delete your review for ' +
            this.review.game.name
        )
      ) {
        this.posting = true
        const response = await Api.deleteByHateoas(this.review.links.self.href)
        if (response.status === 200) {
          this.$router.push({
            name: 'game',
            params: { name: this.review.game.name }
          })
        } else {
          alert(response.message)
        }
      }
      this.posting = false
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

.textbox {
  height: 5vh;
}

button {
  height: 5vh;
  margin-top: 5px;
}

#not-found-box {
  margin-top: 100px;
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
