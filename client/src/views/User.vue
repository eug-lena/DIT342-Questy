<template>
  <div>
    <div>
        <div class="content-profile">
            <b-card  border-variant="light"
                  header= "User"
                  header-bg-variant="light"
                  header-text-variant="info"
                  align="center"
                  style="width: 40rem;">
                  <p id="details" align="center"> Name: {{user.name}} <br> Bio: {{user.bio}} </p>
            </b-card>
         </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      user: {
        name: 'a',
        bio: 'sd'
      }
    }
  },
  mounted() {
    console.log(this.$route.query)
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  }
}
</script>

<style scoped>

</style>
