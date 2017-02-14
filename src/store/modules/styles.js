import {CloneObject, GlobalClassName, SelectorId} from '../../utils/common'
import {PropertyList} from '../../const'
import * as node from '../../utils/node-element'
import * as mutation from '../mutation-types'
import {isEqual, isString} from 'lodash'

const state = {
  customStyles: '',
  globalProperty: {
    active: false,
    current: {
      xlarge: {},
      large: {},
      medium: {},
      small: {}
    },
    snapshot: {},
    prev: [],
    next: []
  }
}

const mutations = {
  /**
   * Change css editor value
   * @param Object state
   * @return void
   */
  [mutation.SET_CUSTOM_STYLES] (state, value) {
    state.customStyles = value
  },

  [mutation.SET_PROPERTY] (state, {element, kind, properties}) {
    let cssObject = element.cssProperties[state.screenSize]

    if (state.globalProperty.active) {
      const globalClassName = GlobalClassName(kind, '.')
      const globalProperty = state.globalProperty.snapshot[state.screenSize]

      if (!globalProperty[globalClassName]) {
        globalProperty[globalClassName] = {}
      }
      cssObject = globalProperty[globalClassName]
    }

    for (let key in properties) {
      let value = properties[key] || undefined
      cssObject[key] = value
    }
  },

  /**
   * Apply changes mutation
   * - Insert current state at the end of previous state.
   * - Set current element to the new state after handling the action.
   * - Clear the next state.
   */
  [mutation.APPLY_PROPERTY] (state) {
    let { prev, current, snapshot } = state.globalProperty
    const snapshotObject = CloneObject(snapshot)

    if (!isEqual(snapshotObject, current)) {
      state.globalProperty.prev = [...prev, current]
      state.globalProperty.current = snapshotObject
      state.globalProperty.snapshot = {}
      state.globalProperty.next = []
    }
  },

  /**
   * Save current state
   */
  [mutation.SNAPSHOT_GLOBAL_PROPERTY] (state) {
    state.globalProperty.snapshot = CloneObject(state.globalProperty.current)
  },

  /**
   * Rollback undo to the previous property
   */
  [mutation.UNDO_GLOBAL_PROPERTY] (state) {
    const { prev, current, next } = state.globalProperty

    if (prev.length > 0) {
      state.globalProperty.prev = prev.slice(0, prev.length - 1)
      state.globalProperty.current = prev[prev.length - 1]
      state.globalProperty.next = [ current, ...next ]
    }
  },

  /**
   * Rollback redo to the future property
   */
  [mutation.REDO_GLOBAL_PROPERTY] (state) {
    const { prev, current, next } = state.globalProperty

    if (next.length > 0) {
      state.globalProperty.prev = [ ...prev, current ]
      state.globalProperty.current = next[0]
      state.globalProperty.next = next.slice(1)
    }
  },

  /**
   * Enable global property state
   */
  [mutation.ENABLE_GLOBAL_PROPERTY] (state) {
    state.globalProperty.active = true
  },

  /**
   * Disable global property state
   */
  [mutation.DISABLE_GLOBAL_PROPERTY] (state) {
    state.globalProperty.active = false
  }
}

const actions = {
  /**
   * Change custom styles
   *
   * @param Function commit
   * @param String value
   * @return void
   */
  setCustomStyles ({commit}, value) {
    commit(mutation.SET_CUSTOM_STYLES, value)
  },

  /**
   * Change property value
   *
   * @param Function {commit}
   * @param Object {rootState}
   * @param Object {state}
   * @param Object properties
   * @return void
   **/
  setPropertyValue ({commit, rootState, state}, properties) {
    const { elements } = rootState
    const { selected } = elements

    if (selected) {
      commit(mutation.SNAPSHOT_ELEMENT)
      commit(mutation.SNAPSHOT_GLOBAL_PROPERTY)
      const element = node.GetElementObject(selected.id, elements.snapshot)
      const kind = element.kind
      commit(mutation.SET_PROPERTY, { element, kind, properties })
      commit(mutation.APPLY_PROPERTY)
      commit(mutation.APPLY_ELEMENT)

      // Force update getComputedStyle
      commit(mutation.SELECT_ELEMENT, element)
      setTimeout(() => {
        node.GetElementNodeById(element.id).click()
      }, 1)
    }
  },

  /**
   * Enable global property
   * @param  {Object} options.state
   * @return {void}
   */
  enableGlobalProperty ({commit}) {
    commit(mutation.ENABLE_GLOBAL_PROPERTY)
  },

  /**
   * Disable global property
   * @param  {Object} options.state
   * @return {void}
   */
  disableGlobalProperty ({commit}) {
    commit(mutation.DISABLE_GLOBAL_PROPERTY)
  }
}

const getters = {
  /**
   * Custom CSS
   * @param  {Object} state
   * @return {String}
   */
  customStyles: state => state.customStyles,

  /**
   * Global Properties
   * @param  {Object} state
   * @return {Object}
   */
  globalProperties: state => state.globalProperty.current,

  /**
   * Global properties active
   * @param  {Object} state
   * @return {Boolean}
   */
  globalPropertyActive: state => state.globalProperty.active,

  /**
   * Generate css properties from elements state
   * @param  {Object} state
   * @param  {Object} rootState
   * @return {Object}
   */
  cssProperties (state, rootState) {
    if (rootState.selectedElement) {
      return node.GetStyle(rootState.selectedElement, state.globalProperty.active)
    }

    return {}
  },

  /**
   * Check whether property is inherited or has own style
   * @param  {[type]}  state [description]
   * @return {Boolean}       [description]
   */
  cssInherited (state, rootState) {
    let cssProperties = {}

    PropertyList.forEach(item => {
      cssProperties[item] = true
    })

    const {selectedElement, screenSize} = rootState
    if (selectedElement) {
      let cssObject = selectedElement.cssProperties[screenSize]
      const globalClassName = GlobalClassName(selectedElement.kind, '.')

      if (state.globalProperty.active) {
        cssObject = state.globalProperty.current[screenSize]
      }

      for (let key in cssProperties) {
        if (state.globalProperty.active) {
          cssProperties[key] = cssObject[globalClassName] ? !cssObject[globalClassName][key] : true
        } else {
          cssProperties[key] = !(key in cssObject)
        }
      }
    }

    return cssProperties
  },

  /**
   * Generate individual elements' css
   * @param  {Object} state
   * @param  {Object} rootState
   * @return {Array}
   */
  localCSS (state, rootState) {
    const getStylesheets = elements => {
      let stylesheets = []

      elements.forEach(element => {
        if (!isString(element)) {
          if (element.childNodes.length > 0) {
            stylesheets = stylesheets.concat(getStylesheets(element.childNodes))
          }

          const selector = SelectorId(element.id)
          for (let breakpoint in element.cssProperties) {
            const properties = element.cssProperties[breakpoint]
            if (Object.keys(properties).length > 0) {
              stylesheets.push({
                selector,
                breakpoint,
                properties
              })
            }
          }
        }
      })
      return stylesheets
    }

    return getStylesheets(rootState.elements)
  },

  /**
   * Generate global CSS
   * @param {Object} state
   * @return {Array}
   */
  globalCSS (state) {
    const stylesheets = []
    for (let breakpoint in state.globalProperty.current) {
      for (let selector in state.globalProperty.current[breakpoint]) {
        const properties = state.globalProperty.current[breakpoint][selector]
        if (Object.keys(properties).length > 0) {
          stylesheets.push({
            selector,
            breakpoint,
            properties
          })
        }
      }
    }
    return stylesheets
  },

  /**
   * Check whether element is an item of flex element
   * @return {Boolean}
   */
  isFlexItem (state, rootState) {
    if (rootState.selectedElement) {
      const parentElement = node.GetParentElementObject(rootState.selectedElement.id, rootState.elements)
      if (parentElement) {
        const style = node.GetStyle(parentElement, state.globalProperty.active)
        return style['display'] === 'flex'
      }
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
