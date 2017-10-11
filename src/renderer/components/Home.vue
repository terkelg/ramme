<template>
  <Feed></Feed>
</template>

<script>
  import Feed from './User/Feed'

  export default {
    name: 'Home',

    components: {
      Feed
    },

    methods: {
      route (link) {
        // this.$electron.shell.openExternal(link)
        this.$router.push(link)
      }
    }
  }
</script>
