<template>
  <div>
    <div>
      <div>
        <b-row class="m-0 mt-2">
          <h1 id="followingText">Following</h1>
        </b-row>

        <div class="text-center" v-if="!this.user.following.length > 0">
          <h2 id="no-users-text" v-if="!this.loading">
            There are no followed users
          </h2>
          <b-spinner v-else label="Loading..." class="mt-5"></b-spinner>
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

    <div v-if="this.user.following.length > 0">
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
// import { Api } from '@/Api'

// Components
import followedUser from '@/components/FollowedUser.vue'

// Store
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'home',
  components: {
    followedUser
  },
  data() {
    return {
      filter: {
        username: ''
      },
      user: {
        following: [
          { username: 'wwwwwwwwwwwwwwwwww', _id: '1' },
          { username: 'wwwwww', _id: '2' },
          { username: 'wwwwwwwwwwww', _id: '3' },
          { username: 'iiiiii', _id: '4' },
          { username: 'joe', _id: '5' },
          { username: 'jim', _id: '6' },
          { username: 'bob', _id: '7' },
          { username: 'joe', _id: '8' },
          { username: 'jim', _id: '9' },
          { username: 'bob', _id: '10' },
          { username: 'joe', _id: '11' },
          { username: 'jim', _id: '12' },
          { username: 'wwwwwwwwwwwwwwwwww', _id: '13' },
          { username: 'wwwwww', _id: '14' },
          { username: 'wwwwwwwwwwww', _id: '15' },
          { username: 'iiiiii', _id: '16' },
          { username: 'joe', _id: '17' },
          { username: 'jim', _id: '789' },
          { username: 'bob', _id: '123' },
          { username: 'joe', _id: '1234' },
          { username: 'jim', _id: '23' },
          { username: 'bob', _id: '12123' },
          { username: 'joe', _id: '654' },
          { username: 'jim', _id: '153' }
        ]
      },
      store: useUserStore(),
      loading: true
    }
  },
  mounted() {
    this.displayedFollowers = this.user.following
  },
  computed: {
    displayedFollowers() {
      return this.filterFollowers()
    }
  },
  methods: {
    filterFollowers() {
      return this.user.following.filter((follower) => {
        return follower.username
          .toLowerCase()
          .includes(this.filter.username.toLowerCase())
      })
    }
  }
}
</script>

  <style scoped>
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
.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
