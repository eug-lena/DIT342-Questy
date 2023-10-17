<template>
  <div>
    <b-card v-if="this.user" no-body>
      <b-tabs card>
        <b-tab title="Profile" active>
          <b-row v-if="this.user" class="m-0">
            <b-col id="left-column" class="col-12 col-lg-6 col-xl-8">
              <b-row id="username-box" class="m-0 align-items-center">
                <img
                  id="userIcon"
                  class="card-img"
                  alt="user icon"
                  src="@/assets/user-icon.png"
                />

                <h1 class="username">{{ user.username }}</h1>

                <!-- follow buttons -->
                <div class="ml-auto" id="follow-button-box">
                  <b-button
                    variant="danger"
                    v-if="this.following === true"
                    @click="unfollow()"
                    :disabled="this.posting"
                  >
                    Unfollow
                  </b-button>
                  <b-button
                    variant="primary"
                    v-else-if="this.following === false"
                    :disabled="this.posting"
                    @click="follow()"
                  >
                    Follow
                  </b-button>
                </div>
              </b-row>

              <!-- bio -->
              <bio-item
                :key="user._id"
                :user="user"
                @updateBio="handleUpdateBio"
              >
              </bio-item>

              <br />

              <!-- pinned review -->
              <div id="review" class="mr-auto">
                <b-card-title>Pinned Review</b-card-title>
                <b-card>
                  <b-card-body>
                    <b-card-text v-if="this.user.pinnedReview">
                      <b-card-title>{{
                        user.pinnedReview.game.name
                      }}</b-card-title>
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
            </b-col>

            <b-col id="right-column">

              <!-- recent -->
              <recent-activity-item> </recent-activity-item>

            </b-col>

          </b-row>

        </b-tab>

        <!-- following -->
        <b-tab title="Following">
          <following-item
            v-if="this.user.following.length > 0"
            :key="user._id"
            :following="user.following"
          ></following-item>
          <div v-else>
            <h1 class="text-center">This user is not following anyone.</h1>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- loading & user not found -->
    <div class="text-center mt-5 p-5" v-else>
      <b-spinner
        v-if="this.loading"
        label="Loading..."
        class="mt-5"
      ></b-spinner>
      <h2 v-else class="text-center">User not found.</h2>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

import bioItem from '@/components/User/BioItem.vue'
import followingItem from '@/components/User/FollowingItem.vue'
import recentActivityItem from '@/components/User/RecentActivityItem.vue'
import { useUserStore } from '@/store/UserStore'

export default {
  components: { followingItem, bioItem, recentActivityItem },
  data() {
    return {
      user: '',
      filter: {
        username: ''
      },
      following: null,
      editing: false,
      store: useUserStore(),
      user1: {
        _id: '1244234',
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
          game: { name: 'world of warcraft' },
          title: 'this is a review',
          text: 'this is the content of the review',
          rating: 5,
          date: '2020-01-01'
        }
      },
      loading: true
    }
  },
  async mounted() {
    await this.getUser()
    this.loading = false
  },
  methods: {
    async getUser() {
      const response = await Api.getUserByUsername(this.$route.params.username)
      if (response.status === 200) {
        this.user = response.user
        await this.isFollowingUser()
      } else if (response.status !== 404) {
        alert(response.message)
      }
    },

    async isFollowingUser() {
      if (!this.store.isAuthenticated) {
        return
      }

      if (this.store.getUserID === this.user._id) {
        return
      }

      const filter =
        '_id=' + this.store.getUserID + '&following[in]=' + this.user._id
      const response = await Api.getUsers(filter)
      if (response.status === 200) {
        this.following = response.users.length > 0
      } else if (response.status === 404) {
        this.following = false
      } else {
        alert(response.message)
      }
    },

    follow() {},

    unfollow() {},

    handleUpdateBio(data) {
      this.user.bio = data.bio
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
  width: 100%;
}

#not-found {
  margin-top: 10vh;
}
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
@media screen and (max-width: 992px) {
  #left-column {
    margin: 0;
  }

  .following {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .username {
    font-size: 30px;
  }

  #userIcon {
    height: 60px;
  }
}

@media screen and (max-width: 576px) {
  #follow-button-box {
    top: 0;
    right: 0;
    position: absolute;
  }

  .username {
    margin-top: 3vh;
    font-size: 25px;
    width: 100%;
    text-align: center;
  }

  #userIcon {
    display: none;
  }
}
</style>
