export default [
  {
    path: '/',
    name: 'feed',
    title: 'Feed',
    icon: {
      normal: 'icon-home',
      filled: ''
    },
    component: require('@/components/User/Feed').default
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
