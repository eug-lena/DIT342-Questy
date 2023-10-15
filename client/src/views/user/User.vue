<template>
  <b-row class="m-0">
    <b-col id="left-column" class="col-12 col-lg-6 col-xl-8">
      <b-row id="username-box" class="m-0 align-items-center">
        <img
          id="userIcon"
          class="card-img"
          alt="user icon"
          src="../../assets/user-icon.png"
        />

        <h1 class="username">{{ user.username }}</h1>
      </b-row>
      <div id="bio" class="mr-auto">
        <b-card-title>Bio</b-card-title>
        <b-card>
          <b-card-body>
            <b-card-text>
              <p>{{ user.bio }}</p>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
      <!-- pinned review -->
      <div id="review" class="mr-auto">
        <b-card-title>Pinned Review</b-card-title>
        <b-card>
          <b-card-body>
            <b-card-text v-if="this.user.pinnedReview">
              <b-card-title>{{ user.pinnedReview.title }}</b-card-title>
              <b-card-text>{{ user.pinnedReview.text }}</b-card-text>
              <b-card-text>{{ user.pinnedReview.rating }}</b-card-text>
              <b-card-text>{{ user.pinnedReview.date }}</b-card-text>
            </b-card-text>
            <b-card-text v-else>
              <p>
                This user has not set a pinned review.
              </p>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
    </b-col>
    <!-- following -->
    <b-col id="right-column">
      <div id="following">
        <b-card-title>Following</b-card-title>
        <b-card>
          <b-card-body>
            <b-card-text>
              <followedUser
                v-for="followedUser in user.following.slice(0, 0)"
                :key="followedUser._id"
                :followedUser="followedUser"
              ></followedUser>
              <h3 class="text-center" v-if="this.user.following.length < 1">
                This user does not follow any users.
              </h3>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { Api } from '@/Api'

import followedUser from '@/components/FollowedUser.vue'

export default {
  components: { followedUser },
  username: 'user',
  followedUser,
  data() {
    return {
      user: {
        username: 'asaaaaaaadas',
        bio: 'this is a bio',
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
        ],
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
    async getUser() {
      const response = await Api.getUserByUsername(this.$route.query.username)
      if (response.status === 200) {
        this.user = response.user
      } else if (response.status !== 404) {
        alert(response.message)
      }
    }
  }
}
</script>

<style scoped>
#left-column {
  border: 1px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
  min-height: 70vh;
}

#userIcon {
  margin: 10px;
  height: 80px;
  width: auto;
  align-items: center;
}

#username-box {
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
  width: auto;
}

.username {
  font: normal normal bold 36px/87px Arial;
}

#bio {
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
}

#review {
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
}

#right-column {
  border: 1px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
  min-height: 70vh;
}

#following {
  display: inline-block;
}

@media screen and (max-width: 992px) {
  #left-column {
    margin: 0;
  }

  .following {
    width: 100%;
  }
}
</style>
