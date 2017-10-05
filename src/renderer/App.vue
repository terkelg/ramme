<template>
  <el-row id="app">
    <el-col :span="6">
      <sidebar class="sidebar"></sidebar>
    </el-col>
    <el-col :span="18">
      <wrapper></wrapper>
    </el-col>
  </el-row>
</template>

<script>
  import sidebar from './components/layout/sidebar'
  import wrapper from './components/layout/content'

  export default {
    name: 'Ramme',
    components: {
      sidebar,
      wrapper
    }
  }
</script>
