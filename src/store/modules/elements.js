/* eslint-disable no-unused-vars */
import Uno from 'uno'
import * as mutation from '../mutation-types'
import * as utils from '../../utils'
import {RootElementTag, VoidElements, NestedableRules, MoveAction} from '../../const'
import {isEqual} from 'lodash'
import NodeUtils from '../helpers/node-utils'

const defaultDropline = {
  element: undefined,
  position: {
    top: false,
    bottom: false,
    right: false,
    left: false
  },
  offset: {
    top: null,
    bottom: null,
    right: null,
    left: null,
    width: null,
    height: null
  }
}

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
  },
  dropline: Object.assign({}, defaultDropline)
}

const NodeHelpers = new NodeUtils(state)

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

      if (obj[utils.AttrType.KIND].length > 0) {
        const value = obj[utils.AttrType.KIND]
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
        const appendEl = NodeHelpers.getElementObject(appendTo, state.snapshot)
        index = !index ? appendEl.childNodes.length : index
        appendEl.childNodes.splice(index, 0, element)
      }
    }
  },

  /**
   * Remove current element state by id
   */
  [mutation.REMOVE_ELEMENT] (state, id) {
    NodeHelpers.deleteNodeById(id, state.snapshot)
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
  [mutation.DROP_ELEMENT] (state, options) {
    if (options.parentOf) {
      const parent = NodeHelpers.getParentElementObject(options.parentOf, state.snapshot)
      options.id = parent.id
    }

    let dropElement = options && options.id
     ? NodeHelpers.getElementObject(options.id, state.snapshot)
     : state.snapshot

    if (!dropElement || !state.move.element) return

    let index = options && options.index ? options.index : 0
    let srcElement = utils.CloneObject(state.move.element)
    srcElement = utils.ChangeIdDeep(srcElement)

    if (options && options.id) {
      const notVoidElement = !NodeHelpers.isVoidElementById(dropElement.id)
      const canNested = NodeHelpers.isNestedablePair(srcElement.kind, dropElement.kind)
      if (notVoidElement && canNested) {
        NodeHelpers.insertChildNodesByIndex(dropElement, srcElement, index)
      }
    } else {
      index = index === 0 ? dropElement.length : index
      dropElement.splice(index, 0, srcElement)
    }

    state.dropline = Object.assign({}, defaultDropline)
  },

  /**
   * Enable or disable editable content
   */
  [mutation.EDIT_CONTENT] (state, editableNode) {
    const element = NodeHelpers.getElementObjectByNode(editableNode, state.snapshot)
    if (element && element.editable) {
      element.dataObject.attrs.contenteditable = true
      setTimeout(() => NodeHelpers.setCursorPosition(false)(editableNode), 0)
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
  },

  [mutation.SET_DROPLINE] (state, options) {
    state.dropline = options
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
    const element = NodeHelpers.getRequiredParentElement(id, state.current) || NodeHelpers.getElementObject(id, state.current)
    const nextElement = NodeHelpers.getSiblingElement(element.id, state.current)

    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.REMOVE_ELEMENT, element.id)
    commit(mutation.APPLY_ELEMENT)

    return nextElement
  },

  /**
   * Copy and Cut actions in memory
   * @param  {Function} options.commit
   * @param  {Function} options.state
   * @param  {String} options.action
   * @param  {String} options.id
   * @return {void}
   */
  moveElement ({commit, state}, {action, id, appendTo}) {
    commit(mutation.SNAPSHOT_ELEMENT)
    const srcElement = NodeHelpers.getRequiredParentElement(id, state.snapshot) || NodeHelpers.getElementObject(id, state.snapshot)
    const appendSrcElement = NodeHelpers.getRequiredParentElement(appendTo, state.snapshot) || NodeHelpers.getElementObject(appendTo, state.snapshot)

    // check if have same parent
    if (srcElement.id === appendSrcElement.id) {
      return false
    }

    if (srcElement) {
      commit(mutation.MOVE_ELEMENT, {
        action: MoveAction.COPY,
        element: utils.CloneObject(srcElement)
      })

      if (action === MoveAction.CUT) {
        commit(mutation.REMOVE_ELEMENT, srcElement.id)
      }

      commit(mutation.DROP_ELEMENT, {
        id: appendTo
      })
      commit(mutation.APPLY_ELEMENT)

      return srcElement
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
    const srcElement = NodeHelpers.getElementObject(id, state.snapshot)

    if (srcElement) {
      const index = NodeHelpers.getIndexFromParent(id)
      const dupeElement = utils.CloneObject(srcElement)
      commit(mutation.MOVE_ELEMENT, {
        action: MoveAction.COPY,
        element: dupeElement
      })
      commit(mutation.DROP_ELEMENT, {
        index,
        parentOf: id
      })
      commit(mutation.APPLY_ELEMENT)
      return dupeElement
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
    element = NodeHelpers.getElementObject(id)
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
    //   //   const prevElementNode = node.NodeHelpers.GetElementNodeById(this.selectedElement.id, this.elements)

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

    //   //   const prevElement = NodeHelpers.getElementNodeById(state.selected.id, state.current)
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

    const element = NodeHelpers.getElementObject(id)
    commit(mutation.HOVER_ELEMENT, element)
  },

  editContent ({commit}, element) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.EDIT_CONTENT, element)
    commit(mutation.APPLY_ELEMENT)
    // if (state.selected) {

    //   const element = node.NodeHelpers.GetElementObject(state.selected.id, state.current)
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
  },

  setDropline ({commit}, options) {
    commit(mutation.SET_DROPLINE, options)
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
  elementOffset (state, rootState) {
    const getOffset = element => {
      const _element = getElementNodeById(element.id)

      if (!_element) {
        return {}
      }

      const {canvasScroll} = rootState
      let {top, left, width, height} = _element.getBoundingClientRect()

      if (left < 0) {
        width += left
        left = 0
      }

      if (canvasScroll.top) {
        top += Math.abs(canvasScroll.top)
        left += Math.abs(canvasScroll.left)
      }

      return { top, left, width, height }
    }

    let selected
    let hovered

    if (state.selected) {
      selected = getOffset(state.selected)
    }

    if (state.hovered) {
      hovered = getOffset(state.hovered)
    }

    return {
      selected,
      hovered
    }
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

      if (pos.left < 0) {
        pos.left = 0
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

    const element = NodeHelpers.getRootElement(state.hovered.id)

    if (!element) {
      return position
    }

    const {canvasScroll} = rootState
    let {top, height} = element.getBoundingClientRect()

    if (element.getAttribute(RootElementTag)) {
      height = 0

      const elementObject = NodeHelpers.getElementObjectByNode(element, state.current)
      if (elementObject && elementObject.childNodes.length > 0) {
        const last = elementObject.childNodes.slice().pop()
        const lastElement = NodeHelpers.getElementNodeById(last.id)
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
    return NodeHelpers.getElementObjectByNode(element, state.current)
  },

  /**
   * Block index
   **/
  blockIndex () {
    let index = 0

    if (!state.hovered) {
      return index
    }

    const element = NodeHelpers.getRootElement(state.hovered.id)
    if (element) {
      if (element.getAttribute(RootElementTag)) {
        const elementObject = NodeHelpers.getElementObjectByNode(element, state.current)
        if (elementObject && elementObject.childNodes.length > 0) {
          index = elementObject.childNodes.length
        }

        return index
      }

      const elementId = utils.GetNodeId(element)
      const parentElement = NodeHelpers.getParentElement(elementId)
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
      const parent = NodeHelpers.getParentElementObject(id, state.current)
      if (parent) {
        breadcrumbs.push({ id: parent.id, label: parent.label })
      }

      // Get grandparent
      const grandParent = parent ? NodeHelpers.getParentElementObject(parent.id, state.current) : null
      if (grandParent) {
        breadcrumbs.push({ id: grandParent.id, label: grandParent.label })
      }
    }

    return breadcrumbs.reverse()
  },

  /**
   * Single breadcrumb on hovered element
   */
  breadcrumb (state, getters, rootState) {
    let breadcrumb = {}

    if (state.hovered) {
      let {id, label} = state.hovered
      breadcrumb = { id, label }

      if ((rootState.components.dragging.status || state.dragging.status) && state.dropline.position.bottom) {
        const parent = NodeHelpers.getRealParent(state.hovered.id)
        if (parent) {
          breadcrumb = { id: parent.id, label: parent.label }
        }
      }
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
      return NodeHelpers.isVoidElementById(state.selected.id)
    }
  },

  /**
   * Get state dragging of element
   * @param {Object} state
   */
  elementDragging: state => {
    return state.dragging.status
  },

  dropline: (state, getter, rootState) => {
    let dropline = state.dropline
    if (dropline.position.bottom) {
      const parent = NodeHelpers.getRealParent(dropline.element)
      if (parent) {
        const {left, width} = NodeHelpers.getElementNodeById(parent.id).getBoundingClientRect()
        const iframeOffset = state.window.frameElement.getBoundingClientRect()
        dropline.offset.width = width
        dropline.offset.left = left + iframeOffset.left
      }
    }
    return dropline
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
