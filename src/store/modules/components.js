import * as mutation from '../mutation-types'

const state = {
  components: [],
  active: null,
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
  },
  [mutation.SET_ACTIVE_COMPONENT] (state, id) {
    state.active = id
  },
  [mutation.CLEAR_ACTIVE_COMPONENT] (state, id) {
    state.active = null
  }
}

const actions = {
  addComponent ({commit}, component) {
    commit(mutation.ADD_COMPONENT, component)
  },
  toggleDragComponent ({commit}, status) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, status)
  },
  enableDragComponent ({commit}, id) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, true)
    commit(mutation.SET_ACTIVE_COMPONENT, id)
  },
  disableDragComponent ({commit}) {
    commit(mutation.TOGGLE_DRAG_COMPONENT, false)
    commit(mutation.CLEAR_ACTIVE_COMPONENT)
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
  },
  componentActive: state => {
    return state.active
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
