<template>
  <aside id="sidebar draggable">
    <div class="system-ui draggable">
      <div class="system-ui--buttons draggable">
        <span
          class="system-ui--buttons--btn close clickable"
          @click="close"></span>
        <span
          class="system-ui--buttons--btn minimize clickable"
          @click="minimize"></span>
      </div>
    </div>
    <nav class="draggable">
      <ul class="draggable">
        <router-link
          v-for="route in routes"
          :key="route.href"
          :to="route.href"
          tag="li"
          class="clickable">
          <i :class="route.icon"></i>
          <span slot="title">{{ route.name }}</span>
        </router-link>
        <li onclick="javascript:history.back()" class="clickable">
          <span class="icon-left-arrow"></span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Sidebar',

    data () {
      return {
        routes: [
          {
            name: 'Home',
            icon: 'icon-home',
            href: '/'
          },
          {
            name: 'Search',
            icon: 'icon-search',
            href: '/search'
          },
          {
            name: 'Upload',
            icon: 'icon-upload',
            href: '/upload'
          },
          {
            name: 'Activity',
            icon: 'icon-activity',
            href: '/activity'
          },
          {
            name: 'Profile',
            icon: 'icon-profile',
            href: '/profile'
          }
        ]
      }
    },

    created () {
      this.$electron.ipcRenderer.on('getUser:res', (event, user) => {
        if (!user) {
          this.$router.push('login')
        } else {
          this.$store.commit('SET_USER_DATA', user)
        }
      })

      if (!('id' in this.user)) {
        this.$electron.ipcRenderer.send('getUser')
      }
    },

    computed: {
      ...mapGetters({
        user: 'getUser'
      })
    },

    methods: {
      close () {
        this.$electron.ipcRenderer.send('close')
      },
      minimize () {
        this.$electron.ipcRenderer.send('minimize')
      }
    },

    watch: {
      user (user) {
        if (user.gender && this.routes[4].icon.indexOf('gender') === -1) {
          this.routes[4].icon += ` gender-${user.gender}`
        }
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('getUser:res')
    }
  }
</script>
