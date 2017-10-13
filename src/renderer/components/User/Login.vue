<template>
  <form labposition="left" :model="account">
    <div label="Username">
      <input v-model="account.username"></input>
    </div>
    <div label="Password">
      <input type="password" v-model="account.password"></input>
    </div>
    <div>
      <button
        type="primary"
        @click="login">
        Login
      </button>
    </div>
  </form>
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
