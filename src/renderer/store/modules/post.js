let state = {
  post: {}
}

const getters = {
  getPost: state => {
    return state.post
  }
}

const mutations = {
  UNSET_POST (post) {
    state.post = {}
  },
  SET_POST (state, post) {
    state.post = post
  }
}

const actions = {
  setPost ({ dispatch }) {
    dispatch('SET_POST')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
