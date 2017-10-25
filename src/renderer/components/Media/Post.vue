<template v-model="post">
  <article v-if="Object.keys(post).length !== 0" class="post-single draggable">
    <header>
      <Avatar :url="post.user.profile_pic_url" :size="30"></Avatar>
      <div class="user-data">
        <a
          class="user-name clickable"
          @click="navigate(post.user.username)">
          {{ post.user.username }}
        </a>
      </div>
    </header>
    <div :class="classObject" v-click-helper="clickterceptor">
      <img :src="post.images[0].url" width="100%" v-if="typeof post.images[0].url !== 'undefined' && !post.video" />
      <video
        :src="post.video.versions[0].url"
        :autoplay="isPlaying"
        loop="true"
        v-if="typeof post.images[0].url !== 'undefined' && post.video"
        >
      </video>
      <agile v-if="typeof post.images[0].url === 'undefined'" :dots="false" :infinite="false">
        <div class="slide" v-for="image of post.images">
          <img :src="image[0].url" @click="log(post)"/>
        </div>
      </agile>
      <div class="post-liked-heart"></div>
    </div>
    <div class="post-content">
      <div class="post-actions clickable">
        <button type="button" @click="like" class="btn btn-icon">
          <i :class="likeBtn"></i>
        </button>
      </div>
      <div class="counters">
        <div :span="8">
          <span class="counters--number">{{ post.likeCount }}</span>
          <span class="counters--desc">Likes</span>
        </div>
        <div v-if="post.viewCount">
          <span class="counters--number">{{ post.viewCount }}</span>
          <span class="counters--desc">Views</span>
        </div>
        <div :span="8">
          <span class="counters--number">{{ post.commentCount }}</span>
          <span class="counters--desc">Comments</span>
        </div>
        <timeago :since="post.takenAt" :auto-update="60"></timeago>
      </div>
      <ul class="comments">
        <li class="comment-content" v-if="post.caption">
          <span
            class="comment-author clickable"
            @click="navigate(post.user.username)">
            {{ post.user.username }}
          </span>
          <span class="comment-text">{{ post.caption }}</span>
        </li>
        <li class="comment-content" v-for="comment in comments">
          <span
            class="comment-author clickable"
            @click="navigate(comment._params.user.username)">
            {{ comment._params.user.username }}
          </span>
          <span class="comment-text">{{ comment._params.text }}</span>
        </li>
      </ul>
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

        if (!isDoubleClick && this.post.video) {
          this.togglePlay()
        }
      },

      like () {
        this.$electron.ipcRenderer.send('likeMedia', this.post)
        if (!this.post.hasLiked) {
          this.likedAnimation = true
          setTimeout(() => {
            this.likedAnimation = false
          }, 750)
        }
      },

      togglePlay () {
        if (this.isPlaying) {
          this.$el.querySelector('video').pause()
        } else {
          this.$el.querySelector('video').play()
        }

        this.isPlaying = !this.isPlaying
      },

      navigate (url) {
        console.log(url)
      }
    },

    created () {
      this.$electron.ipcRenderer.send('getMedia', this.$route.params.id)

      this.$electron.ipcRenderer.on('getMedia:res', (event, media) => {
        this.$store.commit('SET_POST', media._params)
        this.fullscreenLoading = false
        this.$electron.ipcRenderer.send('getMediaComments', this.post.id)
      })

      this.$electron.ipcRenderer.on('likeMedia:res', (event, media) => {
        this.$store.commit('SET_POST', media._params)
      })

      this.$electron.ipcRenderer.on('getMediaComments:res', (event, comments) => {
        this.$store.commit('SET_POST_COMMENTS', comments)
      })
    },

    computed: {
      ...mapGetters({
        post: 'getPost',
        comments: 'getComments'
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
      this.$electron.ipcRenderer.removeAllListeners('likeMedia:res')
      this.$store.commit('UNSET_POST')
      this.$store.commit('UNSET_POST_COMMENTS')
    }
  }
</script>
