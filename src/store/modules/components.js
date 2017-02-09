import * as mutation from '../mutation-types'

const state = {
  components: []
}

const mutations = {
  [mutation.ADD_COMPONENT] (state, component) {
    state.components.push(component)
  }
}

const actions = {
  addComponent ({commit}, component) {
    commit(mutation.ADD_COMPONENT, component)
  }
}

const getters = {
  searchComponentResults: state => {
    return state.components.filter(item => {
      return item
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
