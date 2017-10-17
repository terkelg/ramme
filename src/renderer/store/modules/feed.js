let state = {
  feed: [],
  activity: []
}

const getters = {
  getFeed: state => {
    return state.feed
  },

  getActivity: state => {
    return state.activity
  }
}

const mutations = {
  SET_FEED (state, feed) {
    state.feed = feed
  },
  ADD_FEED (state, feed) {
    feed.forEach(e => state.feed.push(e))
  },
  UNSET_FEED (state) {
    state.feed = []
  },

  SET_ACTIVITY (state, activity) {
    state.activity = activity
  }
}

const actions = {
  setFeed ({ dispatch }) {
    dispatch('SET_FEED')
  },
  setActivity ({ dispatch }) {
    dispatch('SET_ACTIVITY')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
