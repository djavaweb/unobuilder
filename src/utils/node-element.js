import * as constant from '../const'
import * as common from './common'

export const GetElementObject = (id, elements) => {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].childNodes && elements[i].childNodes.length > 0) {
      const elementObject = GetElementObject(id, elements[i].childNodes)
      if (elementObject) {
        return elementObject
      }
    }

    if (elements[i].id === id) {
      return elements[i]
    }
  }
}

export const GetElementNodeId = element => {
  return element && element.getAttribute(common.SelectorAttrId)
}

export const GetElementNodeById = id => {
  return document.querySelector(common.SelectorId(id))
}

export const GetElementObjectByNode = (element, elements) => {
  return GetElementObject(GetElementNodeId(element), elements)
}

export const GetParentElement = id => {
  const element = GetElementNodeById(id)
  if (element) {
    return GetElementNodeId(element.parentElement) ? element.parentElement : undefined
  }
}

export const GetParentElementObject = (id, elements) => {
  const parentElement = GetParentElement(id)
  if (parentElement) {
    return GetElementObjectByNode(parentElement, elements)
  }
}

export const GetRequiredParentElement = (id, elements) => {
  const parentElementObject = GetParentElementObject(id, elements)
  if (parentElementObject && parentElementObject.requiredParent) {
    return parentElementObject
  }
}

export const GetLinkElementObject = (linkNode, elements) => {
  if (linkNode.tagName.toLowerCase() === 'a') {
    return GetElementObject(GetElementNodeId(linkNode), elements)
  }
}

export const IsRow = element => {
  return element && element.classList.contains(common.GlobalClassName('row'))
}

export const IsVoidElementById = id => {
  const element = GetElementNodeById(id)
  if (element) {
    return constant.VoidElements.includes(element.tagName.toLowerCase())
  }
}

export const IsNestedablePair = (fromKind, toKind) => {
  return constant.NestedableRules[toKind].includes(fromKind)
}

export const GetBreadcrumbById = (id, elements) => {
  const elementObject = GetElementObject(id, elements)
  if (elementObject) {
    const { id, label } = elementObject
    return { id, label }
  }
}

export const InsertChildNodesByIndex = (object, insertObject, index) => {
  index = index === undefined ? object.childNodes.length : index
  object.childNodes.splice(index, 0, insertObject)
}

export const ChangeIdDeep = object => {
  const newId = common.RandomUID()
  if (object.id) {
    object.id = newId
    object.dataObject.attrs[common.SelectorAttrId] = newId
    object.dataObject.attrs.testid = newId
    object.dataObject.ref = newId.replace(/-/g, '')
    for (let index in object.childNodes) {
      object.childNodes[index] = ChangeIdDeep(object.childNodes[index])
    }
  }
  return object
}

export const GetStyle = (elementObject, isGlobal) => {
  const element = GetElementNodeById(elementObject.id)
  let properties = window.getComputedStyle(element)

  if (isGlobal) {
    const tmpElement = element.cloneNode(true)
    tmpElement.removeAttribute(common.SelectorAttrId)

    if (tmpElement.hasChildNodes()) {
      tmpElement.childNodes.forEach(el => el.remove())
    }

    document.body.appendChild(tmpElement)
    properties = window.getComputedStyle(tmpElement)
    setTimeout(() => tmpElement.remove(), 1)
  }

  return properties
}

export const SetSursorPosition = atStart => el => {
  const hasFeature = {
    getSelection: typeof window.getSelection !== 'undefined',
    createRange: typeof document.createRange !== 'undefined',
    createTextRange: typeof document.body.createTextRange !== 'undefined'
  }

  if (hasFeature.getSelection && hasFeature.createRange) {
    const range = document.createRange()
    const sel = window.getSelection()

    range.selectNodeContents(el)
    range.collapse(atStart)
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (hasFeature.createTextRange) {
    const textRange = document.body.createTextRange()
    textRange.moveToElementText(el)
    textRange.collapse(atStart)
    textRange.select()
  }

  el.focus()
}
