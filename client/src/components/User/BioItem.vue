<template>
  <div>
    <b-row class="m-0">
      <div id="bio" class="mr-auto w-100">
        <b-row class="m-0">
          <b-card-title class="m-2">Bio</b-card-title>
          <b-button
            class="ml-auto mb-1"
            id="edit-bio-button"
            v-if="
              !this.editing && this.user.username === this.store.getUsername
            "
            variant="info"
            v-on:click="edit()"
          >
            Edit bio
          </b-button>
        </b-row>
        <b-card>
          <b-card-body>
            <b-card-text>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                v-model="editedBio"
                :disabled="!this.editing"
                :hidden="!this.editing"
              ></textarea>
              <p v-if="!this.editing">{{ user.bio }}</p>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
    </b-row>
    <div id="bio-buttons">
      <b-row v-if="this.editing" class="m-0">
        <b-button class="mr-2" v-on:click="updateBio()" variant="success">
          Save
        </b-button>

        <b-button v-on:click="discardChanges()" variant="warning">
          Discard
        </b-button>
      </b-row>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/UserStore'
import { Api } from '@/Api'

export default {
  name: 'Bio',
  props: ['user'],
  data() {
    return {
      store: useUserStore(),
      editing: false,
      editedBio: ''
    }
  },
  mounted() {
    this.editedBio = this.user.bio
  },
  methods: {
    edit() {
      this.editing = true
    },
    async updateBio() {
      if (this.editedBio === this.user.bio) {
        alert('No changes made')
        this.editing = false
        return
      }

      if (!confirm('Are you sure you want to save changes?')) {
        return
      }
      const response = await Api.patchByHateoas(this.user.links.self.href, {
        bio: this.editedBio
      })
      if (response.status === 201) {
        this.$emit('updateBio', response.data)
        this.editing = false
      } else {
        alert(response.message)
      }
    },
    discardChanges() {
      if (this.editedBio === this.user.bio) {
        this.editing = false
        return
      }

      if (!confirm('Are you sure you want to discard changes?')) {
        return
      }

      this.editedBio = this.user.bio
      this.editing = false
    }
  }
}
</script>
