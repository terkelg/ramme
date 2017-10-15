<template>
  <div class="avatar" v-bind:style="{ height: `${size}px`, width: `${size}px` }">
    <img :src="url" :height="size" :width="size" />
  </div>
</template>

<script>
  export default {
    name: 'Avatar',
    props: {
      url: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: false,
        default: 64
      }
    }
  }
</script>
