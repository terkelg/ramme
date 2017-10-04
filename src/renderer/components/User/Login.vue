<template>
  <el-row type="flex" justify="center">
    <el-col :span="10">
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
    </el-col>
  </el-row>
</template>

<script>
  import {V1 as api} from 'instagram-private-api'

  export default {
    data () {
      return {
        fullscreenLoading: true,
        device: null,
        storage: null,
        account: {
          username: null,
          password: null
        }
      }
    },
    created () {
      this.$electron.ipcRenderer.send('store', this.account.username)
      this.$electron.ipcRenderer.on(`store:res`, (event, arg) => {
        this.storage = arg
        console.log(arg)
        this.fullscreenLoading = false
      })
    },
    methods: {
      login () {
        this.fullscreenLoading = true
        this.$electron.ipcRenderer.send('store')

        if (this.fullscreenLoading) return

        this.device = new api.Device(this.account.username)
        this.storage = new api.CookieFileStorage(this.storage)

        this.loginAndFollow(this.device, this.storage, this.account.username, this.account.password)
          .catch(api.Exceptions.CheckpointError, error => {
            return this.challengeMe(error)
          })
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
            return this.loginAndFollow(this.device, this.storage, this.account.username, this.account.password)
          })
      },

      loginAndFollow (device, storage, user, password) {
        return api.Session.create(device, storage, user, password)
          .then(session => {
            this.fullscreenLoading = false
            return session
          })
      }
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('created')
    }
  }
</script>
