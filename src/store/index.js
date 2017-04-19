import Vue from 'vue'
import Vuex from 'vuex'
import styles from './modules/styles'
import panels from './modules/panels'
import tools from './modules/tools'
import elements from './modules/elements'
import components from './modules/components'
import history from './modules/history'
import NodeUtils from './helpers/node-utils'
import * as mutation from './mutation-types'

Vue.use(Vuex)

const snapshotPlugin = (store) => {
  const { dispatch } = store
  store.subscribe((mutations, state) => {
    const { type, payload } = mutations
    if (typeof mutations.payload === 'object') {
      const { snapshot = true } = payload
      if (snapshot) {
        switch (type) {
          case mutation.ADD_ELEMENT:
          case mutation.SET_ELEMENT_STYLE:
            dispatch('addHistory', 'ELEMENT')
            break

          case mutation.SET_GLOBAL_PROPERTY:
            dispatch('addHistory', 'GLOBAL')
            break
        }
      }
    }
  })
}

const actions = {

  /**
   * Undo Action
   */
  undo ({ dispatch, getters }) {
    const { currentHistory } = getters
    switch (currentHistory) {
      case 'ELEMENT':
        dispatch('undoElement')
        break

      case 'GLOBAL':
        dispatch('undoGlobalStyle')
        break
    }

    dispatch('undoHistory')
  },

  /**
   * Redo Action
   */
  redo ({ dispatch, getters }) {
    const { currentHistory } = getters
    switch (currentHistory) {
      case 'ELEMENT':
        dispatch('redoElement')
        break

      case 'GLOBAL':
        dispatch('redoGlobalStyle')
        break
    }

    dispatch('redoHistory')
  },

  /**
   * Hide all panels including popup, left panels selector, etc
   */
  hideAllPanels ({ dispatch }) {
    dispatch('hideLeftPanels')
    dispatch('toggleInputPanel', '')
  },

  setStyle ({ getters, dispatch }, { mouseState, styles = {}, element, snapshot }) {
    let defaultAction = 'setElementStyle'
    if (getters.isGlobalStyleActive) {
      defaultAction = 'setGlobalStyle'
    }

    return dispatch(defaultAction, {
      mouseState,
      screenSize: getters.screenSize,
      element,
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
  },

  styles (state, getters) {
    if (!getters.isGlobalStyleActive) {
      return getters.elementStyles
    }

    return getters.globalStyles
  }
}

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    styles,
    panels,
    history,
    tools,
    elements,
    components
  },
  plugins: [snapshotPlugin]
})
