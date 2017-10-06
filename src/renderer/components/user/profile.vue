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
          <img :src="post._params.images[1].url" width="100%" @click="log(post)">
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import avatar from './avatar'

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
      if (this.user !== null) {
        this.$api.user.getUser().then(user => {
          if (!user) {
            this.$router.push('login')
          } else {
            this.$store.commit('SET_USER_DATA', user)
            console.log('USER : Loaded')
          }
        })
      }

      if (this.feed !== null) {
        this.$api.user.getUserMedia().then(media => {
          if (media) {
            this.$store.commit('SET_USER_FEED', media)
            console.log('FEED: Loaded')
            this.loadingMedia = false
          }
        })
      }
    },

    computed: {
      ...mapGetters({
        user: 'getUser',
        feed: 'getUserPosts'
      })
    },

    methods: {
      log (p) {
        this.$api.media.getPost(p.id).then(console.log)
      }
    },

    beforeDestroy () {
      this.$store.commit('UNSET_USER_DATA')
      console.log('USER: Unloaded')
      this.$store.commit('UNSET_USER_FEED')
      console.log('FEED: Unloaded')
    }
  }
</script>

<style>
  .posts {
    min-height: 400px;
  }
</style>
