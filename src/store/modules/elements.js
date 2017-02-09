import * as constant from '../../const'
import * as node from '../../utils/node-element'
import * as common from '../../utils/common'
import * as mutation from '../mutation-types'
import {isEqual} from 'lodash'

const state = {
  prev: [],
  current: [],
  snapshot: [],
  next: [],
  selected: null,
  move: {}
}

const mutations = {
  /**
   * Apply changes mutation
   * - Insert current state at the end of previous state.
   * - Set current element to the new state after handling the action.
   * - Clear the next state.
   */
  [mutation.APPLY_ELEMENT] (state) {
    let { prev, current, snapshot } = state
    const snapshotObject = common.CloneObject(snapshot)

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
    state.snapshot = common.CloneObject(state.current)
  },

  /**
   * Add element to current state
   */
  [mutation.ADD_ELEMENT] (state, { markupText, appendTo, index }) {
    const element = common.MarkupToObject(markupText)
    if (element) {
      if (!appendTo) {
        index = !index ? state.snapshot.length : index
        state.snapshot.splice(index, 0, element)
      } else {
        const appendEl = node.GetElementObject(appendTo, state.snapshot)
        index = !index ? appendEl.childNodes.length : index
        appendEl.childNodes.splice(index, 0, element)
      }
    }
  },

  /**
   * Remove current element state by id
   */
  [mutation.REMOVE_ELEMENT] (state, id) {
    const parentElement = node.GetParentElementObject(id, state.snapshot)
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
     ? node.GetElementObject(payload.id, state.snapshot)
     : state.snapshot

    if (!dropElement || !state.move.element) return

    let index = payload && payload.index ? payload.index : 0
    let srcElement = common.CloneObject(state.move.element)
    srcElement = node.ChangeIdDeep(srcElement)

    if (payload && payload.id) {
      const notVoidElement = !node.IsVoidElementById(dropElement.id)
      const canNested = node.IsNestedablePair(srcElement.kind, dropElement.kind)
      if (notVoidElement && canNested) {
        node.InsertChildNodesByIndex(dropElement, srcElement, index)
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
    const element = node.GetElementObjectByNode(editableNode, state.snapshot)
    if (element && element.editable) {
      element.dataObject.attrs.contenteditable = true
      setTimeout(() => node.SetSursorPosition(false)(editableNode), 0)
    }
  }
}

const actions = {
  /**
   * Add Element to the current state
   * @param {Function} store.commit
   * @param {Object} store.state
   * @param {String} options.markupText
   * @param {String} options.appendTo
   * @return {void}
   */
  addElement ({ commit, state }, options) {
    commit(mutation.SNAPSHOT_ELEMENT)
    commit(mutation.ADD_ELEMENT, options)
    commit(mutation.APPLY_ELEMENT)
  },

  /**
   * Remove Element
   * @param  {Function} store.commit
   * @param  {Object} store.state
   * @param  {String} id
   * @return {void}
   */
  removeElement ({commit, state}, id) {
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
    const srcElement = node.GetRequiredParentElement(id, state.snapshot) || node.GetElementObject(id, state.snapshot)

    if (srcElement) {
      commit(mutation.MOVE_ELEMENT, {
        action,
        element: common.CloneObject(srcElement)
      })

      if (action === constant.MoveAction.CUT) {
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
    if (state.selected) {
      // this.$set(this.selectedElement, 'selected', false)
      // if (this.selectedElement.dataObject.attrs.contenteditable) {
      //   const prevElementNode = node.GetElementNodeById(this.selectedElement.id, this.elements)

      //   if (prevElementNode.innerHTML.length > 0) {
      //     this.$set(this.selectedElement.dataObject.domProps, 'innerHTML', prevElementNode.innerHTML)
      //   } else {
      //     this.removeElement(this.selectedElement.id)
      //   }

      //   if (this.selectedElement.id !== id) {
      //     this.setContentEditable(false)
      //   }
      // }

      commit(mutation.SELECT_ELEMENT, {element: state.selected, selected: false})
      if (state.selected.dataObject.attrs.contenteditable) {
        commit(mutation.SNAPSHOT_ELEMENT)
        const prevElement = node.GetElementNodeById(state.selected.id, state.current)
        if (prevElement.innerHTML.length > 0) {
          console.log('bbaba')
        } else {
          commit(mutation.REMOVE_ELEMENT, state.selected.id)
        }
        commit(mutation.APPLY_ELEMENT)
      }
    }

    const element = id ? node.GetElementObject(id, state.current) : null
    if (element) {
      commit(mutation.SELECT_ELEMENT, {element, selected: true})
    }
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
   * Breadcrumbs
   * @return {Array}
   */
  breadcrumbs (state) {
    if (state.selected) {
      const breadcrumbs = []

      // Get current breacrumb
      let {id, label} = state.selected
      breadcrumbs.push({ id, label })

      // Get parent breadcrumb
      const parent = node.GetParentElementObject(id, state.current)
      if (parent) {
        breadcrumbs.push({ id: parent.id, label: parent.label })
      }

      // Get grandparent
      const grandParent = parent ? node.GetParentElementObject(parent.id, state.current) : null
      if (grandParent) {
        breadcrumbs.push({ id: grandParent.id, label: grandParent.label })
      }

      return breadcrumbs.reverse()
    }
  },

  /**
   * Check wheter selected element is void element
   * @param  {Object}  state
   * @return {Boolean}
   */
  isVoidElement (state) {
    if (state.selected) {
      return node.IsVoidElementById(state.selected.id)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
