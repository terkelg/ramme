<template>
  <div :class="appClass">
    <Sidebar class="sidebar"></Sidebar>
    <router-view class="wrapper Grid-cell"></router-view>
  </div>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import Sidebar from './components/Layout/Sidebar'

  export default {
    name: 'Ramme',

    components: {
      Sidebar,
      VuePerfectScrollbar
    },

    created () {
      this.$electron.ipcRenderer.send('getUser')
      this.$electron.ipcRenderer.on('getUser:res', (event, user) => {
        if (!user) {
          this.$router.push('login')
        }
      })
    },

    computed: {
      appClass: function () {
        return [
          'app',
          'Grid',
          `os-${process.platform}`
        ]
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
    }
  }
</script>
