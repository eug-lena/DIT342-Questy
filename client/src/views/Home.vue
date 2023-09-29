<template>
  <div>
    <b-jumbotron header="Questy" :lead="'Welcome ' + username">
      <b-button class="btn_message" variant="primary" v-on:click="logout()"
        >Logout</b-button
      >
    </b-jumbotron>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      username: '"username"'
    }
  },
  created() {
    this.isAuthenticated()
  },
  methods: {
    isAuthenticated() {
      Api.get('/v1/authenticate/isAuthenticated')
        .then((response) => {
          console.log(response)
          if (!response.data.authentication) {
            this.$router.push('/login')
          } else {
            this.username = response.data.user.username
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async logout() {
      let success = true
      Api.delete('/v1/authenticate/logout').catch((error) => {
        console.log(error)
        success = false
      })
      if (success) {
        this.$router.push('/login')
      }
    }
  }
}
</script>
