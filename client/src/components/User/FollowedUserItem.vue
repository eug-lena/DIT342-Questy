<template>
  <div class="userBox">
    <b-row class="m-0 align-items-center">
      <img
        id="userIcon"
        class="card-img"
        alt="user icon"
        src="@/assets/user-icon.png"
      />
      <a :href="'/user/' + this.followedUser.username">{{ followedUser.username }}</a>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'followedUser',
  props: ['followedUser'],
  data() {
    return {}
  }
}
</script>

<style scoped>
.userBox {
  display: inline-block;
  width: auto;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: #f5f5f5;
}
#userIcon {
  width: auto;
  height: 25px;
  margin-right: 10px;
}
</style>
