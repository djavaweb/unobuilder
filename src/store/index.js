import Vue from 'vue'
import Vuex from 'vuex'
import styles from './modules/styles'
import panels from './modules/panels'
import tools from './modules/tools'
import elements from './modules/elements'
import components from './modules/components'
import NodeUtils from './helpers/node-utils'
import { Labels } from '../const'

Vue.use(Vuex)

const snapshotPlugin = store => {

}

const actions = {
  /**
   * Undo Action
   */
  undo ({ dispatch }) {
    dispatch('undoElement')
  },

  /**
   * Redo Action
   */
  redo ({ dispatch }) {
    dispatch('redoElement')
  },

  /**
   * Hide all panels including popup, left panels selector, etc
   */
  hideAllPanels ({ dispatch }) {
    dispatch('hideLeftPanels')
    dispatch('toggleInputPanel', '')
  },

  setStyle ({ getters, dispatch }, payload) {
    const { mouseState = Labels.MOUSE_STATE_NONE, disabled = false, styles } = payload
    dispatch('setElementStyle', {
      global: false,
      screenSize: getters.screenSize,
      mouseState,
      disabled,
      styles
    })
  },

  /**
   * Do nothing
   */
  noop (store, event) {
    event.preventDefault()
  }
}

const getters = {
  /**
   * Selected element offset
   * @param {Object} state
   * @return {Object}
   */
  elementOffset (state, getter) {
    const NodeHelpers = new NodeUtils(state.elements)
    const getOffset = element => {
      const _element = NodeHelpers.getElementNodeById(element.id)

      if (!_element) {
        return {}
      }

      let { top, left, width, height } = _element.getBoundingClientRect() // eslint-disable-line prefer-const

      if (left < 0) {
        width += left
        left = 0
      }

      if (getter.canvasScroll.top) {
        top += Math.abs(getter.canvasScroll.top)
        left += Math.abs(getter.canvasScroll.left)
      }

      return { top, left, width, height }
    }

    let selected
    let hovered

    if (state.elements.selected) {
      selected = getOffset(state.elements.selected)
    }

    if (state.elements.hovered) {
      hovered = getOffset(state.elements.hovered)
      if ((state.components.dragging.status || state.elements.dragging.status) && state.elements.dropline.position.bottom) {
        const parent = NodeHelpers.getRealParent(state.elements.hovered.id)
        if (parent) {
          hovered = getOffset(parent)
        }
      }
    }

    return {
      selected,
      hovered
    }
  }
}

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    styles,
    panels,
    tools,
    elements,
    components
  },
  plugins: [snapshotPlugin]
})
