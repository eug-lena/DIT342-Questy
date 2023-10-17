<template>
  <div id="content">
    <b-card-title>Recent Activity</b-card-title>
    <b-card>
      <b-card-body>
        <b-card-text>
          <h3 class="text-center">TODO</h3>
        </b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  props: ['user'],
  data() {
    return {
      reviews: ''
    }
  },
  methods: {
    async getRecentActivity() {
      const response = await Api.getUserRecentActivity(this.user.links.revies.href)
      this.recentActivity = response.data
    }
  },
  mounted() {
    // this.getRecentActivity()
  }
}
</script>

<style scoped>
#content {
  margin-top: 40px;
  width: 100%;
}
</style>
