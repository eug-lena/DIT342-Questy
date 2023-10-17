<template>
  <div>
    <b-card>
      <b-card-title>
        <a :href="'/game/' + pinnedReview.game.name">{{
          pinnedReview.game.name
        }}</a></b-card-title
      >
      <hr />
      <b-card-body id="review">
        <b-card-text>
          <b-card-title>{{ pinnedReview.title }}</b-card-title>
          <hr />
          <b-row class="m-0">
            <img
              :src="
                require('@/assets/health-bar-' + pinnedReview.rating + '.png')
              "
              :alt="pinnedReview.rating + ' stars'"
              height="35px"
              width="auto"
            />
            <b-card-text class="ml-auto">{{
              pinnedReview.date.slice(0, 19).replace('T', ' ')
            }}</b-card-text>
          </b-row>
          <br />
          <div v-if="pinnedReview.text" id="text" class="card-text">
            <div class="text">
              <p v-if="pinnedReview.text.length < 50">
                {{ pinnedReview.text }}
              </p>
              <p v-else>{{ pinnedReview.text.slice(0, 50) }}...</p>
            </div>
          </div>
        </b-card-text>
        <b-row class="m-0 ml-0">
          <b-button variant="info" @click="showReview()">
            See the full review!
          </b-button>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { useUserStore } from '@/store/UserStore'
// import { Api } from '@/Api'

export default {
  name: 'pinnedReview',
  props: ['pinnedReview'],
  data() {
    return {
      store: useUserStore(),
      showMore: false
    }
  },
  mounted() {},
  methods: {
    showReview() {
      this.$router.push('/review/' + this.pinnedReview._id)
    }
  }
}
</script>

<style scoped>

b-card-title {
  word-break: break-word;
}

a {
  color: #000000;
}

@media screen and (max-width: 576px) {
  #review {
    margin: 0;
    padding: 0;
  }
}

</style>
