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
  import api from '../../../common/api'

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
      async login () {
        this.fullscreenLoading = true
        let session = await api.doLogin(this.account.username, this.account.password)
        if (session) this.$router.push('profile')
        this.fullscreenLoading = false
      }
    }
  }
</script>
