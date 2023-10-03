<template>
  <div>
    <div class="commentBox">
      <b-row>
        <div class="user">
          <p>{{ comment.username }}</p>
        </div>
        <div v-if="this.comment.isEdited">
          <p>(edited)</p>
        </div>
        <div>
          <p>{{ this.comment.date }}</p>
        </div>
      </b-row>
      <div class="opinion">
        <b-row>
          <div v-if="this.comment.opinion === true">
            <img
              src="../assets/agree.png"
              class="agreeIcon ml-4"
              alt="agree"
              width="20"
              height="20"
            />
          </div>
          <p v-if="this.comment.opinion === true" class="ml-3">Agree</p>
          <div v-if="this.comment.opinion === false">
            <img
              src="../assets/disagree.png"
              class="disagreeIcon ml-4"
              alt="disagree"
              width="20"
              height="20"
            />
          </div>
          <p v-if="this.comment.opinion === false" class="ml-3">Disagree</p>
        </b-row>
      </div>
      <div class="comment">
        <p>{{ comment.text.slice(0, 300) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { Api } from '@/Api'
export default {
  name: 'comment-item',
  data() {
    return {
      comment: {
        username: '123451234512345123',
        opinion: true,
        isEdited: true,
        date: '2020-01-01',
        text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      }
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
  width: 40%;
  margin-left: 55%;
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
}
.comment {
  font-size: 1em;
  color: black;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  width: auto;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
