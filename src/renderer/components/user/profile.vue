<template>
  <section>
    <header
      v-model="user">
      <el-row class="user" v-if="Object.keys(user).length !== 0">
        <el-col :span="6">
          <Avatar :url="user.picture" />
        </el-col>
        <el-col :span="18">
          <h2>
            {{ user.username }}
            <el-button type="text">
              <i class="icon-cog"></i>
            </el-button>
          </h2>
          <el-button>
            Edit profile
          </el-button>
        </el-col>
      </el-row>
      <el-row class="biography">
        <el-col :span="24">
          <p>{{ user.biography }}</p>
          <a :href="user.externalLynxUrl">{{ user.externalUrl }}</a>
        </el-col>
      </el-row>
      <el-row class="counters">
        <el-col :span="8">
          <span class="counters--number">{{ user.mediaCount }}</span>
          <span class="counters--desc">post</span>
        </el-col>
        <el-col :span="8">
          <span class="counters--number">{{ user.followingCount }}</span>
          <span class="counters--desc">follower</span>
        </el-col>
        <el-col :span="8">
          <span class="counters--number">{{ user.followingCount }}</span>
          <span class="counters--desc">following</span>
        </el-col>
      </el-row>
    </header>
    <main v-model="posts">
      <el-row
        class="posts"
        v-loading.body="loadingMedia"
        v-if="typeof posts !== 'undefined'">
        <el-col
          :span="8"
          v-for="(post, i) of posts"
          :key="i">
          <div v-if="typeof post !== 'undefined'">
            <img :src="post.images[0].url" width="100%" @click="log(post)">
          </div>
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Avatar from './Avatar'

  export default {
    name: 'Profile',

    data () {
      return {
        loadingMedia: true
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

      this.$electron.ipcRenderer.send('getUser')
      this.$electron.ipcRenderer.send('getUserMedia')
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
      this.$store.commit('UNSET_USER_DATA')
      this.$store.commit('UNSET_USER_FEED')
    }
  }
</script>

<style>
  .posts {
    min-height: 400px;
  }
</style>
