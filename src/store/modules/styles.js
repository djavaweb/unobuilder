/* eslint-disable */
import { isEqual, set } from 'lodash'
import {
  MouseType,
  ScreenType,
  Labels
} from '../../const'
import * as utils from '../../utils'
import * as mutation from '../mutation-types'

const state = {
  customStyles: '',
  globalStyleActive: false,
  globalProperties: {
    current: {
      large: {},
      medium: {},
      small: {},
      tiny: {}
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

  [mutation.SET_GLOBAL_PROPERTY] (state, payload) {
    const { element, snapshot, screenSize, mouseState, disabled, styles } = payload

    const { kind } = element

    for (const key in styles) {
      const value = styles[key]
      const setTo = snapshot ? state.globalProperties.snapshot : state.globalProperties.current
      set(setTo, [screenSize, kind, mouseState, key], {
        disabled,
        value
      })
    }
  },

  /**
   * Save current state
   */
  [mutation.SNAPSHOT_GLOBAL_PROPERTY] (state) {
    state.globalProperties.snapshot = utils.CloneObject(state.globalProperties.current)
  },

  [mutation.APPLY_GLOBAL_PROPERTY] (state) {
    const { prev, current, snapshot } = state.globalProperties
    const snapshotObject = utils.CloneObject(snapshot)

    if (!isEqual(snapshotObject, current)) {
      state.globalProperties = Object.assign({}, state.globalProperties, {
        prev: [...prev, current],
        current: snapshotObject,
        snapshot: [],
        next: []
      })
    }
  },

  [mutation.UNDO_GLOBAL_PROPERTY] (state) {
    const { prev, current, next } = state.globalProperties

    if (prev.length > 0) {
      state.globalProperties = Object.assign({}, state.globalProperties, {
        prev: prev.slice(0, prev.length - 1),
        current: prev[prev.length - 1],
        next: [current, ...next]
      })
    }
  },

  [mutation.REDO_GLOBAL_PROPERTY] (state) {
    const { prev, current, next } = state.globalProperties

    if (next.length > 0) {
      state.globalProperties = Object.assign({}, state.globalProperties, {
        prev: [...prev, current],
        current: next[0],
        next: next.slice(1)
      })
    }
  },

  // [mutation.SET_PROPERTY] (state, { element, kind, properties }) {
  //   let cssObject = element.cssProperties[state.screenSize]

  //   if (state.globalStyleActive) {
  //     const globalClassName = utils.GlobalClassName(kind, '.')
  //     const globalStyleActive = state.globalStyleActive.snapshot[state.screenSize]

  //     if (!globalStyleActive[globalClassName]) {
  //       globalStyleActive[globalClassName] = {}
  //     }
  //     cssObject = globalStyleActive[globalClassName]
  //   }

  //   for (let key in properties) {
  //     let value = properties[key] || undefined
  //     cssObject[key] = value
  //   }
  // },

  // /**
  //  * Apply changes mutation
  //  * - Insert current state at the end of previous state.
  //  * - Set current element to the new state after handling the action.
  //  * - Clear the next state.
  //  */
  // [mutation.APPLY_PROPERTY] (state) {
  //   let { prev, current, snapshot } = state.globalStyleActive
  //   const snapshotObject = utils.CloneObject(snapshot)

  //   if (!isEqual(snapshotObject, current)) {
  //     state.globalStyleActive.prev = [...prev, current]
  //     state.globalStyleActive.current = snapshotObject
  //     state.globalStyleActive.snapshot = {}
  //     state.globalStyleActive.next = []
  //   }
  // },

  // /**
  //  * Save current state
  //  */
  // [mutation.SNAPSHOT_GLOBAL_PROPERTY] (state) {
  //   state.globalStyleActive.snapshot = utils.CloneObject(state.globalStyleActive.current)
  // },

  // /**
  //  * Rollback undo to the previous property
  //  */
  // [mutation.UNDO_GLOBAL_PROPERTY] (state) {
  //   const { prev, current, next } = state.globalStyleActive

  //   if (prev.length > 0) {
  //     state.globalStyleActive.prev = prev.slice(0, prev.length - 1)
  //     state.globalStyleActive.current = prev[prev.length - 1]
  //     state.globalStyleActive.next = [ current, ...next ]
  //   }
  // },

  // /**
  //  * Rollback redo to the future property
  //  */
  // [mutation.REDO_GLOBAL_PROPERTY] (state) {
  //   const { prev, current, next } = state.globalStyleActive

  //   if (next.length > 0) {
  //     state.globalStyleActive.prev = [ ...prev, current ]
  //     state.globalStyleActive.current = next[0]
  //     state.globalStyleActive.next = next.slice(1)
  //   }
  // },

  /**
   * Enable global property state
   */
  [mutation.ENABLE_GLOBAL_PROPERTY] (state) {
    state.globalStyleActive = true
  },

  /**
   * Disable global property state
   */
  [mutation.DISABLE_GLOBAL_PROPERTY] (state) {
    state.globalStyleActive = false
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
  setCustomStyles ({ commit }, value) {
    commit(mutation.SET_CUSTOM_STYLES, value)
  },

  setGlobalStyle ({ state, commit, dispatch, getters }, payload) {
    let object = Object.assign({
      element: undefined,
      mouseState: Labels.MOUSE_STATE_NONE,
      disabled: false,
      snapshot: true
    }, payload)

    if (!object.element && getters.selectedElement) {
      object.element = getters.selectedElement
    }

    if (object.snapshot) commit(mutation.SNAPSHOT_GLOBAL_PROPERTY)
    commit(mutation.SET_GLOBAL_PROPERTY, object)
    if (object.snapshot) commit(mutation.APPLY_GLOBAL_PROPERTY)
    dispatch('reselectElement')
  },

  undoGlobalStyle ({ commit, state }) {
    if (state.globalProperties.prev.length > 0) {
      commit(mutation.UNDO_GLOBAL_PROPERTY)
    }
  },

  redoGlobalStyle ({ commit, state }) {
    if (state.globalProperties.next.length > 0) {
      commit(mutation.REDO_GLOBAL_PROPERTY)
    }
  },

  // /**
  //  * Change property value
  //  *
  //  * @param Function { commit }
  //  * @param Object { rootState }
  //  * @param Object { state }
  //  * @param Object properties
  //  * @return void
  //  **/
  // setPropertyValue ({ commit, rootState, state }, properties) {
  //   const { elements } = rootState
  //   const { selected } = elements

  //   if (selected) {
  //     commit(mutation.SNAPSHOT_ELEMENT)
  //     commit(mutation.SNAPSHOT_GLOBAL_PROPERTY)
  //     const element = getElementObject(selected.id, elements.snapshot)
  //     const kind = element.kind
  //     commit(mutation.SET_PROPERTY, { element, kind, properties })
  //     commit(mutation.APPLY_PROPERTY)
  //     commit(mutation.APPLY_ELEMENT)

  //     // Force update getComputedStyle
  //     commit(mutation.SELECT_ELEMENT, element)
  //     setTimeout(() => {
  //       getElementNodeById(element.id).click()
  //     }, 1)
  //   }
  // },

  /**
   * Enable global property
   * @param  {Object} options.state
   * @return {void}
   */
  enableGlobalStyleActive ({ commit }) {
    commit(mutation.ENABLE_GLOBAL_PROPERTY)
  },

  /**
   * Disable global property
   * @param  {Object} options.state
   * @return {void}
   */
  disableGlobalStyleActive ({ commit }) {
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
  isGlobalStyleActive: state => state.globalStyleActive,

  globalStyles (state, getters) {
    const { selectedElement: selected, iframeWindow: window } = getters
    if (selected && window && getters.isGlobalStyleActive) {
      const element = window.document.querySelector(utils.SelectorId(selected.id))
      const { kind } = selected

      const nativeProps = {}

      const breakpointStore = getters.screenSize
      const properties = Object.assign({}, state.globalProperties.current)

      const getStyles = mousestateStore => {
        const breakpoint = Object.values(ScreenType)
        const mousestate = Object.values(MouseType)
        let breakpointIndex = breakpoint.indexOf(breakpointStore)
        let mousestateIndex = mousestate.indexOf(mousestateStore)
        let cssProperties = {}

        breakpointIndex = breakpoint.indexOf(breakpointStore)
        const currentScreensize = breakpoint[breakpointIndex]

        breakpointIndex = breakpoint.indexOf(breakpointStore)
        while (true) {
          const currentScreensize = breakpoint[breakpointIndex]
          mousestateIndex = mousestate.indexOf(mousestateStore)

          for (const keykind in properties[currentScreensize]) {
            if (keykind !== selected.kind) continue
            const keykind = selected.kind
            while (true) {
              const currentMouseState = mousestate[mousestateIndex]
              const currentProps = properties[currentScreensize][keykind][currentMouseState]
              for (const propName in currentProps) {
                const validProps = currentProps[propName].value && currentProps[propName].disabled !== true
                const inCssProperties = propName in cssProperties

                if (validProps && !inCssProperties) {
                  cssProperties[propName] = currentProps[propName].value
                }

              }

              if (mousestateIndex === 0) break
              if (mousestateIndex > 0 && mousestateIndex !== 1) {
                mousestateIndex = 0
              } else {
                mousestateIndex--
              }
            }
          }

          if (breakpointIndex === 0) break
          breakpointIndex--
        }

        cssProperties = Object.assign({}, cssProperties)
        return cssProperties
      }

      return {
        get none () {
          return getStyles(MouseType.NONE)
        },

        get hover () {
          return getStyles(MouseType.HOVER)
        },

        get active () {
          return getStyles(MouseType.ACTIVE)
        },

        get focus () {
          return getStyles(MouseType.FOCUS)
        }
      }
    }

    return {
      none: {},
      hover: {},
      active: {},
      focus: {}
    }
  },

  globalCSS (state) {
    const getStylesheets = elements => {
      let stylesheets = []

      for (const breakpoint in elements) {
        const selectors = elements[breakpoint]
        for (const s in selectors) {
          const selector = `.${ utils.GlobalClassName(s) }`
          const properties = selectors[s]

          if (Object.keys(properties).length > 0) {
            const data = {
              selector,
              breakpoint,
              properties
            }

            stylesheets.push(utils.CloneObject(data))
          }
        }

      }

      return stylesheets
    }
    return getStylesheets(state.globalProperties.current)
  }

  // /**
  //  * Global Properties
  //  * @param  {Object} state
  //  * @return {Object}
  //  */
  // globalProperties: state => state.globalStyleActive.current,

  // /**
  //  * Global properties active
  //  * @param  {Object} state
  //  * @return {Boolean}
  //  */
  // globalStyleActive: state => state.globalStyleActive,

  /**
   * Generate css properties from elements state
   * @param  {Object} state
   * @param  {Object} rootState
   * @return {Object}
   */
  // cssProperties (state, rootState) {
  //   if (rootState.selectedElement) {
  //     // return getElementStyle(rootState.selectedElement, state.globalStyleActive)
  //   }

  //   return {}
  // }

  // /**
  //  * Check whether property is inherited or has own style
  //  * @param  {[type]}  state [description]
  //  * @return {Boolean}       [description]
  //  */
  // cssInherited (state, rootState) {
  //   let cssProperties = {}

  //   utils.PropertyList.forEach(item => {
  //     cssProperties[item] = true
  //   })

  //   const { selectedElement, screenSize } = rootState
  //   if (selectedElement) {
  //     let cssObject = selectedElement.cssProperties[screenSize]
  //     const globalClassName = utils.GlobalClassName(selectedElement.kind, '.')

  //     if (state.globalStyleActive) {
  //       cssObject = state.globalStyleActive.current[screenSize]
  //     }

  //     for (let key in cssProperties) {
  //       if (state.globalStyleActive) {
  //         cssProperties[key] = cssObject[globalClassName] ? !cssObject[globalClassName][key] : true
  //       } else {
  //         cssProperties[key] = !(key in cssObject)
  //       }
  //     }
  //   }

  //   return cssProperties
  // },

  // /**
  //  * Generate individual elements' css
  //  * @param  {Object} state
  //  * @param  {Object} rootState
  //  * @return {Array}
  //  */
  // localCSS (state, rootState) {
  //   const getStylesheets = elements => {
  //     let stylesheets = []

  //     elements.filter(element => {
  //       return typeof element === 'string'
  //     }).forEach(element => {
  //       if (element.childNodes.length > 0) {
  //         stylesheets = stylesheets.concat(getStylesheets(element.childNodes))
  //       }

  //       const selector = utils.SelectorId(element.id)
  //       for (let breakpoint in element.cssProperties) {
  //         const properties = element.cssProperties[breakpoint]
  //         if (Object.keys(properties).length > 0) {
  //           stylesheets.push({
  //             selector,
  //             breakpoint,
  //             properties
  //           })
  //         }
  //       }
  //     })

  //     return stylesheets
  //   }

  //   return getStylesheets(rootState.elements)
  // },

  // /**
  //  * Generate global CSS
  //  * @param {Object} state
  //  * @return {Array}
  //  */
  // globalCSS (state) {
  //   const stylesheets = []
  //   for (let breakpoint in state.globalStyleActive.current) {
  //     for (let selector in state.globalStyleActive.current[breakpoint]) {
  //       const properties = state.globalStyleActive.current[breakpoint][selector]
  //       if (Object.keys(properties).length > 0) {
  //         stylesheets.push({
  //           selector,
  //           breakpoint,
  //           properties
  //         })
  //       }
  //     }
  //   }
  //   return stylesheets
  // },

  // /**
  //  * Check whether element is an item of flex element
  //  * @return {Boolean}
  //  */
  // isFlexItem (state, rootState) {
  //   if (rootState.selectedElement) {
  //     const parentElement = getParentElementObject(rootState.selectedElement.id, rootState.elements)
  //     if (parentElement) {
  //       const style = getStyle(parentElement, state.globalStyleActive)
  //       return style['display'] === 'flex'
  //     }
  //   }
  // }
}

export default {
  state,
  actions,
  getters,
  mutations
}
