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
        <img
          src="@/assets/agree.png"
          class="agreeIcon"
          alt="agree"
          width="30"
          height="30"
        />
        <h5>Agree</h5>
      </b-row>
      <b-row v-if="comment.opinion === false">
        <img
          src="@/assets/disagree.png"
          class="disagreeIcon"
          alt="disagree"
          width="30"
          height="30"
        />
        <h5>Disagree</h5>
      </b-row>
      <b-row v-if="comment.opinion == null">
        <img
          src="@/assets/sign.png"
          class="neutralIcon"
          alt="neutral"
          width="30"
          height="30"
        />
        <h5>Neutral</h5>
      </b-row>
    </div>
    <div class="comment">
      <p v-if="this.showMore">
        {{ comment.text }}
      </p>
      <p v-else-if="comment.text.length > 200">
        {{ comment.text.slice(0, 200) }}...
      </p>
      <p v-else>{{ comment.text.slice(0, 200) }}</p>
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
</template>

<script>
export default {
  name: 'comment-item',
  props: ['comment'],
  data() {
    return {
      showMore: false,
      date: '',
      username: 'Deleted user'
    }
  },
  methods: {
    showComment() {
      this.showMore = !this.showMore
    }
  },
  mounted() {
    this.date = this.comment.date.slice(0, 19)
    this.date = this.date.replace('T', ' ')
    if (this.comment.user.username) {
      this.username = this.comment.user.username
    }
  }
}
</script>

<style scoped>
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
