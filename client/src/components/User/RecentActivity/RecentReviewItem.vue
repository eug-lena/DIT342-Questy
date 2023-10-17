<template>
  <b-row>
    <p>
      Posted a
      <router-link
        class="link"
        :to="{ name: 'review', params: { id: review._id } }"
        >review</router-link
      >
      for <i>{{ this.review.game.name }}</i>, with a rating of
      {{ this.review.rating }}.
      <br />
    </p>
  </b-row>
</template>

<script>
export default {
  name: 'RecentReview',
  props: ['review'],
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
