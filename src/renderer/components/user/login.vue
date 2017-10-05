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
        @click="init"
        v-loading.fullscreen.lock="fullscreenLoading">
        Login
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {V1 as api} from 'instagram-private-api'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        client: {
          device: null,
          storage: null,
          path: null
        },
        account: {
          username: null,
          password: null
        }
      }
    },

    created () {
      this.$electron.ipcRenderer.on('login:res', (event, arg) => {
        this.client.path = arg
        this.fullscreenLoading = false
      })
    },

    methods: {
      login () {
        this.client.device = new api.Device(this.account.username)
        this.client.storage = new api.CookieFileStorage(this.client.path)

        this.loginAndFollow(this.client.device, this.client.storage, this.account.username, this.account.password)
          .then(session => {
            this.fullscreenLoading = false
            if (session) {
              session.getAccount()
                .then(account => {
                  if (account) this.$router.push('profile')
                })
            }
          })
          .catch(api.Exceptions.CheckpointError, error => {
            return this.challengeMe(error)
          })
          .catch(api.Exceptions.AuthenticationError, error => {
            this.fullscreenLoading = false
            this.$notify.error({
              title: 'Error',
              message: error.message
            })
          })
      },

      init () {
        this.fullscreenLoading = true

        if (this.client.path !== null) {
          console.log(this.client.path)
          this.login()
        } else {
          this.$electron.ipcRenderer.send('login', this.account.username)
        }
      },

      challengeMe (error) {
        return api.Web.Challenge.resolve(error)
          .then(challenge => {
            // challenge instanceof api.Web.Challenge
            console.log(challenge.type)
            // can be phone or email
            // let's assume we got phone
            if (!challenge.type !== 'phone') return
            // Let's check if we need to submit/change our phone number
            return challenge.phone('+10123456789')
              .then(() => {
                return challenge
              })
          })
          .then(challenge => {
            // Ok we got to the next step, the response code expected by Instagram
            return challenge.code('123456')
          })
          .then(challenge => {
            return this.loginAndFollow(this.client.device, this.client.storage, this.account.username, this.account.password)
          })
      },

      loginAndFollow (device, storage, user, password) {
        return api.Session.create(device, storage, user, password)
          .then(session => {
            this.fullscreenLoading = false
            if (session) this.$router.push('profile')
          })
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('login:res')
    }
  }
</script>
