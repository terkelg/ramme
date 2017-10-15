<template>
  <div>
    <header
      v-model="user"
      class="user-profile draggable">
      <div class="profile draggable" v-if="Object.keys(user).length !== 0">
        <Avatar :url="user.picture"></Avatar>
        <div class="main-infos">
          <h1>
            {{ user.username }}
            <button type="text" class="btn btn-icon">
              <i class="icon-settings"></i>
            </button>
          </h1>
          <button class="btn btn-default clickable">
            Edit profile
          </button>
        </div>
      </div>
      <div class="biography-box draggable">
        <div class="biography">
          <h2>{{ user.fullName }}</h2>
          <span>{{ user.biography }}</span>
          <a :href="user.externalLynxUrl" class="clickable">{{ user.externalUrl }}</a>
        </div>
      </div>
      <ul class="counter-box draggable">
        <li class="counter-item">
          <span class="counter-number">{{ user.mediaCount }}</span>
          <span class="counter-desc">post</span>
        </li>
        <li class="counter-item">
          <span class="counter-number">{{ user.followingCount }}</span>
          <span class="counter-desc">follower</span>
        </li>
        <li class="counter-item">
          <span class="counter-number">{{ user.followingCount }}</span>
          <span class="counter-desc">following</span>
        </li>
      </ul>
    </header>
    <section
      class="posts"
      v-if="typeof posts !== 'undefined'">
      <article
        class="post"
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post !== 'undefined'" class="post-content" :style="{ 'background-image': `url('${post.images[0].url}')` }" @click="log(post)">
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
