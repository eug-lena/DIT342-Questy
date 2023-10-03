<template>
  <div class="background">
    <div class="content">
      <header>
        <h1>Welcome to Questy!</h1>
      </header>
      <label for="username" class="sr-only">Username</label>
      <input
        v-model="username"
        type="text"
        id="username"
        name="username"
        class="usernameBox"
        placeholder="Username"
        autocomplete="username"
        required
        autofocus
      />
      <br />
      <label for="password" class="sr-only">Password</label>
      <input
        v-model="password"
        type="password"
        id="current-password"
        name="password"
        class="passwordBox"
        placeholder="Password"
        autocomplete="current-password"
        required
      />
      <br />
      <b-button
        :disabled="this.isDisabled"
        type="submit"
        class="loginButton"
        variant="primary"
        @click="login()"
      >
        <u><b>Sign in</b></u>
      </b-button>
      <br />
      OR
      <br />
      <b-button
        :disabled="this.isDisabled"
        type="submit"
        class="registerButton"
        variant="primary"
        @click.prevent="register()"
      >
        <u><b>Create an account</b></u>
      </b-button>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  mounted() {
    this.isAuthenticated()
  },
  computed: {
    isDisabled: function () {
      return !this.username || !this.password
    }
  },
  methods: {
    login() {
      Api.post('/v1/authenticate/login', {
        username: this.username,
        password: this.password
      })
        .then((response) => {
          if (response.data.authentication) {
            this.$router.push('/home')
          }
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    register() {
      Api.post('/v1/authenticate/register', {
        username: this.username,
        password: this.password
      })
        .then((response) => {
          if (response.data.authentication) {
            this.$router.push('/home')
          }
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    isAuthenticated() {
      Api.get('/v1/authenticate/isAuthenticated')
        .then((response) => {
          if (response.data.authentication) {
            this.$router.push('/home')
          }
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    }
  }
}
</script>

<style scoped>
.background {
  background: url('../assets/background-gif.gif') no-repeat;
  background-size: cover;
  position: fixed;
  z-index: 900;
  width: 100%;
  height: 100%;
}

input {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 50%;
  height: 35px;
  border-radius: 5px;
  outline: black;
  background-color: #dbcec7;
}

button {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 40%;
  color: black !important;
}

.loginButton {
  background-color: #ef7c3e !important;
}

.registerButton {
  background-color: #698f69 !important;
}

.content {
  background: rgb(240, 240, 240);
  width: 500px;
  height: auto;
  padding-top: 50px;
  padding-bottom: 50px;
  margin-top: 5%;
  margin-left: 5%;
  border: 2px solid black;
  border-radius: 10px;
  text-align: center;
}

@media screen and (max-width: 576px) {
  .content {
    width: 100%;
    margin-left: 0;
    margin-top: 0;
    border: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  button {
    font-size: 12px;
  }

  h1 {
    font-size: 5vh;
  }
}
</style>
