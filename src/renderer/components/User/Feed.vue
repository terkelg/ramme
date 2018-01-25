<template>
  <main>
    <section
      class="Grid posts"
      v-if="typeof posts !== 'undefined'">
      <article
        class="Grid-cell--1of3 post"
        v-for="(post, i) of posts"
        :key="i">
        <div v-if="typeof post.images[0].url !== 'undefined'" class="post-content" :style="{ 'background-image': `url('${post.images[0].url}')` }" @click="log(post)">
        </div>
        <!--pre v-if="typeof post.images[0].url === 'undefined'">
          {{ post.images[0] }}
        </pre-->
        <agile v-if="typeof post.images[0].url === 'undefined'" :dots="false" :infinite="false">
          <div class="slide" v-for="image of post.images">
            <img :src="image[0].url" @click="log(post)"/>
          </div>
        </agile>
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

  export default {
    name: 'Feed',

    data () {
      return {
        cursor: null
      }
    },

    created () {
      this.$electron.ipcRenderer.on('getUserFeed:res', (event, media) => {
        if (media) {
          if (this.posts) {
            this.$store.commit('ADD_FEED', media)
          } else {
            this.$store.commit('SET_FEED', media)
          }
          console.log(media)
          this.cursor = this.posts[this.posts.length - 1].id
        }
      })
    },

    mounted () {
      if (!this.posts.length) {
        this.$electron.ipcRenderer.send('getUserFeed', this.cursor)
      }
    },

    computed: {
      ...mapGetters({
        posts: 'getFeed'
      })
    },

    methods: {
      log (post) {
        this.$router.push(`/post/${post.id}`)
      },

      loadMore () {
        this.$electron.ipcRenderer.send('getUserFeed', this.cursor)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUserFeed:res')
    }
  }
</script>
