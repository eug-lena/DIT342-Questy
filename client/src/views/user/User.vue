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
                  <b-button
                    variant="danger"
                    v-else-if="this.store.isAuthenticated"
                    :disabled="this.posting"
                    @click="deleteProfile()"
                  >
                    Delete Profile
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
              <div class="mr-auto">
                <b-row class="m-0">
                  <b-card-title>Pinned Review</b-card-title>
                </b-row>
                <b-card-text v-if="this.user.pinnedReview">
                  <pinned-review-item
                    :key="user._id"
                    :pinnedReview="user.pinnedReview"
                  ></pinned-review-item>
                </b-card-text>
                <b-card-text v-else>
                  <p>This user has not set a pinned review.</p>
                </b-card-text>
              </div>
            </b-col>

            <b-col id="right-column">
              <!-- recent -->
              <recent-activity-item :key="user._id" :user="user">
              </recent-activity-item>
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

        <!-- reviews -->
        <b-tab title="Reviews">
          <b-list-group horizontal>
            <review-item
              class="m-0 col-4"
              v-for="review in reviews.slice(
                (currentPage - 1) * perPage,
                (currentPage - 1) * perPage + perPage
              )"
              :key="review._id"
              :review="review"
              @updatePinnedReview="handleUpdatePinnedReview"
            ></review-item>
          </b-list-group>

          <div v-if="this.reviews.length > 6" class="pagination">
            <div class="overflow-auto">
              <b-pagination
                v-model="currentPage"
                :total-rows="this.reviews.length"
                :per-page="perPage"
                first-number
                last-number
                align="end"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
          <div v-if="this.reviews.length < 1">
            <h1 class="text-center">This user has not written any reviews.</h1>
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
import reviewItem from '@/components/User/ReviewItem.vue'
import pinnedReviewItem from '@/components/User/PinnedReviewItem.vue'

export default {
  components: {
    followingItem,
    bioItem,
    recentActivityItem,
    reviewItem,
    pinnedReviewItem
  },
  data() {
    return {
      user: '',
      reviews: '',
      filter: {
        username: ''
      },
      following: null,
      editing: false,
      posting: false,
      store: useUserStore(),
      loading: true,
      perPage: 6,
      currentPage: 1
    }
  },
  async mounted() {
    await this.getUser()
    this.loading = false
  },
  methods: {
    async getUserReviews() {
      const response = await Api.getReviewsByUserID(this.user._id)
      if (response.status === 200) {
        this.reviews = response.reviews
      } else if (response.status !== 404) {
        alert(response.message)
      }
    },
    async getUser() {
      const response = await Api.getUserByUsername(this.$route.params.username)
      if (response.status === 200) {
        this.user = response.user
        await this.isFollowingUser()
        await this.getUserReviews()
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

    follow() {
      this.posting = true
      Api.followUser(this.user._id)
        .then((response) => {
          if (response.status === 201) {
            this.following = true
          } else {
            alert(response.message)
          }
        })
        .catch((error) => {
          alert(error)
        })
        .finally(() => {
          this.posting = false
        })
    },

    unfollow() {
      this.posting = true
      Api.unfollowUser(this.user._id)
        .then((response) => {
          if (response.status === 200) {
            this.following = false
          } else {
            alert(response.message)
          }
        })
        .catch((error) => {
          alert(error)
        })
        .finally(() => {
          this.posting = false
        })
    },

    async deleteProfile() {
      if (
        !confirm(
          'Are you sure you want to delete your profile? This action cannot be undone.'
        )
      ) {
        return
      }

      const response = await Api.deleteByHateoas(this.user.links.self.href)
      if (response.status === 200) {
        this.$router.push('/')
      } else {
        alert(response.message)
      }
    },

    handleUpdateBio(data) {
      this.user.bio = data.bio
    },
    async handleUpdatePinnedReview(data) {
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-left: 10px;
  margin-bottom: 50px;
}

.list-group {
  flex-wrap: wrap;
}
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

#right-column {
  border: 1px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 5px;
  margin: 10px;
  min-height: 70vh;
}

#not-found {
  margin-top: 10vh;
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

  #left-column {
    margin: 0;
  }

  #right-column {
    margin: 0;
    margin-top: 10px;
  }
}
</style>
