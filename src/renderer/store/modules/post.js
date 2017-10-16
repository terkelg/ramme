let state = {
  post: {},
  comments: []
}

const getters = {
  getPost: state => {
    return state.post
  },
  getComments: state => {
    return state.comments
  }
}

const mutations = {
  UNSET_POST (post) {
    state.post = {}
  },
  SET_POST (state, post) {
    state.post = post
  },
  UNSET_POST_COMMENTS (comments) {
    state.comments = []
  },
  SET_POST_COMMENTS (state, comments) {
    state.comments = comments
  }
}

const actions = {
  setPost ({ dispatch }) {
    dispatch('SET_POST')
  },
  setComments ({ dispatch }) {
    dispatch('SET_POST_COMMENTS')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
