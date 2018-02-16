<template>
  <el-row type="flex" justify="space-around" align="middle" v-loading="fullscreenLoading">
    <el-col :span="24">
      <el-form :model="account" label-position="top" class="login-form">
        <el-form-item label="Username" prop="username" required>
          <el-input v-model="account.username" clearable placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password" required>
          <el-input v-model="account.password" clearable placeholder="Password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()" class="clickable">Login</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'Login',

    data () {
      return {
        fullscreenLoading: false,
        account: {
          username: null,
          password: null
        }
      }
    },

    created () {
      this.$electron.ipcRenderer.on('doLogin:res', (event, session) => {
        console.log(session)
        console.log(Object.getOwnPropertyNames(session.json))

        // Show errors
        if (session.message) {
          this.$notify.error({
            title: 'Login Error',
            message: session.message
          })
        }

        // Prompt for 2FA
        if (session.json && session.json.two_factor_required) {
          this.$prompt('Please input the code that has been sent to you phone', 'Two-factor authentication', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            inputPattern: /\d+/,
            inputErrorMessage: 'Invalid Code'
          }).then(code => {
            this.$electron.ipcRenderer.send('do2FALogin', {
              session,
              code
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Login cancelled'
            })
          })
        }

        // Proceed with login
        if (!session.message && !session.json) {
          this.$router.push('profile')
        }

        // Remove loading screen
        this.fullscreenLoading = false
      })
    },

    methods: {
      login () {
        // Activate loading screen
        this.fullscreenLoading = true

        // Send login data to main process
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
