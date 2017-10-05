<template>
  <main id="wrapper">
    <el-button
      type="primary"
      @click="route('/login')">
      Login
    </el-button>
    <el-button
      type="primary"
      @click="route('/profile')">
      Profile
    </el-button>
  </main>
</template>

<script>
  export default {
    name: 'home',
    methods: {
      route (link) {
        // this.$electron.shell.openExternal(link)
        this.$router.push(link)
      }
    }
  }
</script>
