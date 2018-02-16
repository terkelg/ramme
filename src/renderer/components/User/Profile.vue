<template>
  <main>
    <header
      v-model="user"
      class="Grid--flexCells user-profile draggable">
      <div class="Grid-cell profile draggable" v-if="Object.keys(user).length !== 0">
        <Avatar :url="user.picture" className="Grid-cell--1of3"></Avatar>
        <div class="Grid-cell--fit main-infos">
          <h1>
            {{ user.username }}
            <button type="text" class="btn btn-icon">
              <i class="icon-settings"></i>
            </button>
          </h1>
          <button class="btn btn-default clickable">
            Edit profile
          </button>
          <el-button type="primary">Edit profile</el-button>
        </div>
      </div>
      <div class="Grid-cell biography-box draggable">
        <div class="biography">
          <h2>{{ user.fullName }}</h2>
          <span>{{ user.biography }}</span>
          <a :href="user.externalLynxUrl" class="clickable">{{ removeProto(user.externalUrl) }}</a>
        </div>
      </div>
      <ul class="Grid-cell counter-box draggable">
        <li class="Grid-cell--1of3 counter-item">
          <span class="counter-number">{{ user.mediaCount }}</span>
          <span class="counter-desc">post</span>
        </li>
        <li class="Grid-cell--1of3 counter-item">
          <span class="counter-number">{{ user.followingCount }}</span>
          <span class="counter-desc">follower</span>
        </li>
        <li class="Grid-cell--1of3 counter-item">
          <span class="counter-number">{{ user.followingCount }}</span>
          <span class="counter-desc">following</span>
        </li>
      </ul>
    </header>
    <section
      class="Grid post-grid posts"
      v-if="typeof posts !== 'undefined'">
      <article
        class="Grid-cell--1of3 post"
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post !== 'undefined'" class="post-content" :style="{ 'background-image': `url('${post.images[0].url}')` }" @click="log(post)">
        </div>
      </article>
      <div class="load-more">
        <button
          type="button"
          class="btn btn-default"
          @click="loadMore">
          Load More
        </button>
      </div>
    </section>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Avatar from './Avatar'

  export default {
    name: 'Profile',

    data () {
      return {
        cursor: null
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
          if (this.posts) {
            this.$store.commit('ADD_USER_FEED', media)
          } else {
            this.$store.commit('SET_USER_FEED', media)
          }
          this.cursor = this.posts[this.posts.length - 1].id
        }
      })
    },

    mounted () {
      if (!('id' in this.user)) {
        this.$electron.ipcRenderer.send('getUser')
      }

      if (!this.posts.length) {
        this.$electron.ipcRenderer.send('getUserMedia', this.cursor)
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
      },

      loadMore () {
        this.$electron.ipcRenderer.send('getUserMedia', this.cursor)
      },

      removeProto (url) {
        if (typeof url === 'undefined') return
        return url.replace(/https?:?\/?\/?/, '')
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
      this.$electron.ipcRenderer.removeAllListeners('getUserMedia:res')
    }
  }
</script>
