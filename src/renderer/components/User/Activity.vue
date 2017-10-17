<template>
  <section
    class="activity"
    v-if="typeof activity !== 'undefined'">
    <article
      class="event"
      v-for="(event, i) of activity"
      :key="i">
      <pre>{{ event }}</pre>
    </article>
    <!--div class="load-more">
      <button
        type="button"
        class="btn btn-default"
        @click="loadMore">
        Load More
      </button>
    </div-->
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Activity',

    data () {
      return {
        cursor: null
      }
    },

    created () {
      this.$electron.ipcRenderer.on('getActivity:res', (event, activity) => {
        console.log(activity)
        if (activity) {
          this.$store.commit('SET_ACTIVITY', activity)
          this.cursor = this.activity[this.activity.length - 1].id
        }
      })
    },

    mounted () {
      if (!this.activity.length) {
        this.$electron.ipcRenderer.send('getActivity', this.cursor)
      }
    },

    computed: {
      ...mapGetters({
        activity: 'getActivity'
      })
    },

    methods: {
      log (post) {
        this.$router.push(`/post/${post.id}`)
      },

      loadMore () {
        this.$electron.ipcRenderer.send('getActivity', this.cursor)
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getActivity:res')
    }
  }
</script>
