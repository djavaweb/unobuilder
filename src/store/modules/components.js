import * as mutation from '../mutation-types'

const state = {
  components: [],
  dragging: false
}

const mutations = {
  [mutation.ADD_COMPONENT] (state, component) {
    state.components.push(component)
  },
  [mutation.TOGGLE_DRAG_COMPONENT] (state, status) {
    state.dragging = status === undefined
      ? !state.dragging
      : status
  }
}

const actions = {
  addComponent ({commit}, component) {
    commit(mutation.ADD_COMPONENT, component)
  },
  toggleDragComponent ({commit}, status) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, status)
  },
  enableDragComponent ({commit}) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, true)
  },
  disableDragComponent ({commit}) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, false)
  }
}

const getters = {
  searchComponentResults: state => {
    return state.components.filter(item => {
      return item
    })
  },
  componentDragging: state => {
    return state.dragging
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
