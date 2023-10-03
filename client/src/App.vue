<template>
  <div id="app">
    <!-- Navbar taken from https://bootstrap-vue.org/docs/components/navbar/ -->
    <div v-if="this.$router.history.current.path !== '/login'">
      <b-navbar toggleable="lg">
        <b-navbar-brand
          ><img src="../src/assets/logo.png" alt="Questy" width="180" height="60"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/">Home</b-nav-item>
            <b-nav-item href="/games">Games</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="/user">Profile</b-dropdown-item>
              <b-dropdown-item href="/login">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

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
