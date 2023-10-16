<template>
  <div class="commentBox">
    <b-row class="m-0">
      <div class="user">
        <p>{{ username }}</p>
      </div>
      <div id="ifEdited" v-if="comment.isEdited">
        <p class="editedText">(edited)</p>
      </div>
      <div class="date">
        <p>{{ date }}</p>
      </div>
    </b-row>
    <div class="opinion">
      <b-row v-if="comment.opinion === true">
        <img src="@/assets/agree.png" alt="agree" />
        <h5>Agree</h5>
      </b-row>
      <b-row v-if="comment.opinion === false">
        <img src="@/assets/disagree.png" alt="disagree" />
        <h5>Disagree</h5>
      </b-row>
      <b-row v-if="comment.opinion == null">
        <img src="@/assets/sign.png" alt="neutral" />
        <h5>Neutral</h5>
      </b-row>
    </div>
    <div class="comment">
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        v-model="editedComment.text"
        :disabled="!this.editing"
        :hidden="!this.editing"
      ></textarea>

      <div v-if="!this.editing">
        <p v-if="this.showMore || comment.text.length <= 200">
          {{ comment.text }}
        </p>
        <p v-else>{{ comment.text.slice(0, 200) }}...</p>
        <b-button
          :pressed="this.showMore"
          v-if="comment.text.length > 200"
          v-on:click="showComment()"
          class="showMoreBtn"
          text
        >
          {{ this.showMore ? 'Show less' : 'Show more' }}
        </b-button>
      </div>
    </div>

    <!-- Edit Comment -->
    <b-button
      v-if="
        !this.editing && this.comment.user.username === this.store.getUsername
      "
      variant="info"
      v-on:click="editComment()"
    >
      Edit
    </b-button>
    <b-row v-if="this.editing" class="m-0">
      <b-button class="mr-auto" v-on:click="updateComment()" variant="info">
        Save
      </b-button>

      <b-button variant="warning" v-on:click="discardUpdate()">
        Discard
      </b-button>

      <b-button class="ml-auto" v-on:click="deleteComment()" variant="danger">
        Delete
      </b-button>
    </b-row>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'comment-item',
  props: ['comment'],
  data() {
    return {
      showMore: false,
      date: '',
      username: 'Deleted user',
      editedComment: {
        text: '',
        opinion: null
      },
      editing: false,
      store: useUserStore()
    }
  },
  methods: {
    showComment() {
      this.showMore = !this.showMore
    },
    async deleteComment() {
      if (!confirm('Are you sure you want to delete this comment?')) {
        return
      }
      const response = await Api.deleteByHateoas(this.comment.links.self.href)
      if (response.status === 200) {
        this.$emit('deleteComment', this.comment._id)
      } else {
        alert(response.message)
      }
    },
    async updateComment() {
      if (!this.anyChangesMade()) {
        alert('No changes made')
        return
      }

      if (!confirm('Are you sure you want to update this comment?')) {
        return
      }

      const request = {}
      let changed = false

      if (this.comment.text !== this.editedComment.text) {
        request.text = this.editedComment.text
        changed = true
      }

      if (this.comment.opinion !== this.editedComment.opinion) {
        request.opinion = this.editedComment.opinion
        changed = true
      }

      if (!changed) {
        this.editing = false
        return
      }

      const response = await Api.patchByHateoas(
        this.comment.links.self.href,
        request
      )
      if (response.status === 201) {
        console.log(response.data)
        this.$emit('updateComment', response.data)
        this.editing = false
      } else {
        alert(response.message)
      }
    },
    editComment() {
      this.editing = true
    },
    discardUpdate() {
      if (!this.anyChangesMade()) {
        this.editing = false
        return
      }

      if (!confirm('Are you sure you want to discard your changes?')) {
        return
      }

      this.editing = false
      this.setEditedCommentToComment()
    },
    anyChangesMade() {
      return (
        this.comment.text !== this.editedComment.text ||
        this.comment.opinion !== this.editedComment.opinion
      )
    },
    setEditedCommentToComment() {
      this.editedComment.text = this.comment.text
      this.editedComment.opinion = this.comment.opinion
    }
  },
  mounted() {
    this.date = this.comment.date.slice(0, 19)
    this.date = this.date.replace('T', ' ')
    if (this.comment.user.username) {
      this.username = this.comment.user.username
    }

    this.setEditedCommentToComment()
  }
}
</script>

<style scoped>
img {
  width: 30px;
  height: 30px;
}
.commentBox {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
  word-wrap: break-word;
  margin-top: 50px;
  position: relative;
  text-overflow: ellipsis;
}
.user {
  display: inline-block;
  font-size: 1em;
  color: black;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  width: auto;
  height: 50px;
  background-color: #f5f5f5;
  margin-right: auto;
}
.comment {
  font-size: 1em;
  color: black;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  height: auto;
  background-color: #f5f5f5;
  word-wrap: break-word;
}
.showMoreBtn {
  width: 120px;
  height: 30px;
  font-size: 1em;
  padding: 3px;
  color: black;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
}
.date {
  font-size: 1em;
  margin: 10px;
  padding: 10px;
  height: 50px;
}
.editedText {
  font-size: 0.8em;
  margin: 10px;
  padding: 10px;
  height: 50px;
}
.opinion {
  margin-left: 30px;
}

h5 {
  margin-left: 5px;
}

@media screen and (max-width: 768px) {
  .commentBox {
    margin-top: 0px;
  }
}
</style>
