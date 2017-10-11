export default [
  {
    path: '/',
    name: 'home',
    title: 'Home',
    icon: {
      normal: 'icon-home',
      filled: ''
    },
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
