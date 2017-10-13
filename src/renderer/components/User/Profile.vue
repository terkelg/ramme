<template>
  <div>
    <header
      v-model="user">
      <div class="profile" v-if="Object.keys(user).length !== 0">
        <Avatar :url="user.picture"></Avatar>
        <div class="main-infos">
          <h1>
            {{ user.username }}
            <button type="text" class="btn-icon">
              <i class="icon-settings"></i>
            </button>
          </h1>
          <button>
            Edit profile
          </button>
        </div>
      </div>
      <div class="biography-box">
        <div class="biography">
          <p>{{ user.biography }}</p>
          <a :href="user.externalLynxUrl">{{ user.externalUrl }}</a>
        </div>
      </div>
      <div class="counter-box">
        <div class="counter">
          <span class="counters--number">{{ user.mediaCount }}</span>
          <span class="counters--desc">post</span>
        </div>
        <div class="counter">
          <span class="counters--number">{{ user.followingCount }}</span>
          <span class="counters--desc">follower</span>
        </div>
        <div class="counter">
          <span class="counters--number">{{ user.followingCount }}</span>
          <span class="counters--desc">following</span>
        </div>
      </div>
    </header>
    <section
      class="posts"
      v-if="typeof posts !== 'undefined'">
      <article
        class="post"
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post !== 'undefined'">
          <img :src="post.images[0].url" width="100%" @click="log(post)">
        </div>
      </article>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Avatar from './Avatar'

  export default {
    name: 'Profile',

    data () {
      return {
        loadingMedia: false
      }
    },

    components: {
      Avatar
    },

    created () {
      this.$electron.ipcRenderer.on('getUser:res', (event, user) => {
        if (!user) {
          this.$router.push('login')
        } else {
          this.$store.commit('SET_USER_DATA', user)
        }
      })

      this.$electron.ipcRenderer.on('getUserMedia:res', (event, media) => {
        if (media) {
          this.$store.commit('SET_USER_FEED', media)
          this.loadingMedia = false
        }
      })
    },

    mounted () {
      if (!('id' in this.user)) {
        this.$electron.ipcRenderer.send('getUser')
      }

      if (!this.posts.length) {
        this.loadingMedia = true
        this.$electron.ipcRenderer.send('getUserMedia')
      }
    },

    computed: {
      ...mapGetters({
        user: 'getUser',
        posts: 'getUserPosts'
      })
    },

    methods: {
      log (post) {
        this.$router.push(`/post/${post.id}`)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
      this.$electron.ipcRenderer.removeAllListeners('getUserMedia:res')
    }
  }
</script>
