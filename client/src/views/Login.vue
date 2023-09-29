<template>
  <form action="api/v1/authenticate/login" method="post">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <label for="username" class="sr-only">Email address</label>
    <input
      type="text"
      id="username"
      name="username"
      class="form-control"
      placeholder="Username"
      autocomplete="username"
      required
      autofocus
    />
    <label for="password" class="sr-only">Password</label>
    <input
      type="password"
      id="current-password"
      name="password"
      class="form-control"
      placeholder="Password"
      autocomplete="current-password"
      required
    />
    <button class="btn btn-lg btn-primary btn-block" type="submit">
      Sign in
    </button>
  </form>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style>
</style>
