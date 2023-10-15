<template>
  <div>
    <div class="background" />
    <div class="content">
      <header>
        <h1>Add a game</h1>
      </header>

      <b-row class="m-0">
        <label for="name" class="sr-only">Name</label>
        <input
          v-model="game.name"
          type="text"
          id="name"
          class="textbox col-12"
          placeholder="Game Name"
          required
          autofocus
        />
      </b-row>
      <br />
      <b-row class="m-0">
        <label for="author" class="sr-only">Author</label>
        <input
          v-model="game.author"
          type="text"
          id="author"
          class="textbox col-12"
          placeholder="Author"
          required
        />
      </b-row>
      <div class="btn-group" data-toggle="buttons">
        <b-row class="m-1">
          <label
            v-for="tagOption in this.tagOptions"
            :key="tagOption.name"
            class="btn btn-default m-1 border"
          >
            <input v-model="tagOption.state" type="checkbox" />
            {{ tagOption.name }}
          </label>
        </b-row>
      </div>
      <p id="releaseDate">Select release date:</p>
      <b-form-datepicker
        id="datepicker"
        v-model="game.releaseDate"
      ></b-form-datepicker>
      <br />
      <br />
      <br />
      <b-button
        id="add-game-button"
        variant="primary"
        v-on:click="postGame()"
        :disabled="
          this.posting ||
          !this.game.name ||
          !this.game.author ||
          !this.game.releaseDate ||
          !this.isAnyTagSelected
        "
      >
        Add Game
      </b-button>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'add-game',
  data() {
    return {
      selected: 'A',
      game: {
        name: '',
        author: '',
        releaseDate: '',
        tag: []
      },
      tagOptions: {
        MMO: {
          name: 'MMO'
        },
        RPG: {
          name: 'RPG'
        },
        FPS: {
          name: 'FPS'
        },
        RTS: {
          name: 'RTS'
        },
        MOBA: {
          name: 'MOBA'
        },
        TCG: {
          name: 'TCG'
        },
        BattleRoyale: {
          name: 'BattleRoyale'
        },
        Roleplay: {
          name: 'Roleplay'
        },
        Simulator: {
          name: 'Simulator'
        },
        Sandbox: {
          name: 'Sandbox'
        },
        Survival: {
          name: 'Survival'
        },
        Horror: {
          name: 'Horror'
        },
        Puzzle: {
          name: 'Puzzle'
        },
        Roguelike: {
          name: 'Roguelike'
        },
        Platformer: {
          name: 'Platformer'
        }
      },
      posting: false
    }
  },
  computed: {
    isAnyTagSelected() {
      for (const tagOption in this.tagOptions) {
        if (this.tagOptions[tagOption].state) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    async postGame() {
      this.posting = true
      this.getTags()
      const response = await Api.postGame(this.game)
      if (response.status === 201) {
        this.$router.push({
          name: 'game',
          query: { name: this.game.name }
        })
      } else {
        alert(response.message)
      }
      this.game.tag = []
      this.posting = false
    },
    getTags() {
      for (const tagOption in this.tagOptions) {
        if (this.tagOptions[tagOption].state) {
          this.game.tag.push(this.tagOptions[tagOption].name)
        }
      }
    }
  }
}
</script>

<style scoped>
header {
  margin-top: 20px;
}
.background {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: -1;
  position: absolute;
}

.content {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: #ffffff;
  width: 40%;
  height: auto;
  margin: auto;
  margin-top: 50px;
  position: relative;
}

.textbox {
  height: 5vh;
}

#releaseDate {
  margin-top: 10px;
  margin-bottom: 10px;
  color: black !important;
}

#add-game-button {
  height: 5vh;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
  background-color: #698f69 !important;
}

@media screen and (max-width: 1200px) {
  .content {
    width: 50%;
  }
}

@media screen and (max-width: 992px) {
  .content {
    width: 60%;
  }
}

@media screen and (max-width: 768px) {
  .content {
    width: 90%;
  }
}
</style>
