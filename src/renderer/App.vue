<template>
  <div id="app">
    <sidebar></sidebar>
    <wrapper></wrapper>
  </div>
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

<style>
  /* CSS */
</style>
