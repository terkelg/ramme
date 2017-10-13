<template>
  <div :class="appClass">
    <Sidebar class="sidebar"></Sidebar>
    <VuePerfectScrollbar class="wrapper">
      <router-view></router-view>
    </VuePerfectScrollbar>
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
      console.log(process.platform)
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
          `os-${process.platform}`
        ]
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
    }
  }
</script>
