<template>
  <section>
    <header v-model="user" v-if="user !== null">
      <el-row class="user">
        <el-col :span="6">
          <avatar :url="user.picture" />
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
    <main v-model="feed" v-if="user !== null">
      <el-row class="posts" v-loading.body="loadingMedia">
        <el-col :span="8" v-for="post in feed" :key="post.id">
          <img :src="post.images[1].url" width="100%" @click="log(post)">
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import avatar from './avatar'
  import api from '../../../common/api'

  export default {
    data () {
      return {
        loadingMedia: true
      }
    },

    components: {
      avatar
    },

    created () {
      api.getUser().then(user => {
        if (!user) {
          this.$router.push('login')
        } else {
          this.$store.commit('SET_USER_DATA', user)
        }
      })

      api.getUserMedia().then(media => {
        if (media) {
          this.$store.commit('SET_USER_FEED', media)
          this.loadingMedia = false
        }
      })
    },

    computed: {
      ...mapGetters({
        user: 'getUser',
        feed: 'getUserPosts'
      })
    },

    methods: {
      log (p) {
        api.getPost(p.id).then(console.log)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('profile:res')
    }
  }
</script>

<style>
  .posts {
    min-height: 400px;
  }
</style>
