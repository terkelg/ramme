const state = {
  user: 2
}

const getters = {
  getUser: state => {
    return state.user
  }
}

const mutations = {
  UNSET_USER_DATA (state) {
    state.user = null
  },
  SET_USER_DATA (state, user) {
    state.user = user
  }
}

const actions = {
  setUser ({ dispatch }) {
    dispatch('SET_USER_DATA')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
