<template>
  <el-menu default-active="1" :collapse="true">
    <el-menu-item index="1" @click="navigate('/')">
      <i class="icon-home"></i>
      <span slot="title">Home</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="icon-search"></i>
      <span slot="title">Search</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="icon-camera"></i>
      <span slot="title">Upload</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="icon-heart"></i>
      <span slot="title">Activity</span>
    </el-menu-item>
    <el-menu-item index="5" @click="navigate('/profile')">
      <i class="icon-person"></i>
      <span slot="title">Profile</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: 'Sidebar',

    methods: {
      navigate (route) {
        this.$router.push(route)
      }
    }
  }
</script>
