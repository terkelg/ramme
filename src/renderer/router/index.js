import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/User/Login').default
    },
    {
      path: '/profile',
      name: 'profile',
      component: require('@/components/User/Profile').default
    },
    {
      path: '/post/:id',
      name: 'post',
      component: require('@/components/Media/Post').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
