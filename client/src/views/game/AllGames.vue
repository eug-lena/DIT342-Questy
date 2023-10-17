<template>
  <div>
    <div class="bckg m-0" />
    <div>
      <div>
        <b-row id="test" class="m-2 mt-0">
          <h1 id="gamesText" class="m-2">Games</h1>
          <b-button
            id="add-game-button"
            class="m-4 ml-2"
            variant="primary"
            href="/add-game"
            :hidden="!this.store.isAdmin"
          >
            Add Game
          </b-button>

          <b-button
            id="delete-all-button"
            class="m-4"
            variant="danger"
            v-on:click="deleteAllGames()"
            :hidden="!this.store.isAdmin"
            >Delete All</b-button
          >
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
            class="mb-2 mb-sm-0 filter-box"
            placeholder="Filter by name"
            v-model="filter.name"
          ></b-form-input>

          <label class="sr-only" for="inline-form-input-tag"> Tag </label>
          <b-form-input
            class="mb-2 mb-sm-0 ml-0 ml-sm-1 filter-box"
            placeholder="Filter by tag"
            v-model="filter.tag"
          ></b-form-input>
        </b-form>
      </div>
    </div>

    <div v-if="this.games.length > 0">
      <b-list-group horizontal>
        <game-item
          v-for="game in this.displayedGames.slice(
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
    <h2
      v-if="this.games.length > 0 && this.displayedGames.length < 1"
      class="text-center"
    >
      No games match your search criteria
    </h2>
  </div>
</template>

<script>
import { Api } from '@/Api'

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
  computed: {
    displayedGames() {
      return this.filterGames()
    }
  },
  mounted() {
    this.getGames()
  },
  methods: {
    async getGames() {
      const response = await Api.getGames()
      if (response.status === 200) {
        this.games = response.games
      } else if (response.status !== 404) {
        alert(response.message)
      }
      this.loading = false
    },
    filterGames() {
      return this.games.filter((game) => {
        return (
          game.name.toLowerCase().includes(this.filter.name.toLowerCase()) &&
          game.tag.some((tag) => {
            return tag.toLowerCase().includes(this.filter.tag.toLowerCase())
          })
        )
      })
    },
    async deleteAllGames() {
      if (!confirm('Are you sure you want to delete all games?')) return
      if (!confirm('Are you really sure?')) return

      const response = await Api.deleteGames()
      if (response.status === 200) {
        this.games = []
      } else {
        alert(response.message)
      }
    }
  }
}
</script>

<style scoped>
#gamesText {
  font-size: 50px;
  font-weight: bold;
}
#test {
  margin-top: -15px;
}
.bckg {
  position: absolute;
  min-height: 100vh;
  top: 0;
  z-index: -1;
  background-color: #f6f7f8;
}
h2 {
  font-size: 50px;
  font-weight: bold;
}

#add-game-button {
  background-color: #698f69 !important;
}

#delete-all-button {
  background-color: #d9534f !important;
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

@media screen and (max-width: 576px) {
  .filter-box {
    max-width: 94%;
  }
}
</style>
