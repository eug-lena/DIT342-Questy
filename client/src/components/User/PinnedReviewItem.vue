<template>
  <div>
    <div id="review" class="mr-auto">
      <b-card-title>Pinned Review</b-card-title>
      <b-card>
        <b-card-body>
          <b-card-text v-if="this.user.pinnedReview">
            <b-card-title>{{ user.pinnedReview.game }}</b-card-title>
            <b-card-title>{{ user.pinnedReview.title }}</b-card-title>
            <b-card-text>{{ user.pinnedReview.text }}</b-card-text>
            <b-card-text>{{ user.pinnedReview.rating }}</b-card-text>
            <b-card-text>{{ user.pinnedReview.date }}</b-card-text>
          </b-card-text>
          <b-card-text v-else>
            <p>This user has not set a pinned review.</p>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/UserStore'
// import { Api } from '@/Api'

export default {
  name: 'pinnedReview',
  props: ['user'],
  data() {
    return {
      store: useUserStore()
    }
  },
  mounted() {},
  methods: {}
}
</script>
