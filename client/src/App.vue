<template>
  <div id="app">
    <!-- Navbar taken from https://bootstrap-vue.org/docs/components/navbar/ -->
    <div v-if="this.$router.history.current.path !== '/login'">
      <b-navbar toggleable="lg">
        <b-navbar-brand
          ><img
            src="../src/assets/logo.png"
            alt="Questy"
            height="65"
            width="auto"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/">Home</b-nav-item>
            <b-nav-item href="/all-games">Games</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto" :store="store">
            <b-nav-item-dropdown right v-if="this.store.isAuthenticated">
              <template #button-content>
                <em>{{ store.getUsername }}</em>
              </template>
              <b-dropdown-item @click.prevent="goToProfile()"
                >Profile</b-dropdown-item
              >
              <b-dropdown-item @click.prevent="logout()"
                >Sign Out</b-dropdown-item
              >
            </b-nav-item-dropdown>
            <b-nav-item
              v-else-if="this.store.isAuthenticated === false"
              href="/login"
              >Sign In</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<script setup>
</script>

<script>
import { Api } from '@/Api'
import { useUserStore } from './store/UserStore'

export default {
  name: 'app',
  data() {
    return {
      store: useUserStore(),
      username: 'asd'
    }
  },
  beforeCreate() {
    Api.isAuthenticated()
  },
  watch: {
    $route(to, from) {
      Api.isAuthenticated()
    }
  },
  methods: {
    logout() {
      Api.Logout()
    },
    goToProfile() {
      this.$router.push({
        name: 'user',
        query: { username: this.store.getUsername }
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

<style scoped>
.navbar {
  background-color: rgb(217, 217, 217);
  border-bottom: 1px solid black;
}
</style>
