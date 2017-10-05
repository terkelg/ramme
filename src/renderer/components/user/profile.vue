<template>
  <el-row v-model="user">
    <el-col :span="6">
      <avatar :url="user.picture" />
    </el-col>
    <el-col :span="18">
      <h2>{{ user.fullName }}</h2>
      <el-button>
        Settings
        <i class="icon-cog"></i>
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
  import { V1 as api } from 'instagram-private-api'
  import { mapGetters } from 'vuex'
  import avatar from './avatar'

  export default {
    data () {
      return {
        fullscreenLoading: true,
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

    components: {
      avatar
    },

    created () {
      this.$electron.ipcRenderer.send('profile', {
        type: 'get'
      })

      this.$electron.ipcRenderer.on(`profile:res`, (event, user) => {
        if (user) {
          this.client.device = user.username
          this.client.path = user.path

          this.account.username = user.username
          this.account.hash = user.hash

          this.fullscreenLoading = false

          this.login()
        } else {
          this.$router.push('login')
        }
      })

      this.$electron.ipcRenderer.on(`profile:rem`, (event, res) => {
        if (res) {
          this.$router.push('login')
        }
      })
    },

    computed: {
      ...mapGetters({
        user: 'getUser'
      })
    },

    methods: {
      login () {
        this.client.device = new api.Device(this.account.username)
        this.client.storage = new api.CookieFileStorage(this.client.path)

        this.session = new api.Session(this.client.device, this.client.storage)
        this.session.getAccount()
          .then(account => {
            this.$store.commit('SET_USER_DATA', account.params)
          })
          .catch(api.Exceptions.CookieNotValidError, error => {
            if (error) {
              this.$notify.error({
                title: 'Error',
                message: 'Session is not valid. Try loggin in again.'
              })

              this.$electron.ipcRenderer.send('profile', {
                type: 'remove',
                path: this.client.path
              })
            }
          })
          .catch(error => {
            if (error) {
              console.log(error)
            }
          })
      }
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('profile:res')
    }
  }
</script>
