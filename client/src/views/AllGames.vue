<template>
  <div>
    <b-div>
      <div class="b-row top-grid">
        <h1 class="gamesText">Games</h1>
        <h2 class="no-games-text" v-if="!games.length > 0">
          There are currently no games 😭
        </h2>
        <b-button
          class="addGameButton m-1"
          variant="primary"
          href="/add-game"
        >
          Add Game
        </b-button>
      </div>
    </b-div>

    <div v-if="this.games.length > 0" class="list-group">
      <b-list-group horizontal>
        <game-item
          v-for="game in games.slice(
            (currentPage - 1) * perPage,
            (currentPage - 1) * perPage + perPage
          )"
          :key="game._id"
          :game="game"
        ></game-item>
      </b-list-group>

      <div v-if="this.games.length > 9" class="pagination">
        <div class="overflow-auto">
          <b-pagination
            v-model="currentPage"
            :total-rows="this.totalRows"
            :per-page="perPage"
            first-number
            last-number
            align="end"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameItem from '../components/GameBox.vue'
import { Api } from '@/Api'

export default {
  name: 'all-games',
  components: {
    'game-item': GameItem
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1,
      games: []
    }
  },
  computed: {
    totalRows: function () {
      return this.games.length
    }
  },
  mounted() {
    this.getGames()
  },
  methods: {
    getGames() {
      Api.get('v1/games')
        .then((response) => {
          this.games = response.data.games
        })
        .catch((error) => {
          console.log(error)
        })
    },
    log() {
      console.log(this.games.length)
    }
  }
}
</script>

<style>
.pagination {
  margin-left: 10px;
  margin-bottom: 50px;
}
.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.addGameButton {
  background-color: #698f69 !important;
}
.grid {
  padding-left: 50px;
  padding-right: 50px;
}
.gamesText {
  text-align: left;
  font-size: 50px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 10px;
}
.no-games-text {
  text-align: left;
  font-size: 30px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 50px;
}
</style>
