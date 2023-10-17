<template>
  <b-row>
    <p>
      Commented on:
      <i>
        <router-link
          class="link"
          :to="{ name: 'review', params: { id: comment.review._id } }"
          >{{ comment.review.title }}
        </router-link></i
      >
    </p>
  </b-row>
</template>

<script>
export default {
  name: 'RecentComment',
  props: ['comment'],
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
.link {
  color: rgb(54, 54, 54);
  font-weight: bold;
}
p {
  word-break: break-word;
}
</style>
