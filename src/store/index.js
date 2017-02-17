import Vue from 'vue'
import Vuex from 'vuex'
import styles from './modules/styles'
import panels from './modules/panels'
import tools from './modules/tools'
import elements from './modules/elements'
import components from './modules/components'
import * as mutation from './mutation-types'

Vue.use(Vuex)

const snapshotPlugin = store => {
  store.subscribe((mutation, state) => {
    // console.log(state.elements)
  })
}

const actions = {
  /**
   * Undo Action
   * @param  {Function} store.commit
   * @return {void}
   */
  undo ({ commit }) {
    commit(mutation.UNDO_ELEMENT)
  },

  /**
   * Redo Action
   * @param  {Function} store.commit
   * @return {void}
   */
  redo ({ commit }) {
    commit(mutation.REDO_ELEMENT)
  },

  /**
   * Hide all panels including popup, left panels selector, etc
   * @param  {Function} store.commit
   */
  hideAllPanels ({commit}) {
    commit(mutation.HIDE_LEFT_PANELS)
    commit(mutation.TOGGLE_INPUT_PANEL, '')
  }
}

export default new Vuex.Store({
  actions,
  modules: {
    styles,
    panels,
    tools,
    elements,
    components
  },
  plugins: [snapshotPlugin]
})
