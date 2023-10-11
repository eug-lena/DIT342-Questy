<template>
  <b-row class="m-0">
    <b-col id="reviewBox">
      <div class="sticky-top">
        <!-- Review box -->
        <h1>{{ review.user.username }}'s review for {{ review.game.name }}</h1>

        <div id="review" class="card-body">
          <b-button
            id="editReview"
            class="ml-auto"
            variant="primary"
            v-on:click="editReview()"
          >
            Edit review
          </b-button>
          <h5 class="card-title">{{ review.title }}</h5>

          <!-- Rating icon logic -->
          <div>
            <b-row v-if="this.review.rating == 1">
              <p id="rating">Rating:</p>
              <img
                src="../assets/health-bar-1.png"
                alt="1 star"
                width="150px"
                height="30px"
              />
            </b-row>
            <b-row v-if="this.review.rating == 2">
              <p id="rating">Rating:</p>
              <img
                src="../assets/health-bar-2.png"
                alt="2 stars"
                width="150px"
                height="30px"
              />
            </b-row>
            <b-row v-if="this.review.rating == 3">
              <p id="rating">Rating:</p>
              <img
                src="../assets/health-bar-3.png"
                alt="3 stars"
                width="150px"
                height="30px"
              />
            </b-row>
            <b-row v-if="this.review.rating == 4">
              <p id="rating">Rating:</p>
              <img
                src="../assets/health-bar-4.png"
                alt="4 stars"
                width="150px"
                height="30px"
              />
            </b-row>
            <b-row v-if="this.review.rating == 5">
              <p id="rating">Rating:</p>
              <img
                src="../assets/health-bar-5.png"
                alt="5 stars"
                width="150px"
                height="30px"
              />
            </b-row>
          </div>

          <div id="text" class="card-text">
            <div class="text">
              <p v-if="this.showMore">
                {{ review.text }}
              </p>
              <p v-else>{{ review.text.slice(0, 200) }}</p>
              <b-button
                :pressed="this.showMore"
                v-if="review.text.length > 200"
                v-on:click="showText()"
                class="showMoreBtn"
                text
              >
                {{ this.showMore ? 'Show less' : 'Show more' }}
              </b-button>
            </div>
          </div>
          <b-row>
            <p id="date" class="card-text mr-auto">
              Posted on {{ review.date }}
            </p>
            <p v-if="review.isEdited" class="card-text">(edited)</p>
            <!-- button to add comment -->
            <b-button
              id="button"
              class="ml-auto"
              variant="primary"
              v-on:click="showCommentBox()"
              :disabled="!this.store.isAuthenticated"
            >
              {{ this.showComment ? 'Hide comment' : 'Add comment' }}
            </b-button>
          </b-row>
        </div>
        <div id="addComment">
          <h4 class="card-title">
            Do you agree with {{ review.user.username }}'s review?
          </h4>
          <div id="agreeDisagree">
            <b-row id="opinion"
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
          </div>
          <div id="commentBody">
            <b-form-textarea
              id="commentText"
              placeholder="Leave a comment..."
            ></b-form-textarea>
            <b-row class="m-2">
              <b-button
                id="button"
                class="ml-auto"
                variant="primary"
                v-on:click="postComment()"
                >Submit</b-button
              >
            </b-row>
          </div>
        </div>
      </div>
    </b-col>
    <!-- Comments -->
    <b-col v-if="this.comments.length == 0">
      <h4 class="card-title mt-5">No comments yet</h4>
    </b-col>
    <b-col v-if="this.comments.length > 0">
      <b-list-group class="comments">
        <comment-item
          v-for="comment in comments.slice(
            (currentPage - 1) * perPage,
            (currentPage - 1) * perPage + perPage
          )"
          :key="comment._id"
          :comment="comment"
        ></comment-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script>
import { Api } from '@/Api'

// Components
import CommentItem from '../components/CommentBox.vue'
import { useUserStore } from '../store/UserStore'

export default {
  name: 'Review',
  components: {
    'comment-item': CommentItem
  },
  data() {
    return {
      showMore: true,
      showComment: false,
      review: { text: '1' },
      perPage: 9,
      currentPage: 1,
      comments: [],
      selected: 'third',
      options: [
        { text: 'Agree', value: 'first' },
        { text: 'Disagree', value: 'second' },
        { text: 'Neutral', value: 'third' }
      ],
      store: useUserStore()
    }
  },
  methods: {
    getReview() {
      Api.get('v1/reviews/' + this.$route.query.id)
        .then((response) => {
          this.review = response.data
          this.review.date = this.review.date.slice(0, 19)
          this.review.date = this.review.date.replace('T', ' at ')
          if (!this.review.user) {
            this.review.user = { username: 'Deleted User' }
          }
          this.getComments()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    getComments() {
      Api.get(this.review.links.comments.href) // HATEOAS link
        .then((response) => {
          this.comments = response.data.comments
          console.log(this.comments)
        })
        .catch((error) => {
          if (error.response.status !== 404) {
            alert(error.response.data.message)
          }
        })
    },
    editReview() {
      this.$router.push({
        name: 'edit-review',
        query: { id: this.review._id }
      })
    },
    showCommentBox() {
      const commentDiv = document.getElementById('addComment')
      if (
        commentDiv.style.display === 'none' ||
        commentDiv.style.display === ''
      ) {
        this.showComment = true
        commentDiv.style.display = 'block'
      } else {
        this.showComment = false
        commentDiv.style.display = 'none'
      }
    },
    booleanOpinion() {
      if (this.selected === 'first') {
        return true
      } else if (this.selected === 'second') {
        return false
      } else {
        return null
      }
    },
    showText() {
      this.showMore = !this.showMore
    },
    postComment() {
      Api.post(this.review.links.comments.href, {
        // HATEOAS link
        user: this.store.getUserID,
        opinion: this.booleanOpinion(),
        text: document.getElementById('commentText').value
      })
        .then(() => {
          this.getComments()
          this.showCommentBox()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    }
  },

  mounted() {
    this.getReview()
    document.getElementById('addComment').style.display = 'none'
  }
}
</script>

<style scoped>
#addComment {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  margin-left: 10px;
  margin-top: 20px;
  display: none;
}
#commentText {
  margin: 10px;
  width: 97%;
}
#reviewBox {
  margin: 20px;
  background-color: white;
  top: 0px;
  max-width: 50%;
}
#review {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}
#opinion {
  margin-left: 15px;
  width: auto;
  padding: 5px;
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
#editReview {
  right: 10px;
  position: absolute;
}

@media (max-width: 1200px) {
  #reviewBox {
    width: 90%;
    max-width:90%
  }
  #comments {
    width: 90%;
  }
}
</style>
