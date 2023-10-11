<template>
  <div class="col-md-12 col-lg-6 col-xl-4 mb-3">
    <div class="content">
      <b-row class="user-box w-100">
        <div id="username" class="mr-auto">
          <p>{{ this.username }}</p>
        </div>
        <div id="date" v-b-tooltip.hover :title="this.review.date">
          <p>{{ this.date }}</p>
        </div>
        <h4 id="rating-text" class="ml-auto border border-dark">
          {{ review.rating }} / 5
        </h4>
      </b-row>
      <b-row class="m-0 ml-3">
        <p class="col p-0" id="title">
          {{ review.title }}
        </p>
      </b-row>
      <p id="edited" class="ml-2 mb-2" v-if="this.review.isEdited">(edited)</p>
      <b-button
        class="moreButton mb-1 mr-1"
        variant="info"
        v-on:click="goToReview()"
        >More...</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'review-item',
  props: ['review'],
  data() {
    return {
      date: '',
      username: 'Deleted user'
    }
  },
  mounted() {
    this.date = this.review.date.slice(0, 10)
    if (this.review.user) {
      this.username = this.review.user.username
    }
  },
  methods: {
    goToReview() {
      this.$router.push({
        name: 'review',
        query: { id: this.review._id }
      })
    }
  }
}
</script>

<style scoped>
.content {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  min-height: 20vh;
}

.user-box {
  margin: 10px;
  padding: 10px;
}

#username {
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  margin-top: 0px;
  padding: 10px;
  height: 50px;
  background-color: #f5f5f5;
}

#date {
  margin: 10px;
  margin-top: 0px;
  padding: 10px;
  height: 50px;
}

#rating-text {
  margin: 10px;
  margin-top: 0px;
  padding: 10px;
  height: 50px;
  width: auto;
}

#title {
  font-size: 17px;
  word-wrap: break-word;
}

#edited {
  bottom: 0;
  position: absolute;
  font-size: 0.8em;
}

.moreButton {
  bottom: 0;
  right: 0;
  position: absolute;
}

@media (max-width: 768px) {
  #date {
    display: none;
    height: 0px;
    margin: 0;
    padding: 0;
  }
}

@media (max-width: 576px) {
  .content {
    min-height: 25vh;
  }

  #rating-text {
    padding: 1px;
    height: 30px;
    font-size: 20px;
    margin-right: 1px;
    padding-right: 1px;
  }

  #username {
    padding: 1px;
    height: 30px;
    margin: 0;
  }

  .user-box {
    margin-left: 1px;
    padding-left: 1px;
  }
}
</style>
