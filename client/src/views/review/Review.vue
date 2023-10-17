<template>
  <div>
    <div class="background m-0"></div>
    <b-row v-if="this.review" class="m-0">
      <b-col id="reviewBox" class="col-12 col-lg-6">
        <div class="sticky-top">
          <!-- Review box -->
          <h1>
            {{ review.user.username }}'s review for {{ review.game.name }}
          </h1>

          <div id="review" class="card-body">
            <h5 id="title" class="card-title">{{ review.title }}</h5>

            <!-- Rating icon logic -->
            <div>
              <b-row>
                <p id="rating">Rating:</p>
                <img
                  :src="
                    require('../../assets/health-bar-' +
                      this.review.rating +
                      '.png')
                  "
                  alt="3 stars"
                  height="35px"
                  width="auto"
                />
              </b-row>
            </div>
            <b-row>
              <p id="date" class="card-text mr-auto">
                {{ review.date }}
              </p>
              <p v-if="review.isEdited" class="ml-auto mr-3 card-text">
                (edited)
              </p>
            </b-row>

            <div v-if="this.review.text" id="text" class="card-text">
              <div class="text">
                <p v-if="this.showMore">
                  {{ review.text }}
                </p>
                <p v-else-if="review.text.length > 200">
                  {{ review.text.slice(0, 200) }}...
                </p>
                <p v-else>{{ review.text.slice(0, 200) }}</p>
                <b-button
                  :pressed="this.showMore"
                  v-if="review.text.length > 200"
                  v-on:click="showText()"
                  variant="link"
                  class="showMoreBtn"
                  text
                >
                  {{ this.showMore ? 'Show less' : 'Show more' }}
                </b-button>
              </div>
            </div>
            <b-row id="review-buttons" class="m-0">
              <b-button
                id="editReview"
                class="mr-auto"
                variant="info"
                v-on:click="editReview()"
                :hidden="review.user.username != this.store.getUsername"
              >
                Edit review
              </b-button>

              <!-- button to add comment -->
              <b-button
                v-b-toggle.collapse-1
                id="button"
                class="ml-auto"
                variant="warning"
                :hidden="!this.store.isAuthenticated"
              >
                <span class="when-open">Hide comment</span
                ><span class="when-closed">Add comment</span>
              </b-button></b-row
            >
            <b-collapse id="collapse-1" class="mt-2">
              <div id="addComment">
                <h4 class="card-title">
                  Do you agree with {{ review.user.username }}'s review?
                </h4>
                <b-row class="m-0" id="opinion"
                  ><b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                      v-model="selected"
                      :options="options"
                      :aria-describedby="ariaDescribedby"
                      name="plain-inline"
                      plain
                    ></b-form-radio-group>
                  </b-form-group>
                </b-row>

                <div id="commentBody">
                  <b-form-textarea
                    id="commentText"
                    placeholder="Leave a comment..."
                  ></b-form-textarea>
                  <b-row class="m-2">
                    <b-button
                      id="button"
                      class="ml-auto"
                      variant="success"
                      v-on:click="postComment()"
                      :disabled="this.posting"
                      >Submit</b-button
                    >
                  </b-row>
                </div>
              </div></b-collapse
            >
          </div>
        </div>
      </b-col>

      <!-- Comments -->
      <b-col v-if="this.comments.length == 0">
        <h4 class="card-title mt-5">No comments yet</h4>
      </b-col>
      <b-col class="col-12 col-lg-6" v-else>
        <b-list-group class="comments">
          <comment-item
            v-for="comment in comments"
            :key="comment._id"
            :comment="comment"
            @deleteComment="handleDeleteComment"
            @updateComment="handleUpdateComment"
          ></comment-item>
        </b-list-group>
      </b-col>
    </b-row>
    <div v-else class="text-center" id="not-found-box">
      <b-spinner v-if="this.loading" label="Loading..."></b-spinner>
      <div v-else>
        <h2>Review not found</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

// Components
import CommentItem from '@/components/CommentBox.vue'
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'Review',
  components: {
    'comment-item': CommentItem
  },
  data() {
    return {
      showMore: false,
      review: '',
      comments: [],
      selected: 'neutral',
      options: [
        { text: 'Agree', value: 'agree' },
        { text: 'Disagree', value: 'disagree' },
        { text: 'Neutral', value: 'neutral' }
      ],
      store: useUserStore(),
      loading: true,
      posting: false
    }
  },
  mounted() {
    this.getReview()
  },
  methods: {
    async getReview() {
      const response = await Api.getReviewById(this.$route.query.id)
      if (response.status === 200) {
        this.review = response.review
        this.review.date = this.review.date.slice(0, 19)
        this.review.date = this.review.date.replace('T', ' ')
        if (!this.review.user) {
          this.review.user = { username: 'Deleted User' }
        }
        this.getComments()
      } else {
        this.loading = false
      }
    },
    async getComments() {
      const response = await Api.getByHateoas(this.review.links.comments.href)
      if (response.status === 200) {
        this.comments = response.data.comments
      } else if (response.status !== 404) {
        alert(response.message)
      }

      this.loading = false
    },
    handleDeleteComment(commentId) {
      this.comments = this.comments.filter(
        (comment) => comment._id !== commentId
      )
    },
    handleUpdateComment(comment) {
      this.comments.forEach((element) => {
        if (element._id === comment._id) {
          element.text = comment.text
          element.opinion = comment.opinion
          element.isEdited = comment.isEdited
        }
      })
    },
    editReview() {
      this.$router.push({
        name: 'edit-review',
        query: { id: this.review._id }
      })
    },
    booleanOpinion() {
      if (this.selected === 'agree') {
        return true
      } else if (this.selected === 'disagree') {
        return false
      } else {
        return null
      }
    },
    showText() {
      this.showMore = !this.showMore
    },
    async postComment() {
      this.posting = true

      const response = await Api.postByHateoas(
        this.review.links.comments.href,
        {
          user: this.store.getUserID,
          opinion: this.booleanOpinion(),
          text: document.getElementById('commentText').value
        }
      )

      if (response.status === 201) {
        this.getComments()
        document.getElementById('commentText').value = ''
        this.selected = 'neutral'
        this.$root.$emit('bv::toggle::collapse', 'collapse-1')
      } else {
        alert(response.message)
      }

      this.posting = false
    }
  }
}
</script>

<style scoped>
.background {
  position: absolute;
  min-height: 100vh;
  top: 0;
  z-index: -1;
  background-color: #f6f7f8;
}
#addComment {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  display: inline-block;
  width: 100%;
}
#commentText {
  margin: 10px;
  width: 97%;
}
#reviewBox {
  margin: 20px;
  margin-right: auto;
  margin-left: auto;
  background-color: white;
  top: 0px;
}
#review {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  background: #d9e1e9;
}
#opinion {
  padding-left: 15px;
}
#rating {
  margin-left: 15px;
  margin-right: 5px;
}
#date {
  margin-left: 15px;
}
.text {
  border: 1px solid black;
  border-radius: 10px;
  width: auto;
  background: #fff;
  word-wrap: break-word;
  margin-bottom: 15px;
  margin-top: 10px;
  padding: 5px;
}
h4 {
  margin: 15px;
  word-wrap: break-word;
}
h5 {
  word-wrap: break-word;
  font-weight: bold;
}
h1 {
  word-wrap: break-word;
  margin-left: 15px;
}
#not-found-box {
  margin-top: 100px;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

@media screen and (max-width: 576px) {
  #reviewBox {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  h1 {
    margin: 0;
    font-size: 1.4em;
  }
  h4 {
    font-size: 1.2em;
  }
  #comments {
    width: 100%;
  }
  #review {
    margin-left: 0;
    margin-right: 0;
  }
  #review-buttons > button {
    font-size: 0.8em;
  }
}
</style>
