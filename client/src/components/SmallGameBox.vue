<template>
  <div class="col-xl-2 col-md-4 col-sm-6 col-12">
    <div class="gameBox">
      <div class="title overflow-hidden">
        <h3>{{ game.name }}</h3>
      </div>
      <b-button
        class="moreButton"
        variant="dark"
        v-on:click="gotoGame(game.name)"
        >More...</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'game-item',
  props: ['game'],
  methods: {
    gotoGame(name) {
      this.$router.push({ name: 'game', params: { name } })
    }
  }
}
</script>

<style scoped>
.gameBox {
  height: 180px;
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  background-color: #eee1ce;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}

.title {
  margin-top: 10px;
  color: Black;
  width: 100%;
  text-align: center;
  word-break: break-word;
}

#tag-list {
  display: inline-block;
  font-size: 1em;
  color: rgb(94, 94, 94);
}

.moreButton {
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
