<template>
  <div class="avatar">
    <img :src="url" height="64" />
  </div>
</template>

<script>
  export default {
    name: 'avatar',
    props: ['url']
  }
</script>