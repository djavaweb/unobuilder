/* eslint-disable no-unused-vars */
import Uno from 'uno'
import * as mutation from '../mutation-types'
import * as utils from '../../utils'
import {RootElementTag, VoidElements, NestedableRules, MoveAction} from '../../const'
import {isEqual} from 'lodash'

const state = {
  prev: [],
  current: [],
  snapshot: [],
  next: [],
  move: {},
  window: undefined,
  selected: null,
  hovered: null,
  lastInserted: null,
  openBreadcrumbs: false,
  dragging: {
    status: false,
    activeId: null
  }
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
    return utils.GetNodeId(element.parentElement)
      ? element.parentElement
      : undefined
  }
}

const getIndexFromParent = id => {
  const parentElement = getParentElement(id)
  for (let i = 0; i < parentElement.childNodes.length; i++) {
    const _id = utils.GetNodeId(parentElement.childNodes[i])
    if (_id === id) {
      return i
    }
  }

  return 0
}

const getRootElement = id => {
  const element = getElementNodeById(id)

  if (!element) {
    return
  }

  if (element.getAttribute(RootElementTag)) {
    return element
  }

  const parentElement = getParentElement(id)
  if (parentElement && parentElement.getAttribute(RootElementTag)) {
    return element
  } else {
    return getRootElement(utils.GetNodeId(parentElement))
  }
}

const getPrevElement = id => {
  const element = getElementNodeById(id)
  if (element) {
    return utils.GetNodeId(element.previousElementSibling)
      ? element.previousElementSibling
      : undefined
  }
}

const getNextElement = id => {
  const element = getElementNodeById(id)
  if (element) {
    return utils.GetNodeId(element.nextElementSibling)
      ? element.nextElementSibling
      : undefined
  }
}

const getParentElementObject = (id, elements) => {
  const parentElement = getParentElement(id)
  if (parentElement) {
    return getElementObjectByNode(parentElement, elements)
  }
}

const getPrevElementObject = (id, elements) => {
  const prevElement = getPrevElement(id)
  if (prevElement) {
    return getElementObjectByNode(prevElement, elements)
  }
}

const getNextElementObject = (id, elements) => {
  const nextElement = getNextElement(id)
  if (nextElement) {
    return getElementObjectByNode(nextElement, elements)
  }
}

const getSiblingElement = (id, elements) => {
  let element = getParentElementObject(id, elements)
  const prevElement = getPrevElementObject(id, elements)
  const nextElement = getNextElementObject(id, elements)

  if (nextElement) {
    element = nextElement
  } else if (prevElement) {
    element = prevElement
  }

  return element
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
  const rule = NestedableRules[toKind]
  return rule !== '*' ? rule.includes(fromKind) : true
}

const getBreadcrumbById = (id, elements) => {
  const elementObject = getElementObject(id, elements)
  if (elementObject) {
    const { id, label } = elementObject
    return { id, label }
  }
}

const deleteNodeById = (id, elements) => {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].childNodes && elements[i].childNodes.length > 0) {
      deleteNodeById(id, elements[i].childNodes)
    }

    if (elements[i].id === id) {
      elements.splice(i, 1)
    }
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

const setCursorPosition = atStart => el => {
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
      state.next = [current, ...next]
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
  [mutation.ADD_ELEMENT] (state, { object, appendTo, index = 0 }) {
    let element = object

    // recursively change node id
    const recursive = obj => {
      let id = utils.RandomUID()
      obj.id = id
      obj.dataObject.attrs[utils.SelectorAttrId] = id
      obj.dataObject.ref = id.replace(/-/g, '')

      let classes = {}

      if (obj[utils.attrType.KIND].length > 0) {
        const value = obj[utils.attrType.KIND]
        classes[utils.GlobalClassName(value)] = true
        if (value === 'row') {
          obj.dataObject.domProps['gutter'] = {}
        }
      }

      const snapshotClass = Object.assign({}, obj.dataObject.class)
      obj.dataObject.class = Object.assign(snapshotClass, classes)

      if (obj.childNodes.length > 0) {
        for (let i = 0; i < obj.childNodes.length; i++) {
          recursive(obj.childNodes[i])
        }
      }

      return obj
    }

    element = recursive(element)
    if (element) {
      state.lastInserted = element.id

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
    deleteNodeById(id, state.snapshot)
  },

  /**
   * Set selected element
   */
  [mutation.SELECT_ELEMENT] (state, {element, selected}) {
    element.selected = selected
    state.selected = element
  },

  /**
   * Set selected element
   */
  [mutation.HOVER_ELEMENT] (state, element) {
    state.hovered = element
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
  [mutation.DROP_ELEMENT] (state, element) {
    if (element.parent) {
      const parent = getParentElementObject(element.parent, state.snapshot)
      element.id = parent.id
    }

    let dropElement = element && element.id
     ? getElementObject(element.id, state.snapshot)
     : state.snapshot

    if (!dropElement || !state.move.element) return

    let index = element && element.index ? element.index : 0
    let srcElement = utils.CloneObject(state.move.element)
    srcElement = utils.ChangeIdDeep(srcElement)

    if (element && element.id) {
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
      setTimeout(() => setCursorPosition(false)(editableNode), 0)
    }
  },

  /**
   * Toggle breadcrumbs in element selector tools
   */
  [mutation.TOGGLE_BREADCRUMB] (state, toggle) {
    toggle = typeof toggle === 'undefined' ? !state.openBreadcrumbs : toggle
    state.openBreadcrumbs = toggle
  },

  /**
   * Set window scroll Y value
   */
  [mutation.SET_WINDOW_SCROLL] (state, value) {
    if (state.window) {
      if (typeof value === 'string') {
        let [operator, intvalue] = value.split('')
        intvalue = parseInt(intvalue)

        switch (operator) {
          case '+':
            value = state.window.scrollY + intvalue
            break

          case '-':
            value = state.window.scrollY - intvalue
            break
        }
      }

      state.window.scrollTo(state.window.scrollX, value)
    }
  },

  [mutation.TOGGLE_DRAG_ELEMENT] (state, status) {
    state.dragging.status = status === undefined
      ? !state.dragging.status
      : status
  },
  [mutation.SET_ACTIVE_ELEMENT] (state, id) {
    state.dragging.activeId = id
  },
  [mutation.CLEAR_ACTIVE_ELEMENT] (state, id) {
    state.dragging.activeId = null
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
   * Undo Action
   * @param  {Function} store.commit
   * @return {void}
   */
  undoElement ({commit, state}) {
    if (state.prev.length > 1) {
      commit(mutation.UNDO_ELEMENT)

      // Select root element
      commit(mutation.SET_WINDOW_SCROLL, '+1')
      commit(mutation.HOVER_ELEMENT, null)
      commit(mutation.SELECT_ELEMENT, {
        element: state.current[0],
        selected: true
      })
      commit(mutation.SET_WINDOW_SCROLL, '-1')
    }
  },

  /**
   * Redo Action
   * @param  {Function} store.commit
   * @return {void}
   */
  redoElement ({commit}) {
    commit(mutation.REDO_ELEMENT)
  },

  /**
   * Add Element to the current state
   * @param {Function} store.commit
   * @param {String} options.markupText
   * @param {String} options.appendTo
   * @return {void}
   */
  addElement ({commit}, options) {
    commit(mutation.SET_WINDOW_SCROLL, '+1')
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.ADD_ELEMENT, options)
    commit(mutation.APPLY_ELEMENT)
    commit(mutation.SET_WINDOW_SCROLL, '-1')
  },

  /**
   * Remove Element
   * @param  {Function} store.commit
   * @param  {String} id
   * @return {void}
   */
  removeElement ({commit, state}, id) {
    const element = getRequiredParentElement(id, state.current) || getElementObject(id, state.current)
    const nextSelectedElement = getSiblingElement(id, state.current)

    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.REMOVE_ELEMENT, element.id)
    commit(mutation.APPLY_ELEMENT)
    commit(mutation.SET_WINDOW_SCROLL, '+1')
    commit(mutation.HOVER_ELEMENT, null)
    commit(mutation.SELECT_ELEMENT, {
      element: nextSelectedElement,
      selected: true
    })
    commit(mutation.SET_WINDOW_SCROLL, '-1')
  },

  /**
   * Copy and Cut actions in memory
   * @param  {Function} options.commit
   * @param  {Function} options.state
   * @param  {String} options.action
   * @param  {String} options.id
   * @return {void}
   */
  moveElement ({commit, state}, {action, id, target}) {
    commit(mutation.SNAPSHOT_ELEMENT)

    const srcElement = getRequiredParentElement(id, state.snapshot) || getElementObject(id, state.snapshot)

    let idEl = getElementNodeById(id)
    let targetEl = getElementNodeById(target)
    let idObj = getElementObjectByNode(idEl)
    let targetObj = getElementObjectByNode(targetEl)

    targetObj.childNodes.push(idObj)

    if (srcElement) {
      commit(mutation.MOVE_ELEMENT, {
        action,
        element: utils.CloneObject(srcElement)
      })

      if (action === MoveAction.CUT) {
        commit(mutation.REMOVE_ELEMENT, id)
      }

      commit(mutation.DROP_ELEMENT, {
        parent: id
      })
      commit(mutation.APPLY_ELEMENT)
    }
  },

  /**
   * Duplicate
   * @param  {Function} options.commit
   * @param  {Function} options.state
   * @param  {String} options.action
   * @param  {String} options.id
   * @return {void}
   */
  duplicateElement ({commit, state}, id) {
    commit(mutation.SNAPSHOT_ELEMENT)
    const srcElement = getElementObject(id, state.snapshot)

    if (srcElement) {
      const index = getIndexFromParent(id)
      commit(mutation.MOVE_ELEMENT, {
        action: MoveAction.COPY,
        element: utils.CloneObject(srcElement)
      })
      commit(mutation.DROP_ELEMENT, {
        index,
        parent: id
      })
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
    commit(mutation.SET_WINDOW_SCROLL, '+1')

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
    commit(mutation.SET_WINDOW_SCROLL, '-1')

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

  hoverElement ({commit}, id) {
    if (!id) {
      return
    }

    if (id.tagName) {
      id = utils.GetNodeId(id)
    }

    const element = getElementObject(id)
    commit(mutation.HOVER_ELEMENT, element)
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
    //   //   setTimeout(() => node.SetCursorPosition(false)(element), 0)
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

  refreshScroll ({commit}) {
    commit(mutation.SET_WINDOW_SCROLL, '+1')
    commit(mutation.SET_WINDOW_SCROLL, 0)
  },
  toggleDragElement ({commit}, status) {
    commit(mutation.TOGGLE_DRAG_ELEMENT, status)
  },
  enableDragElement ({commit}, id) {
    commit(mutation.TOGGLE_DRAG_ELEMENT, true)
    commit(mutation.SET_ACTIVE_ELEMENT, id)
  },
  disableDragElement ({commit}) {
    commit(mutation.TOGGLE_DRAG_ELEMENT, false)
    commit(mutation.CLEAR_ACTIVE_ELEMENT)
  }
}

const getters = {
  /**
   * Get iframe window
   * @param {Object} state
   * @return {Object}
   */
  iframeWindow: state => state.window,

  /**
   * Get iframe document
   * @param {Object} state
   * @return {Object}
   */
  iframeDocument: state => state.window.document,

  /**
   * Get iframe document
   * @param {Object} state
   * @return {Object}
   */
  iframeBody: state => state.window.document.body,

  iframeOffset: state => state.window.frameElement.getBoundingClientRect(),

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
   * Hovered Element
   * @param  {Object} state
   * @return {Object}
   */
  hoveredElement: state => state.hovered,

  /**
   * Selected element offset
   * @param {Object} state
   * @return {Object}
   */
  selectedOffset (state, rootState) {
    const styles = {}

    if (state.selected) {
      const element = getElementNodeById(state.selected.id)

      if (!element) {
        return styles
      }

      const {canvasScroll} = rootState
      const bounds = element.getBoundingClientRect()
      const pos = {
        top: bounds.top,
        left: bounds.left
      }

      if (canvasScroll.top) {
        pos.top += Math.abs(canvasScroll.top)
        pos.left += Math.abs(canvasScroll.left)
      }

      styles.top = pos.top
      styles.left = pos.left
      styles.height = bounds.height
      styles.width = bounds.width
    }

    return styles
  },

  /**
   * Hovered element offset
   * @param {Object} state
   * @return {Object}
   */
  hoveredOffset (state, rootState) {
    const styles = {}

    if (state.hovered) {
      const element = getElementNodeById(state.hovered.id)

      if (!element) {
        return styles
      }

      const {canvasScroll} = rootState
      const bounds = element.getBoundingClientRect()
      const pos = {
        top: bounds.top,
        left: bounds.left
      }

      if (canvasScroll.top) {
        pos.top += Math.abs(canvasScroll.top)
        pos.left += Math.abs(canvasScroll.left)
      }

      styles.top = pos.top
      styles.left = pos.left
      styles.height = bounds.height
      styles.width = bounds.width
    }

    return styles
  },

  /**
   * Block add placement offset
   * @param {Object} state
   * @return {Object}
   */
  blockPosition (state, rootState) {
    let position = 0

    if (!state.hovered) {
      return position
    }

    const element = getRootElement(state.hovered.id)

    if (!element) {
      return position
    }

    const {canvasScroll} = rootState
    let {top, height} = element.getBoundingClientRect()

    if (element.getAttribute(RootElementTag)) {
      height = 0

      const elementObject = getElementObjectByNode(element, state.current)
      if (elementObject && elementObject.childNodes.length > 0) {
        const last = elementObject.childNodes.slice().pop()
        const lastElement = getElementNodeById(last.id)
        if (lastElement) {
          const lastBounds = lastElement.getBoundingClientRect()
          top = lastBounds.top
          height = lastBounds.height
        }
      }
    }

    if (canvasScroll.top) {
      top += Math.abs(canvasScroll.top)
    }

    position = height + top
    return position
  },

  rootElement (state) {
    const element = state.window.document.querySelector(`[${utils.SelectorAttrId}][${RootElementTag}]`)
    return getElementObjectByNode(element, state.current)
  },

  /**
   * Block index
   **/
  blockIndex () {
    let index = 0

    if (!state.hovered) {
      return index
    }

    const element = getRootElement(state.hovered.id)
    if (element) {
      if (element.getAttribute(RootElementTag)) {
        const elementObject = getElementObjectByNode(element, state.current)
        if (elementObject && elementObject.childNodes.length > 0) {
          index = elementObject.childNodes.length
        }

        return index
      }

      const elementId = utils.GetNodeId(element)
      const parentElement = getParentElement(elementId)
      if (parentElement) {
        const childNodes = parentElement.childNodes
        for (let i = 0; i < childNodes.length; i++) {
          if (utils.GetNodeId(childNodes[i]) === elementId) {
            index = i
          }
        }
      }
      index++
    }

    return index
  },

  /**
   * Breadcrumbs on selected element
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
   * Single breadcrumb on hovered element
   */
  breadcrumb (state) {
    let breadcrumb = {}

    if (state.hovered) {
      let {id, label} = state.hovered
      breadcrumb = { id, label }
    }

    return breadcrumb
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
  },

  /**
   * Get state dragging of element
   * @param {Object} state
   */
  elementDragging: state => {
    return state.dragging.status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
