<template>
  <div>
    <div>
      <div>
        <b-row class="m-0 mt-2">
          <h1 id="followingText">Following</h1>
        </b-row>

        <div class="text-center" v-if="!this.following.length > 0">
          <h2 id="no-users-text">
            There are no followed users
          </h2>
        </div>

        <b-form v-else inline id="filter-form">
          <label class="sr-only" for="inline-form-input-name"> Name </label>
          <b-form-input
            class="mb-3"
            placeholder="Filter by name"
            v-model="filter.username"
          ></b-form-input>
        </b-form>
      </div>
    </div>

    <div v-if="this.following.length > 0">
      <b-list-group horizontal>
        <followedUser
          v-for="followedUser in displayedFollowers"
          :key="followedUser._id"
          :followedUser="followedUser"
        ></followedUser>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import followedUser from '@/components/User/Following/FollowedUserItem.vue'

export default {
  name: 'Following',
  props: ['following'],
  components: {
    followedUser
  },
  data() {
    return {
      filter: {
        username: ''
      }
    }
  },
  methods: {
    filterFollowers() {
      return this.following.filter((follower) => {
        return follower.username
          .toLowerCase()
          .includes(this.filter.username.toLowerCase())
      })
    }
  },
  computed: {
    displayedFollowers() {
      return this.filterFollowers()
    }
  }
}
</script>

<style scoped>
.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
#followingText {
  text-align: left;
  font-size: 50px;
  font-weight: bold;
  margin-left: 15px;
}

#filter-form {
  margin-left: 15px;
}

#no-users-text {
  font-size: 30px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 50px;
}
</style>
