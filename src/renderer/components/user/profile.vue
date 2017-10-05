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
      <el-row class="posts">
        <el-col :span="8" v-for="post in feed" :key="post.id">
          <img :src="post.images[1].url" width="100%">
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
    components: {
      avatar
    },

    async created () {
      let user = await api.getUser()

      if (!user) {
        this.$router.push('login')
      } else {
        this.$store.commit('SET_USER_DATA', user)
      }

      let posts = await api.getUserPosts()

      if (posts) {
        this.$store.commit('SET_USER_FEED', posts)
      }
    },

    computed: {
      ...mapGetters({
        user: 'getUser',
        feed: 'getUserPosts'
      })
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('profile:res')
    }
  }
</script>
