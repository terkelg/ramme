<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <span class="title">
          Ramme
        </span>
      </div>

      <el-button
        type="primary"
        @click="route('/login')">
        Login
      </el-button>
    </main>
  </div>
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
