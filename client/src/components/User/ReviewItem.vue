<template>
  <div class="col-12 col-lg-6 col-xl-4 mb-3">
    <div class="content">
      <b-row class="review-box w-100">
        <div id="game-name" class="mr-auto">
          <h5 class="ml-2">{{ review.game.name }}</h5>
        </div>
      </b-row>
      <b-row class="m-0 ml-3">
        <p id="rating">Rating:</p>
        <img
          :src="require('@/assets/health-bar-' + this.review.rating + '.png')"
          :alt="this.review.rating + ' stars'"
          height="20px"
          width="auto"
        />
        <p class="ml-auto mr-3" id="date">{{ this.date }}</p>
      </b-row>
      <b-row class="m-0 ml-3">
        <p class="col p-0" id="title">
          {{ review.title }}
        </p>
      </b-row>
      <b-row class="m-0">
        <b-button
          class="moreButton mb-1 mr-1"
          variant="dark"
          v-on:click="goToReview()"
          >More...</b-button
        >
        <b-button
          class="pinBtn mb-1 ml-1"
          variant="info"
          @click.prevent="pinReview()"
          :disabled="this.posting"
          :hidden="this.store.getUsername !== this.$route.params.username"
        >
          Pin Review
        </b-button>
      </b-row>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'review-item',
  props: ['review'],
  data() {
    return {
      date: '',
      store: useUserStore(),
      posting: false
    }
  },
  mounted() {
    this.date = this.review.date.slice(0, 10)
  },
  methods: {
    goToReview() {
      this.$router.push({
        name: 'review',
        params: { id: this.review._id }
      })
    },
    async pinReview() {
      this.posting = true
      const data = {
        pinnedReview: this.review._id
      }
      const response = await Api.patchByHateoas(
        this.review.links.user.href,
        data
      )
      if (response.status === 201) {
        this.$emit('updatePinnedReview', response.data)
      } else {
        alert(response.message)
      }
      this.posting = false
    }
  }
}
</script>

<style scoped>
h5 {
  font-weight: bold;
  word-break: break-word;
}
.content {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f1f7;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  min-height: 30vh;
}

.review-box {
  margin: 10px;
  padding: 10px;
}

#title {
  font-size: 15px;
  word-wrap: break-word;
}

.moreButton {
  bottom: 0;
  right: 0;
  position: absolute;
}
.pinBtn {
  bottom: 0;
  left: 0;
  position: absolute;
}
@media screen and (max-width: 576px) {
  .content {
    min-height: 30vh;
  }

  .review-box {
    margin-left: 1px;
    padding-left: 1px;
  }

  h5 {
    font-size: 1rem;
  }
  #rating {
    font-size: 0.8rem;
  }
  #title {
    font-size: 0.8rem;
  }
  #date {
    font-size: 0.8rem;
  }
}
@media screen and (max-width: 320px) {
  .content {
    min-height: 40vh;
  }
  #date {
    display: none;
  }
}
</style>
