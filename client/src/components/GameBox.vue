<template>
  <div class="col-lg-4 col-md-6 col-sm-12">
    <div class="gameBox">
      <div class="gameBoxText overflow-hidden">
        <h2 id="title">{{ game.name }}</h2>
        <ul>
          <li id="tag-list">
            <i v-for="tag in game.tag.slice(0, 4)" :key="tag">
              {{ tag }} &nbsp;
            </i>
            <i v-if="game.tag.length > 4"> & more </i>
          </li>
        </ul>
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
  height: 160px;
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f1f7;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}

.gameBoxText {
  margin-left: 10px;
  margin-top: 10px;
}

#title {
  white-space: nowrap;
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
