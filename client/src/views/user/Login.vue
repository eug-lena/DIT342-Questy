<template>
  <div class="background">
    <div class="content">
      <div v-if="!this.store.isAuthenticated" class="sign-in">
        <header>
          <h1>Welcome to Questy!</h1>
        </header>

        <label for="username" class="sr-only">Username</label>
        <input
          v-model="user.username"
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
          v-model="user.password"
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
          :disabled="isDisabled"
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
          :disabled="isDisabled"
          type="submit"
          class="registerButton"
          variant="primary"
          @click.prevent="register()"
        >
          <u><b>Create account <br> and sign in</b></u>
        </b-button>
      </div>

      <div v-else class="already-logged-in">
        <header>
          <h3>Already logged in as</h3>
          <br />
          <h1>{{ this.store.getUsername }}</h1>
          <br />
        </header>
        <b-row class="justify-content-center">
          <a href="/" class="btn btn-success m-2" role="button">
            <p>
              <u><b>Continue</b></u>
            </p>
          </a>
          <b-button class="m-2" variant="danger" @click.prevent="logout()">
            <p>
              <u><b>Logout</b></u>
            </p>
          </b-button>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/Api'
import { useUserStore } from '../../store/UserStore'

export default {
  name: 'login',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      store: useUserStore()
    }
  },
  computed: {
    isDisabled: function () {
      return !this.user.username || !this.user.password
    }
  },
  methods: {
    login() {
      api.Login(this.user)
    },
    register() {
      api.RegisterAndLogin(this.user)
    },
    logout() {
      api.Logout()
    }
  }
}
</script>

<style scoped>
.background {
  background: url('../../assets/background-gif.gif') no-repeat;
  background-size: cover;
  position: fixed;
  z-index: 900;
  width: 100%;
  height: 100%;
}

.sign-in > input {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 50%;
  height: 35px;
  border-radius: 5px;
  outline: black;
  background-color: #dbcec7;
}

.sign-in > button {
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
