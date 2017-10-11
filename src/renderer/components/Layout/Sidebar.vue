<template>
  <aside id="sidebar">
    <div class="system-ui">
      <div class="system-ui--buttons">
        <span class="system-ui--buttons--btn close"></span>
        <span class="system-ui--buttons--btn minimize"></span>
      </div>
    </div>
    <nav>
      <ul>
        <router-link
          v-for="route in routes"
          :key="route.href"
          :to="route.href"
          tag="li">
          <i :class="route.icon"></i>
          <span slot="title">{{ route.name }}</span>
        </router-link>
        <li onclick="javascript:history.back()">
          <span class="arrow left"></span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
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
            icon: 'icon-camera',
            href: '/upload'
          },
          {
            name: 'Activity',
            icon: 'icon-heart',
            href: '/activity'
          },
          {
            name: 'Profile',
            icon: 'icon-person',
            href: '/profile'
          }
        ]
      }
    },

    methods: {
      navigate (route) {
        this.$router.push(route)
      }
    }
  }
</script>
