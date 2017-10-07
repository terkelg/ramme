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
    name: 'Login',

    data () {
      return {
        fullscreenLoading: false,
        account: {
          username: 'anatolinicolae',
          password: null
        }
      }
    },

    created () {
      this.$electron.ipcRenderer.on('doLogin:res', (event, session) => {
        console.log(session)

        if (session) {
          this.$router.push('profile')
        }

        this.fullscreenLoading = false
      })
    },

    methods: {
      login () {
        this.fullscreenLoading = true
        this.$electron.ipcRenderer.send('doLogin', {
          account: this.account
        })
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('doLogin:res')
    }
  }
</script>
