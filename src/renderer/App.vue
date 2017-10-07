<template>
  <el-row id="app">
    <el-col :span="4">
      <Sidebar class="sidebar"></Sidebar>
    </el-col>
    <el-col :span="20">
      <Wrapper class="wrapper"></Wrapper>
    </el-col>
  </el-row>
</template>

<script>
  import Sidebar from './components/Layout/Sidebar'
  import Wrapper from './components/Layout/Content'

  export default {
    name: 'Ramme',

    components: {
      Sidebar,
      Wrapper
    },

    created () {
      this.$electron.ipcRenderer.send('getUser')
      this.$electron.ipcRenderer.on('getUser:res', (event, user) => {
        if (!user) {
          this.$router.push('login')
        }
      })
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
    }
  }
</script>
