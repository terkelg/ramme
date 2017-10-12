<template>
  <div v-model="posts">
    <section
      class="posts"
      v-if="typeof posts !== 'undefined'">
      <div
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post !== 'undefined'">
          <img :src="post.images[0].url" width="100%" @click="log(post)">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Feed',

    data () {
      return {
        loadingMedia: false
      }
    },

    created () {
      this.$electron.ipcRenderer.on('getUserFeed:res', (event, media) => {
        if (media) {
          this.$store.commit('SET_FEED', media)
          this.loadingMedia = false
        }
      })
    },

    mounted () {
      if (!this.posts.length) {
        this.loadingMedia = true
        this.$electron.ipcRenderer.send('getUserFeed')
      }
    },

    computed: {
      ...mapGetters({
        posts: 'getFeed'
      })
    },

    methods: {
      log (post) {
        this.$router.push(`/post/${post.id}`)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUserFeed:res')
    }
  }
</script>
