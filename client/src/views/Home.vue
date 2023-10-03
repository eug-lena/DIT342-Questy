<template>
  <div>
    <h1>Home</h1>
    <comment-item
          v-for="comment in comments.slice"
          :key="comment._id"
          :game="comment"
        ></comment-item>
    <h1>Home</h1>
    <comment-item
          v-for="comment in comments.slice"
          :key="comment._id"
          :game="comment"
        ></comment-item>
  </div>
</template>

<script>
// import { Api } from '@/Api'
import CommentItem from '../components/CommentBox.vue'

export default {
  name: 'home',
  components: {
    'comment-item': CommentItem
  },
  data() {
    return {
      comments: [
        {
          title: 'This is a comment'
        }
      ]
      comments: [
        {
          title: 'This is a comment'
        }
      ]
    }
  }
}
</script>

<style scoped>
<style scoped>
</style>
