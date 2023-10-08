<template>
  <div>
    <div id="reviewBox" class="sticky-top">
      <!-- Review box -->
      <h1>{{ review.user }}'s review for {{ review.game }}</h1>

      <div id="review" class="card-body">
        <h5 class="card-title">{{ review.title }}</h5>
        <div>
          <b-row v-if="(this.review.rating = 3)">
            <p id="rating">Rating:</p>
            <img src="../assets/health-bar-3.png" alt="3 stars" width="200px" />
          </b-row>
        </div>
        <div id="text" class="card-text">
          <p>{{ review.text }}</p>
        </div>
        <b-row>
          <p id="date" class="card-text mr-auto">Posted on {{ review.date }}</p>
          <p v-if="review.isEdited" class="card-text">(edited)</p>
          <!-- button to add comment -->
          <b-button
            v-on:click="showCommentBox()"
            id="button"
            class="ml-auto"
            variant="primary"
            >Add comment</b-button
          >
        </b-row>
      </div>
      <div id="addComment">
        <h4 class="card-title">
          Do you agree with {{ review.user }}'s review?
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
          <b-row>
            <b-button id="button" class="ml-auto" variant="primary"
              >Submit</b-button
            >
          </b-row>
        </div>
      </div>
    </div>
    <!-- Comments -->

    <div v-if="this.comments.length > 0" class="list-group">
      <b-list-group horizontal class="comments">
        <comment-item
          v-for="comment in comments.slice(
            (currentPage - 1) * perPage,
            (currentPage - 1) * perPage + perPage
          )"
          :key="comment._id"
          :comment="comment"
        ></comment-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

// Components
import CommentItem from '../components/CommentBox.vue'

export default {
  name: 'Review',
  components: {
    'comment-item': CommentItem
  },
  data() {
    return {
      review: [],
      perPage: 9,
      currentPage: 1,
      comments: [],
      selected: '',
      options: [
        { text: 'Agree', value: 'first' },
        { text: 'Disagree', value: 'second' },
        { text: 'Neutral', value: 'third' }
      ]
    }
  },
  methods: {
    getReview() {
      Api.get('v1/reviews?_id=' + this.$route.query.id)
        .then((response) => {
          this.review = response.data.reviews[0]
          this.review.date = this.review.date.slice(0, 10)
          this.getComments()
          console.log(this.review)
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    getComments() {
      Api.get(this.review.links.comments.href) // HATEOAS link
        .then((response) => {
          this.comments = response.data.comments
        })
        .catch((error) => {
          if (error.response.status !== 404) {
            alert(error.response.data.message)
          }
        })
    },
    showCommentBox() {
      const commentDiv = document.getElementById('addComment')
      if (commentDiv.style.display === 'none') {
        commentDiv.style.display = 'block'
      } else {
        commentDiv.style.display = 'none'
      }
    }
  },
  created() {
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
}

#commentText {
  margin: 10px;
  width: 97%;
}
#reviewBox {
  width: 50%;
  margin: 20px;
  background-color: white;
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
}
#button {
  margin: 10px;
}
#date {
  margin-left: 15px;
}
#text {
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
}
h1 {
  word-wrap: break-word;
}

@media (max-width: 1200px) {
  #reviewBox {
    width: 90%;
  }
  #comments {
    width: 90%;
  }
}
</style>
