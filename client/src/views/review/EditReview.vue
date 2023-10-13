<template>
  <div class="w-100 h-100">
    <div class="background" />
    <div v-if="this.review" class="content">
      <header>
        <h1>Edit review</h1>
      </header>

      <b-row style="margin: auto">
        <label for="title" class="sr-only">Title</label>
        <input
          v-model="review.title"
          type="text"
          id="title"
          name="title"
          class="textbox col-12"
          placeholder="Review Title"
          autocomplete="title"
          required
          autofocus
        />
      </b-row>
      <label for="rating" class="sr-only">Rating</label>

      <b-form-rating
        class="mt-1 mb-1"
        name="rating"
        v-model="review.rating"
        required
      ></b-form-rating>

      <!-- text -->
      <b-form-textarea
        id="text"
        v-model="review.text"
        placeholder="Review Text"
        rows="8"
        max-rows="16"
        required
      ></b-form-textarea>

      <br />
      <b-button
        id="edit-review-button"
        variant="info"
        v-on:click="updateReview()"
        :disabled="this.posting"
        >Edit Review</b-button
      >
    </div>
    <div id="not-found-text" v-else class="text-center">
      <div v-if="!this.loading">
        <h1>Review not found</h1>
        <router-link to="/">Go to homepage</router-link>
      </div>
      <b-spinner v-else label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import { api } from '@/Api'

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
      const response = await api.getReviewById(this.$route.query.id)
      if (response.status === 200) {
        this.review = response.review
      } else {
        alert(response.message)
      }
      this.loading = false
    },
    async updateReview() {
      this.posting = true
      const response = await api.putByHateoas(
        this.review.links.self.href,
        this.review
      )
      if (response.status === 201) {
        this.$router.push({ name: 'review', query: { id: this.review.id } })
      } else {
        alert(response.message)
      }
      this.posting = false
    }
  }
}
</script>

  <style scoped>
#not-found-text {
  margin-top: 200px;
}

header {
  margin-top: 20px;
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
  height: auto;
  margin: auto;
  margin-top: 50px;
  position: relative;
}

.textbox {
  height: 5vh;
}

#release-date {
  margin-top: 10px;
  margin-bottom: 10px;
  color: black !important;
}

#edit-game-button {
  height: 5vh;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
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
