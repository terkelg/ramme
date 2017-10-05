const state = {
  user: null,
  feed: null
}

const getters = {
  getUser: state => {
    return state.user
  },

  getUserPosts: state => {
    return state.feed
  }
}

const mutations = {
  UNSET_USER_DATA (state) {
    state.user = null
  },
  SET_USER_DATA (state, user) {
    state.user = user
  },
  SET_USER_FEED (state, feed) {
    state.feed = feed
  }
}

const actions = {
  setUser ({ dispatch }) {
    dispatch('SET_USER_DATA')
  },

  setUserFeed ({ dispatch }) {
    dispatch('SET_USER_FEED')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
