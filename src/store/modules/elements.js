/* eslint-disable no-unused-vars */
import * as mutation from '../mutation-types'
import * as utils from '../../utils'
import {VoidElements, NestedableRules, MoveAction} from '../../const'
import {isEqual} from 'lodash'

const state = {
  prev: [],
  current: [],
  snapshot: [],
  next: [],
  window: undefined,
  selected: null,
  hovered: null,
  openBreadcrumbs: false,
  move: {}
}

const getElementObject = (id, elements) => {
  elements = !elements ? state.current : elements
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].childNodes && elements[i].childNodes.length > 0) {
      const elementObject = getElementObject(id, elements[i].childNodes)
      if (elementObject) {
        return elementObject
      }
    }

    if (elements[i].id === id) {
      return elements[i]
    }
  }
}

const getElementNodeById = id => {
  if (state.window) {
    return state.window.document.querySelector(utils.SelectorId(id))
  }
}

const getElementObjectByNode = (element, elements) => {
  return getElementObject(utils.GetNodeId(element), elements)
}

const getParentElement = id => {
  const element = getElementNodeById(id)
  if (element) {
    return utils.GetNodeId(element.parentElement) ? element.parentElement : undefined
  }
}

const getParentElementObject = (id, elements) => {
  const parentElement = getParentElement(id)
  if (parentElement) {
    return getElementObjectByNode(parentElement, elements)
  }
}

const getRequiredParentElement = (id, elements) => {
  const parentElementObject = getParentElementObject(id, elements)
  if (parentElementObject && parentElementObject.requiredParent) {
    return parentElementObject
  }
}

const getLinkElementObject = (linkNode, elements) => {
  if (linkNode.tagName.toLowerCase() === 'a') {
    return getElementObject(utils.GetNodeId(linkNode), elements)
  }
}

const isRow = element => {
  return element && element.classList.contains(utils.GlobalClassName('row'))
}

const isVoidElementById = id => {
  const element = getElementNodeById(id)
  if (element) {
    return VoidElements.includes(element.tagName.toLowerCase())
  }
}

const isNestedablePair = (fromKind, toKind) => {
  return NestedableRules[toKind].includes(fromKind)
}

const getBreadcrumbById = (id, elements) => {
  const elementObject = getElementObject(id, elements)
  if (elementObject) {
    const { id, label } = elementObject
    return { id, label }
  }
}

const insertChildNodesByIndex = (object, insertObject, index) => {
  index = index === undefined ? object.childNodes.length : index
  object.childNodes.splice(index, 0, insertObject)
}

const getStyle = (elementObject, isGlobal) => {
  const element = getElementNodeById(elementObject.id)
  let properties = state.window.getComputedStyle(element)

  if (isGlobal) {
    const tmpElement = element.cloneNode(true)
    tmpElement.removeAttribute(utils.SelectorAttrId)

    if (tmpElement.hasChildNodes()) {
      tmpElement.childNodes.forEach(el => el.remove())
    }

    state.window.document.body.appendChild(tmpElement)
    properties = state.window.getComputedStyle(tmpElement)
    setTimeout(() => tmpElement.remove(), 1)
  }

  return properties
}

const setSursorPosition = atStart => el => {
  const hasFeature = {
    getSelection: typeof state.window.getSelection !== 'undefined',
    createRange: typeof state.window.document.createRange !== 'undefined',
    createTextRange: typeof state.window.document.body.createTextRange !== 'undefined'
  }

  if (hasFeature.getSelection && hasFeature.createRange) {
    const range = state.window.document.createRange()
    const sel = state.window.getSelection()
    range.selectNodeContents(el)
    range.collapse(atStart)
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (hasFeature.createTextRange) {
    const textRange = state.window.document.body.createTextRange()
    textRange.moveToElementText(el)
    textRange.collapse(atStart)
    textRange.select()
  }

  el.focus()
}

const mutations = {
  /**
   * Set owner document of builder
   */
  [mutation.SET_OWNER_WINDOW] (state, win) {
    state.window = win
  },

  /**
   * Apply changes mutation
   * - Insert current state at the end of previous state.
   * - Set current element to the new state after handling the action.
   * - Clear the next state.
   */
  [mutation.APPLY_ELEMENT] (state) {
    let { prev, current, snapshot } = state
    const snapshotObject = utils.CloneObject(snapshot)

    if (!isEqual(snapshotObject, current)) {
      state.prev = [...prev, current]
      state.current = snapshotObject
      state.snapshot = []
      state.next = []
    }
  },

  /**
   * Undo Mutation
   * - Remove the last element from the previous state.
   * - Set current element to the element we removed in the previous step.
   * - Insert the old current state at the beginning of the next state.
   */
  [mutation.UNDO_ELEMENT] (state) {
    const { prev, current, next } = state

    if (prev.length > 0) {
      state.prev = prev.slice(0, prev.length - 1)
      state.current = prev[prev.length - 1]
      state.next = [ current, ...next ]

      if (state.selected && state.selected.id === state.current.id) {
        state.selected = state.current
      } else {
        state.selected = null
      }
    }
  },

  /**
   * Redo Mutation
   * - Remove the first element from the next state.
   * - Set current element to the element we removed in the previous step.
   * - Insert the old current state at the end of the prev state.
   */
  [mutation.REDO_ELEMENT] (state) {
    const { prev, current, next } = state

    if (next.length > 0) {
      state.prev = [ ...prev, current ]
      state.current = next[0]
      state.next = next.slice(1)

      if (state.selected && state.selected.id === state.current.id) {
        state.selected = state.current
      } else {
        state.selected = null
      }
    }
  },

  /**
   * Save current state
   */
  [mutation.SNAPSHOT_ELEMENT] (state) {
    state.snapshot = utils.CloneObject(state.current)
  },

  /**
   * Add element to current state
   */
  [mutation.ADD_ELEMENT] (state, { markupText, appendTo, index }) {
    const element = utils.MarkupToObject(markupText)
    if (element) {
      if (!appendTo) {
        index = !index ? state.snapshot.length : index
        state.snapshot.splice(index, 0, element)
      } else {
        const appendEl = getElementObject(appendTo, state.snapshot)
        index = !index ? appendEl.childNodes.length : index
        appendEl.childNodes.splice(index, 0, element)
      }
    }
  },

  /**
   * Remove current element state by id
   */
  [mutation.REMOVE_ELEMENT] (state, id) {
    const parentElement = getParentElementObject(id, state.snapshot)
    id = (parentElement && parentElement.requiredParent) ? parentElement.id : id

    const removeElement = (elements) => {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].childNodes && elements[i].childNodes.length > 0) {
          removeElement(elements[i].childNodes)
        }

        if (elements[i].id === id) {
          elements.splice(i, 1)
        }
      }
    }
    removeElement(state.snapshot)
  },

  /**
   * Set selected element
   */
  [mutation.SELECT_ELEMENT] (state, {element, selected}) {
    element.selected = selected
    state.selected = element
  },

  /**
   * Move element (save cut and copy element state)
   */
  [mutation.MOVE_ELEMENT] (state, payload) {
    state.move = payload
  },

  /**
   * Paste element
   */
  [mutation.DROP_ELEMENT] (state, payload) {
    let dropElement = payload && payload.id
     ? getElementObject(payload.id, state.snapshot)
     : state.snapshot

    if (!dropElement || !state.move.element) return

    let index = payload && payload.index ? payload.index : 0
    let srcElement = utils.CloneObject(state.move.element)
    srcElement = utils.ChangeIdDeep(srcElement)

    if (payload && payload.id) {
      const notVoidElement = !isVoidElementById(dropElement.id)
      const canNested = isNestedablePair(srcElement.kind, dropElement.kind)
      if (notVoidElement && canNested) {
        insertChildNodesByIndex(dropElement, srcElement, index)
      }
    } else {
      index = index === 0 ? dropElement.length : index
      dropElement.splice(index, 0, srcElement)
    }
  },

  /**
   * Enable or disable editable content
   */
  [mutation.EDIT_CONTENT] (state, editableNode) {
    const element = getElementObjectByNode(editableNode, state.snapshot)
    if (element && element.editable) {
      element.dataObject.attrs.contenteditable = true
      setTimeout(() => setSursorPosition(false)(editableNode), 0)
    }
  },

  /**
   * Toggle breadcrumbs in element selector tools
   */
  [mutation.TOGGLE_BREADCRUMB] (state, toggle) {
    toggle = typeof toggle === 'undefined' ? !state.openBreadcrumbs : toggle
    state.openBreadcrumbs = toggle
  }
}

const actions = {
  /**
   * Set owner window
   */
  setOwnerWindow ({commit}, win) {
    commit(mutation.SET_OWNER_WINDOW, win)
  },

  /**
   * Add Element to the current state
   * @param {Function} store.commit
   * @param {String} options.markupText
   * @param {String} options.appendTo
   * @return {void}
   */
  addElement ({commit}, options) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.ADD_ELEMENT, options)
    commit(mutation.APPLY_ELEMENT)
  },

  /**
   * Remove Element
   * @param  {Function} store.commit
   * @param  {String} id
   * @return {void}
   */
  removeElement ({commit}, id) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.REMOVE_ELEMENT, id)
    commit(mutation.APPLY_ELEMENT)
  },

  /**
   * Copy and Cut actions
   * @param  {Function} options.commit
   * @param  {Function} options.state
   * @param  {String} options.action
   * @param  {String} options.id
   * @return {void}
   */
  moveElement ({commit, state}, {action, id}) {
    commit(mutation.SNAPSHOT_ELEMENT)
    const srcElement = getRequiredParentElement(id, state.snapshot) || getElementObject(id, state.snapshot)

    if (srcElement) {
      commit(mutation.MOVE_ELEMENT, {
        action,
        element: utils.CloneObject(srcElement)
      })

      if (action === MoveAction.CUT) {
        commit(mutation.REMOVE_ELEMENT, id)
      }

      commit(mutation.APPLY_ELEMENT)
    }
  },

  /**
   * Drop element to another element with given index
   * @param  {Function} options.commit
   * @param  {Object} options
   * @return {void}
   */
  dropElement ({commit}, options) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.DROP_ELEMENT, options)
    commit(mutation.APPLY_ELEMENT)
  },

  /**
   * Select element by ID
   * @param  {Function} options.commit
   * @param  {Object}   options.state
   * @param  {String}   id
   * @return {void}
   */
  selectElement ({commit, state}, id) {
    if (!id && state.selected) {
      id = state.selected.id
    }

    if (id.tagName) {
      id = utils.GetNodeId(id)
    }

    // It has been selected before
    let {selected: element} = state
    if (element) {
      commit(mutation.SELECT_ELEMENT, {
        element,
        selected: false
      })
    }

    // Reselect element
    element = getElementObject(id)
    if (element) {
      commit(mutation.SELECT_ELEMENT, {
        element,
        selected: true
      })
    }

    // Hide all breadcrumbs again
    commit(mutation.TOGGLE_BREADCRUMB, false)

    // const element

    // if (state.selected) {
    //   // this.$set(this.selectedElement, 'selected', false)
    //   // if (this.selectedElement.dataObject.attrs.contenteditable) {
    //   //   const prevElementNode = node.GetElementNodeById(this.selectedElement.id, this.elements)

    //   //   if (prevElementNode.innerHTML.length > 0) {
    //   //     this.$set(this.selectedElement.dataObject.domProps, 'innerHTML', prevElementNode.innerHTML)
    //   //   } else {
    //   //     this.removeElement(this.selectedElement.id)
    //   //   }

    //   //   if (this.selectedElement.id !== id) {
    //   //     this.setContentEditable(false)
    //   //   }
    //   // }
    //   commit(mutation.SELECT_ELEMENT, {element: state.selected, selected: false})

    //   // if (state.selected.dataObject.attrs.contenteditable) {
    //   //   commit(mutation.SNAPSHOT_ELEMENT)

    //   //   const prevElement = getElementNodeById(state.selected.id, state.current)
    //   //   if (prevElement.innerHTML.length > 0) {
    //   //     console.log('bbaba')
    //   //   } else {
    //   //     commit(mutation.REMOVE_ELEMENT, state.selected.id)
    //   //   }

    //   //   commit(mutation.APPLY_ELEMENT)
    //   // }
    // }

    // if (element) {
    //   commit(mutation.SELECT_ELEMENT, {element, selected: true})
    // }
  },

  editContent ({commit}, element) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.EDIT_CONTENT, element)
    commit(mutation.APPLY_ELEMENT)
    // if (state.selected) {

    //   const element = node.GetElementObject(state.selected.id, state.current)
    //   if (enable) {
    //     element.dataObject.attrs.contenteditable = true
    //   }

    //   // if (enable) {
    //   //   this.$set(state.selected.dataObject.attrs, CONTENT_EDITABLE_ATTR, true)
    //   //   setTimeout(() => node.SetSursorPosition(false)(element), 0)
    //   // } else {
    //   //   this.$delete(state.selectedElement.dataObject.attrs, CONTENT_EDITABLE_ATTR)
    //   //   element.removeAttribute(CONTENT_EDITABLE_ATTR)
    //   // }
    // }
  },

  toggleBreadcrumbs ({commit}) {
    commit(mutation.TOGGLE_BREADCRUMB)
  },

  showBreadcrumbs ({commit}) {
    commit(mutation.TOGGLE_BREADCRUMB, true)
  },

  hideBreadcrumbs ({commit}) {
    commit(mutation.TOGGLE_BREADCRUMB, false)
  },

  refreshScroll ({state}) {
    if (state.window) {
      const {window} = state
      window.scrollTo(window.scrollX, window.scrollY + 1)
      window.scrollTo(window.scrollX, 0)
    }
  }
}

const getters = {
  /**
   * Element list
   * @param  {Object} state
   * @return {Object}
   */
  elements: state => state.current,

  /**
   * Selected Element
   * @param  {Object} state
   * @return {Object}
   */
  selectedElement: state => state.selected,

  /**
   * Selected element offset
   * @param {Object} state
   * @return {Object}
   */
  selectedOffset (state, rootState) {
    const styles = {}

    if (state.selected) {
      const elementNode = getElementNodeById(state.selected.id)
      if (elementNode) {
        const {canvasScroll} = rootState
        const bounds = elementNode.getBoundingClientRect()
        const pos = {
          top: bounds.top,
          left: bounds.left
        }

        if (canvasScroll.top) {
          pos.top += Math.abs(canvasScroll.top)
          pos.left += Math.abs(canvasScroll.left)
        }

        styles.top = `${pos.top}px`
        styles.left = `${pos.left}px`
        styles.height = `${bounds.height}px`
        styles.width = `${bounds.width}px`
      }
    }

    return styles
  },

  /**
   * Breadcrumbs
   * @return {Array}
   */
  breadcrumbs (state) {
    const breadcrumbs = []

    if (state.selected) {
      // Get current breacrumb
      let {id, label} = state.selected
      breadcrumbs.push({ id, label })

      // Get parent breadcrumb
      const parent = getParentElementObject(id, state.current)
      if (parent) {
        breadcrumbs.push({ id: parent.id, label: parent.label })
      }

      // Get grandparent
      const grandParent = parent ? getParentElementObject(parent.id, state.current) : null
      if (grandParent) {
        breadcrumbs.push({ id: grandParent.id, label: grandParent.label })
      }
    }

    return breadcrumbs.reverse()
  },

  /**
   * Open breadcrumbs in selector elements
   */
  openBreadcrumbs: state => state.openBreadcrumbs,

  /**
   * Check wheter selected element is void element
   * @param  {Object}  state
   * @return {Boolean}
   */
  isVoidElement (state) {
    if (state.selected) {
      return isVoidElementById(state.selected.id)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
