<template v-model="post">
  <article v-if="Object.keys(post).length !== 0" class="post-single draggable">
    <header>
      <Avatar :url="post.user.profile_pic_url" :size="30"></Avatar>
      <div class="user-data">
        <a :href="'/' + post.user.username" class="user-name clickable">{{ post.user.username }}</a>
      </div>
    </header>
    <div :class="classObject" v-click-helper="clickterceptor">
      <img :src="post.images[0].url" width="100%" v-if="!post.video" />
      <video
        :src="post.video.versions[0].url"
        :autoplay="isPlaying"
        loop="true"
        v-if="post.video"
        >
      </video>
      <div class="post-liked-heart"></div>
    </div>
    <div class="post-content">
      <div class="post-actions">
        <button type="button" @click="like" class="btn btn-icon">
          <i :class="likeBtn"></i>
        </button>
      </div>
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
      <p>{{ post.caption }}</p>
    </div>
    <!--pre>
      {{ post }}
    </pre-->
  </article>
</template>

<script>
  import { mapGetters } from 'vuex'
  import vueClickHelper from 'vue-click-helper'
  import Avatar from '../User/Avatar'

  export default {
    name: 'Post',

    data () {
      return {
        fullscreenLoading: true,
        likedAnimation: false,
        isPlaying: true
      }
    },

    components: {
      Avatar
    },

    directives: {
      'click-helper': vueClickHelper
    },

    methods: {
      clickterceptor (e, isDoubleClick) {
        if (isDoubleClick) {
          this.like()
        }

        if (this.post.video) {
          this.togglePlay()
        }
      },

      like () {
        this.likedAnimation = true
        this.post.hasLiked = !this.post.hasLiked

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
          'post-media': true,
          'clickable': true,
          'liked-animation': this.likedAnimation
        }
      },

      likeBtn: function () {
        return {
          'post-like-heart': !this.post.hasLiked,
          'post-liked-heart': this.post.hasLiked
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
