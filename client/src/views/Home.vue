<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'home',
  components: {},
  mounted() {},
  data() {
    return {
      imgUrl: ''
    }
  },
  methods: {
    async test() {
      const nameForFinding = 'Freddy Fazbear'
      const response = await Api.Axios.get(
        `https://api.rawg.io/api/games?key=f03d0f9f77614eae833b143d4ca60103&search=${nameForFinding}`,
        { withCredentials: false }
      )
      this.imgUrl = response.data.results[0].background_image
      console.log(response)
    }
  }
}
</script>

<style scoped>
</style>
