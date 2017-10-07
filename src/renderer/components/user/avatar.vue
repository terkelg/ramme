<template>
  <div class="avatar">
    <img :src="url" height="64" />
  </div>
</template>

<script>
  export default {
    name: 'Avatar',
    props: {
      url: {
        type: String,
        required: true
      }
    }
  }
</script>
