import {
  SelectorId,
  GetNodeId,
  GlobalClassName,
  SelectorAttrId
} from '../../utils'

import {
  RootElementTag,
  NestedableRules,
  VoidElements
} from '../../const'

class NodeUtils {
  constructor (state) {
    this.state = state
  }

  static setState (state) {
    this.state = state
  }

  getElementObject (id, elements) {
    elements = !elements ? this.state.current : elements
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].childNodes && elements[i].childNodes.length > 0) {
        const elementObject = this.getElementObject(id, elements[i].childNodes)
        if (elementObject) {
          return elementObject
        }
      }

      if (elements[i].id === id) {
        return elements[i]
      }
    }
  }

  getElementNodeById = id => {
    if (this.state.window) {
      return this.state.window.document.querySelector(SelectorId(id))
    }
  }

  getElementObjectByNode = (element, elements) => {
    return this.getElementObject(GetNodeId(element), elements)
  }

  getParentElement = id => {
    const element = this.getElementNodeById(id)
    if (element) {
      return GetNodeId(element.parentElement)
        ? element.parentElement
        : undefined
    }
  }

  getRealParent = id => {
    const checkRequiredParent = this.getRequiredParentElement(id)
    const checkElement = this.getElementObject(id)
    const element = checkRequiredParent || checkElement
    if (!element) return

    const parent = this.getParentElementObject(element.id)
    if (!parent) return

    return parent
  }

  getIndexFromParent = id => {
    const parentElement = this.getParentElement(id)
    if (parentElement) {
      for (let i = 0; i < parentElement.childNodes.length; i++) {
        const _id = GetNodeId(parentElement.childNodes[i])
        if (_id === id) {
          return i
        }
      }
    }

    return 0
  }

  getRootElement = id => {
    const element = this.getElementNodeById(id)

    if (!element) {
      return
    }

    if (element.getAttribute(RootElementTag)) {
      return element
    }

    const parentElement = this.getParentElement(id)
    if (parentElement && parentElement.getAttribute(RootElementTag)) {
      return element
    } else {
      return this.getRootElement(GetNodeId(parentElement))
    }
  }

  getPrevElement = id => {
    const element = this.getElementNodeById(id)
    if (element) {
      return GetNodeId(element.previousElementSibling)
        ? element.previousElementSibling
        : undefined
    }
  }

  getNextElement = id => {
    const element = this.getElementNodeById(id)
    if (element) {
      return GetNodeId(element.nextElementSibling)
        ? element.nextElementSibling
        : undefined
    }
  }

  getParentElementObject = (id, elements) => {
    const parentElement = this.getParentElement(id)
    if (parentElement) {
      return this.getElementObjectByNode(parentElement, elements)
    }
  }

  getPrevElementObject = (id, elements) => {
    const prevElement = this.getPrevElement(id)
    if (prevElement) {
      return this.getElementObjectByNode(prevElement, elements)
    }
  }

  getNextElementObject = (id, elements) => {
    const nextElement = this.getNextElement(id)
    if (nextElement) {
      return this.getElementObjectByNode(nextElement, elements)
    }
  }

  getSiblingElement = (id, elements) => {
    let element = this.getParentElementObject(id, elements)
    const prevElement = this.getPrevElementObject(id, elements)
    const nextElement = this.getNextElementObject(id, elements)

    if (nextElement) {
      element = nextElement
    } else if (prevElement) {
      element = prevElement
    }

    return element
  }

  getRequiredParentElement = (id, elements) => {
    const parentElementObject = this.getParentElementObject(id, elements)
    if (parentElementObject && parentElementObject.requiredParent) {
      return parentElementObject
    }
  }

  getLinkElementObject = (linkNode, elements) => {
    if (linkNode.tagName.toLowerCase() === 'a') {
      return this.getElementObject(GetNodeId(linkNode), elements)
    }
  }

  isRow = element => {
    return element && element.classList.contains(GlobalClassName('row'))
  }

  isVoidElementById = id => {
    const element = this.getElementNodeById(id)
    if (element) {
      return VoidElements.includes(element.tagName.toLowerCase())
    }
  }

  isNestedablePair = (fromKind, toKind) => {
    const rule = NestedableRules[toKind]
    return rule !== '*' ? rule.includes(fromKind) : true
  }

  getBreadcrumbById = (id, elements) => {
    const elementObject = this.getElementObject(id, elements)
    if (elementObject) {
      const { id, label } = elementObject
      return { id, label }
    }
  }

  deleteNodeById = (id, elements) => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].childNodes && elements[i].childNodes.length > 0) {
        this.deleteNodeById(id, elements[i].childNodes)
      }

      if (elements[i].id === id) {
        elements.splice(i, 1)
      }
    }
  }

  insertChildNodesByIndex = (object, insertObject, index) => {
    index = index === undefined ? object.childNodes.length : index
    object.childNodes.splice(index, 0, insertObject)
  }

  getStyle = (elementObject, isGlobal) => {
    const element = this.getElementNodeById(elementObject.id)
    let properties = this.state.window.getComputedStyle(element)

    if (isGlobal) {
      const tmpElement = element.cloneNode(true)
      tmpElement.removeAttribute(SelectorAttrId)

      if (tmpElement.hasChildNodes()) {
        tmpElement.childNodes.forEach(el => el.remove())
      }

      this.state.window.document.body.appendChild(tmpElement)
      properties = this.state.window.getComputedStyle(tmpElement)
      setTimeout(() => tmpElement.remove(), 1)
    }

    return properties
  }

  setCursorPosition = atStart => el => {
    const hasFeature = {
      getSelection: typeof this.state.window.getSelection !== 'undefined',
      createRange: typeof this.state.window.document.createRange !== 'undefined',
      createTextRange: typeof this.state.window.document.body.createTextRange !== 'undefined'
    }

    if (hasFeature.getSelection && hasFeature.createRange) {
      const range = this.state.window.document.createRange()
      const sel = this.state.window.getSelection()
      range.selectNodeContents(el)
      range.collapse(atStart)
      sel.removeAllRanges()
      sel.addRange(range)
    } else if (hasFeature.createTextRange) {
      const textRange = this.state.window.document.body.createTextRange()
      textRange.moveToElementText(el)
      textRange.collapse(atStart)
      textRange.select()
    }

    el.focus()
  }
}

export default NodeUtils
