<template>
  <div class="w-100 h-100">
    <div class="background" />
    <div v-if="gameFound" class="content">
      <header>
        <h1>Edit game</h1>
      </header>

      <b-row style="margin: auto">
        <label for="name" class="sr-only">Name</label>
        <input
          v-model="game.name"
          type="text"
          id="name"
          name="name"
          class="textbox col-12"
          placeholder="Game Name"
          autocomplete="name"
          required
          autofocus
        />
      </b-row>
      <br />
      <b-row style="margin: auto">
        <label for="author" class="sr-only">Author</label>
        <input
          v-model="game.author"
          type="text"
          id="author"
          name="author"
          class="textbox col-12"
          placeholder="Author"
          autocomplete="author"
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
      <p id="release-date">Select release date:</p>
      <b-form-datepicker
        id="datepicker"
        v-model="game.releaseDate"
        class=""
      ></b-form-datepicker>
      <br />
      <br />
      <br />
      <b-button
        id="edit-game-button"
        variant="info"
        v-on:click="updateGame()"
        >Edit Game</b-button
      >
    </div>
    <div v-if="!this.gameFound" class="text-center">
      <h1 id="not-found-text">Game not found</h1>
      <router-link to="/all-games">Go to All Games</router-link>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'edit-game',
  data() {
    return {
      selected: 'A',
      gameFound: '',
      game: {},
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
        }
      }
    }
  },
  mounted() {
    this.getGame()
  },
  methods: {
    getGame() {
      Api.get('v1/games?name=' + this.$route.query.name)
        .then((response) => {
          this.gameFound = true
          this.game = response.data.games[0]
          for (const tagOption in this.tagOptions) {
            if (this.game.tag.includes(this.tagOptions[tagOption].name)) {
              this.tagOptions[tagOption].state = true
            }
          }
          this.game.tag = []
          console.log(this.game)
        })
        .catch((error) => {
          this.gameFound = false
          alert(error.response.data.message)
        })
    },
    updateGame() {
      this.getTags()
      Api.put(this.game.links.self.href, { // HATEOAS link
        name: this.game.name,
        author: this.game.author,
        releaseDate: this.game.releaseDate,
        tag: this.game.tag
      })
        .then(() => {
          this.$router.push('/all-games')
        })
        .catch((error) => {
          alert(error.response.data.message)
          this.tag = []
        })
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
#not-found-text {
  margin-top: 200px;
}

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

#release-date {
  margin-top: 10px;
  margin-bottom: 10px;
  color: black !important;
}

#edit-game-button {
  height: 5vh;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
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
