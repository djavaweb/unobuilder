import Vue from 'vue'
import Vuex from 'vuex'
import styles from './modules/styles'
import panels from './modules/panels'
import tools from './modules/tools'
import elements from './modules/elements'
import components from './modules/components'

Vue.use(Vuex)

const snapshotPlugin = store => {
  store.subscribe((mutation, state) => {
    // console.log(state.elements)
  })
}

const actions = {
  /**
   * Undo Action
   */
  undo ({dispatch}) {
    dispatch('undoElement')
  },

  /**
   * Redo Action
   */
  redo ({dispatch}) {
    dispatch('redoElement')
  },

  /**
   * Hide all panels including popup, left panels selector, etc
   */
  hideAllPanels ({dispatch}) {
    dispatch('hideLeftPanels')
    dispatch('toggleInputPanel', '')
  },

  /**
   * Do nothing
   */
  noop (store, event) {
    event.preventDefault()
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
