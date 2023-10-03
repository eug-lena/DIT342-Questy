<template>
  <div class="col-lg-4 col-md-6 col-sm-12">
    <div class="gameBox">
      <div class="gameBoxText overflow-hidden">
        <h2 id="title">{{ game.name }}</h2>
        <ul>
          <li id="tag" v-for="tag in game.tag.slice(0,4)" :key="tag">
            <i>{{ tag }}</i> &nbsp;
          </li>
        </ul>
      </div>
      <b-button class="deleteButton" variant="danger" v-on:click="deleteGame()"
        >Delete</b-button
      >
      <b-button
        class="moreButton"
        variant="primary"
        v-on:click="gotoGame(game.name)"
        >More...</b-button
      >
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'game-item',
  props: ['game'],
  methods: {
    gotoGame(key) {
      this.$router.push('/game' + '?name=' + key)
      console.log(this.game)
    },
    deleteGame() {
      Api.delete('v1/games/' + this.game._id)
        .then((response) => {
          window.location.reload()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
#title {
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

#tag {
  display: inline-block;
  font-size: 1em;
  color: rgb(94, 94, 94);
}

.gameBoxText {
  margin-left: 10px;
  margin-top: 10px;
}

.gameBox {
  height: 160px;
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}

.deleteButton {
  position: absolute;
  left: 0px;
  bottom: 0px;
  margin-left: 5px;
  margin-bottom: 5px;
}

.moreButton {
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
