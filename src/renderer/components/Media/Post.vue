<template v-model="post">
  <article v-if="Object.keys(post).length !== 0" v-click-helper="clickterceptor">
    <div :class="classObject">
      <img :src="post.images[0].url" width="100%" v-if="!post.video" />
      <video
        :src="post.video.versions[0].url"
        :autoplay="isPlaying"
        loop="true"
        v-if="post.video"
        >
      </video>
      <div class="post-like-heart"></div>
    </div>
    <p>{{ post.caption }}</p>
    <div class="counters">
      <div :span="8">
        <span class="counters--number">{{ post.likeCount }}</span>
        <span class="counters--desc">Likes</span>
      </div>
      <div :span="8">
        <span class="counters--number">{{ post.commentCount }}</span>
        <span class="counters--desc">Comments</span>
      </div>
      <timeago :since="post.takenAt" :auto-update="60"></timeago>
    </div>
    <!--pre>
      {{ post.video }}
    </pre-->
  </article>
</template>

<script>
  import { mapGetters } from 'vuex'
  import vueClickHelper from 'vue-click-helper'

  export default {
    name: 'Post',

    data () {
      return {
        fullscreenLoading: true,
        likedAnimation: false,
        isPlaying: true
      }
    },

    directives: {
      'click-helper': vueClickHelper
    },

    methods: {
      clickterceptor (e, isDoubleClick) {
        if (isDoubleClick) {
          this.like()
        } else {
          this.togglePlay()
        }
      },

      like () {
        this.likedAnimation = true

        setTimeout(() => {
          this.likedAnimation = false
        }, 750)
      },

      togglePlay () {
        if (this.isPlaying) {
          this.$el.querySelector('video').pause()
        } else {
          this.$el.querySelector('video').play()
        }

        this.isPlaying = !this.isPlaying
      }
    },

    created () {
      this.$electron.ipcRenderer.send('getMedia', this.$route.params.id)
      this.$electron.ipcRenderer.on('getMedia:res', (event, media) => {
        this.$store.commit('SET_POST', media._params)
        this.fullscreenLoading = false
      })
      this.$electron.ipcRenderer.on('setMediaLike:res', (event, media) => {
        this.$store.commit('SET_POST', media._params)
        this.fullscreenLoading = false
      })
    },

    computed: {
      ...mapGetters({
        post: 'getPost'
      }),

      classObject: function () {
        return {
          'post-content': true,
          'liked-animation': this.likedAnimation
        }
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getMedia:res')
      this.$electron.ipcRenderer.removeAllListeners('setMediaLike:res')
      this.$store.commit('UNSET_POST')
    }
  }
</script>
