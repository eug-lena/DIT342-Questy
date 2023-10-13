<template>
  <div>
    <div class="top">
      <b-row class="m-0 align-items-center">
        <img
          id="userIcon"
          class="card-img"
          alt="user icon"
          src="../../assets/user-icon.png"
        />

        <h1 class="username">{{ user.name }}</h1>
      </b-row>
    </div>
    <div class="bio">
      <h1>Bio</h1>
      <p class="ml-3">{{ user.bio }}</p>
    </div>

    <!-- following -->
    <div>
      <b-card-title>Following</b-card-title>
      <b-card>
        <b-card-body>
          <b-card-text>
            <followed-user v-for="user in user.following" :key="user">
            </followed-user>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>

    <!-- pinned review -->
    <div>
      <b-card-title>Pinned Review</b-card-title>
      <b-card no-body class="overflow-hidden" style="max-width: 540px">
        <b-card-body>
          <b-card-text>
            <b-card-title>{{ user.pinnedReview.title }}</b-card-title>
            <b-card-text>{{ user.pinnedReview.text }}</b-card-text>
            <b-card-text>{{ user.pinnedReview.rating }}</b-card-text>
            <b-card-text>{{ user.pinnedReview.date }}</b-card-text>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import FollowedUser, { followedUser } from '../../components/FollowedUser.vue'

export default {
  components: { FollowedUser },
  name: 'user',
  'followed-user': followedUser,
  data() {
    return {
      user: {
        name: 'asaaaaaaadas',
        bio: 'this is a bio',
        following: ['bobbob2', 'bob2', 'bob3'],
        pinnedReview: {
          game: 'world of warcraft',
          title: 'this is a review',
          text: 'this is the content of the review',
          rating: 5,
          date: '2020-01-01'
        }
      }
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  }
}
</script>

<style scoped>
#userIcon {
  margin: 10px;
  height: 80px;
  width: auto;
  align-items: center;
}
.username {
  text-align: center;
  font: normal normal bold 36px/87px Arial;
  color: black;
}
.top {
  border: 1px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
  width: auto;
  display: inline-block;
}
</style>
