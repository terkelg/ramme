<template>
  <el-row id="app">
    <el-col :span="4">
      <sidebar class="sidebar"></sidebar>
    </el-col>
    <el-col :span="20">
      <wrapper class="wrapper"></wrapper>
    </el-col>
  </el-row>
</template>

<script>
  import sidebar from './components/layout/sidebar'
  import wrapper from './components/layout/content'
  import api from '../common/api'

  export default {
    name: 'Ramme',
    components: {
      sidebar,
      wrapper
    },
    async created () {
      let logged = await api.isLoggedIn()
      if (!logged) this.$router.push('login')
    }
  }
</script>
