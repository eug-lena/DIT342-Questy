<template>
  <div>
    <div>
      <div>
        <b-row class="m-0 mt-2">
          <h1 id="gamesText">Games</h1>
          <b-button
            id="add-game-button"
            class="m-3 ml-3"
            variant="primary"
            href="/add-game"
            :hidden="!this.store.isAuthenticated"
          >
            Add Game
          </b-button>
        </b-row>
        <div class="text-center" v-if="!this.games.length > 0">
          <h2 id="no-games-text" v-if="!this.loading">
            There are currently no games 😭
          </h2>
          <b-spinner v-else label="Loading..." class="mt-5"></b-spinner>
        </div>
        <b-form v-else inline id="filter-form">
          <label class="sr-only" for="inline-form-input-name"> Name </label>
          <b-form-input
            class="mb-2 mb-sm-0"
            placeholder="Game name"
            v-model="filter.name"
          ></b-form-input>

          <label class="sr-only" for="inline-form-input-username"> Tag </label>
          <b-form-input
            class="mb-2 mb-sm-0 ml-0 ml-sm-1"
            placeholder="Tag"
            v-model="filter.tag"
          ></b-form-input>

          <b-button class="ml-0 ml-sm-1" variant="info" v-on:click="getGames()"
            >Filter</b-button
          >
        </b-form>
      </div>
    </div>

    <div v-if="this.games.length > 0">
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
            :total-rows="this.games.length"
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
import { api } from '@/Api'

// Components
import GameItem from '@/components/GameBox.vue'

// Store
import { useUserStore } from '@/store/UserStore'

export default {
  name: 'all-games',
  components: {
    'game-item': GameItem
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1,
      games: [],
      filter: {
        name: '',
        tag: ''
      },
      store: useUserStore(),
      loading: true
    }
  },
  mounted() {
    this.getGames()
  },
  methods: {
    async getGames() {
      let filter = ''
      if (this.filter.name) {
        filter += 'name=' + this.filter.name + '&'
      }
      if (this.filter.tag) {
        filter += 'tag=' + this.filter.tag
      }
      const response = await api.getGames(filter)
      if (response.status === 200) {
        this.games = response.games
      } else if (response.status !== 404) {
        alert(response.message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
#gamesText {
  text-align: left;
  font-size: 50px;
  font-weight: bold;
  margin-left: 15px;
}

#add-game-button {
  background-color: #698f69 !important;
}

#filter-form {
  margin-left: 15px;
}

#no-games-text {
  font-size: 30px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 50px;
}

.pagination {
  margin-left: 10px;
  margin-bottom: 50px;
}

.list-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
