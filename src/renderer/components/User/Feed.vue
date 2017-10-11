<template>
  <section v-model="posts">
    <el-row
      class="posts"
      v-loading.body="loadingMedia"
      v-if="typeof posts !== 'undefined'">
      <el-col
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post !== 'undefined'">
          <img :src="post.images[0].url" width="100%" @click="log(post)">
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Feed',

    data () {
      return {
        loadingMedia: true
      }
    },

    created () {
      this.$electron.ipcRenderer.on('getUserFeed:res', (event, media) => {
        if (media) {
          this.$store.commit('SET_USER_FEED', media)
          this.loadingMedia = false
        }
      })

      this.$electron.ipcRenderer.send('getUserFeed')
    },

    computed: {
      ...mapGetters({
        posts: 'getUserPosts'
      })
    },

    methods: {
      log (post) {
        this.$router.push(`/post/${post.id}`)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUserFeed:res')
      this.$store.commit('UNSET_USER_FEED')
    }
  }
</script>

<style>
  .posts {
    max-height: 400px;
    overflow: auto;
  }
</style>
