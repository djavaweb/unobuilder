import * as mutation from '../mutation-types'

const state = {
  prev: [],
  current: undefined,
  next: []
}

const mutations = {
  [mutation.ADD_HISTORY] (state, currentAction) {
    const { prev, current } = state
    if (current) {
      state.prev = [...prev, current]
    }

    state.current = currentAction
  },

  [mutation.UNDO_HISTORY] (state) {
    const { prev, current, next } = state

    if (prev.length > 0) {
      state.prev = prev.slice(0, prev.length - 1)
      state.current = prev[prev.length - 1]
      state.next = [current, ...next]
    }
  },

  [mutation.REDO_HISTORY] (state) {
    const { prev, current, next } = state

    if (next.length > 0) {
      state.prev = [...prev, current]
      state.current = next[0]
      state.next = next.slice(1)
    }
  }
}

const actions = {
  addHistory ({ commit }, currentAction) {
    commit(mutation.ADD_HISTORY, currentAction)
  },

  undoHistory ({ commit, state }) {
    if (state.prev.length > 0) {
      commit(mutation.UNDO_HISTORY)
    }
  },

  redoHistory ({ commit, state }) {
    if (state.next.length > 0) {
      commit(mutation.REDO_HISTORY)
    }
  }
}

const getters = {
  currentHistory (state) {
    return state.current
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
