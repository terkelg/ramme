let state = {
  feed: []
}

const getters = {
  getFeed: state => {
    return state.feed
  }
}

const mutations = {
  SET_FEED (state, feed) {
    state.feed = feed
  },
  UNSET_FEED (state) {
    state.feed = []
  }
}

const actions = {
  setFeed ({ dispatch }) {
    dispatch('SET_FEED')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
