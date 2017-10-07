<template v-model="post">
  <article v-loading.fullscreen.lock="fullscreenLoading" v-if="Object.keys(post).length !== 0">
    <img :src="post.images[0].url" width="100%" />
    <p>{{ post.caption }}</p>
    <el-row class="counters">
      <el-col :span="8">
        <span class="counters--number">{{ post.likeCount }}</span>
        <span class="counters--desc">Likes</span>
      </el-col>
      <el-col :span="8">
        <span class="counters--number">{{ post.commentCount }}</span>
        <span class="counters--desc">Comments</span>
      </el-col>
    </el-row>
  </article>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Post',

    data () {
      return {
        fullscreenLoading: true
      }
    },

    created () {
      this.$electron.ipcRenderer.send('getMedia', this.$route.params.id)
      this.$electron.ipcRenderer.on('getMedia:res', (event, media) => {
        this.$store.commit('SET_POST', media._params)
        this.fullscreenLoading = false
      })
    },

    computed: {
      ...mapGetters({
        post: 'getPost'
      })
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getMedia:res')
      this.$store.commit('UNSET_POST')
    }
  }
</script>
