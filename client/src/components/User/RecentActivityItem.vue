<template>
  <div id="content">
    <b-card-title id="title">Recent Activity</b-card-title>
    <b-card v-if="this.recentActivityByDate.length > 0">
      <b-card-body>
        <b-card-text>
          <div v-for="date in recentActivityByDate" :key="date.date">
            <h4>{{ date.date }}</h4>
            <div v-for="activity in date.activities" :key="activity._id">
              <div v-if="activity.type === 'review'">
                <recent-review-item :review="activity"></recent-review-item>
              </div>
              <div v-else-if="activity.type === 'comment'">
                <recent-comment-item :comment="activity"></recent-comment-item>
              </div>
            </div>
          </div>
        </b-card-text>
      </b-card-body>
    </b-card>
    <div v-else class="text-center">
      <b-spinner
        v-if="this.loading"
        label="Loading..."
        class="mt-5"
      ></b-spinner>
      <h2 v-else class="text-center">No recent activity</h2>
    </div>
  </div>
</template>

<script>
import recentReviewItem from '@/components/User/RecentActivity/RecentReviewItem.vue'
import recentCommentItem from '@/components/User/RecentActivity/RecentCommentItem.vue'
import { Api } from '@/Api'

export default {
  components: { recentReviewItem, recentCommentItem },
  props: ['user'],
  data() {
    return {
      recentActivityByDate: '',
      loading: true
    }
  },
  methods: {
    async getRecentActivity() {
      const response = await Api.getUserRecentActivity(this.user._id)
      if (response.status === 200) {
        this.recentActivityByDate = response.data
      } else if (response.status !== 404) {
        alert(response.message)
      }
    }
  },
  async mounted() {
    await this.getRecentActivity()
    this.loading = false
  }
}
</script>

<style scoped>
#title {
  width: 100%;
  text-align: center;
}
#content {
  margin-top: 1vh;
  width: 100%;
}

</style>
