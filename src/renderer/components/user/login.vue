<template>
  <el-form label-position="left" :model="account">
    <el-form-item label="Username">
      <el-input v-model="account.username"></el-input>
    </el-form-item>
    <el-form-item label="Password">
      <el-input type="password" v-model="account.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="login"
        v-loading.fullscreen.lock="fullscreenLoading">
        Login
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data () {
      return {
        fullscreenLoading: false,
        account: {
          username: null,
          password: null
        }
      }
    },

    methods: {
      login () {
        this.fullscreenLoading = true
        this.$api.user.doLogin(this.account.username, this.account.password).then(session => {
          if (session) this.$router.push('profile')
          this.fullscreenLoading = false
        })
      }
    }
  }
</script>
