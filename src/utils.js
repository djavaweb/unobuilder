import tagLexer from 'pug-lexer'
import tagParser from 'pug-parser'
import {each, mapValues, map, isArray, isObject} from 'lodash'
import {ClassPrefix} from './const'

const cssPrefixes = [
  '-webkit-',
  '-moz-',
  '-ms-'
]

const camelPrefixes = [
  'Webkit',
  'Moz',
  'ms'
]

const tagType = {
  TAG: 'Tag',
  TEXT: 'Text'
}

const attrType = {
  KIND: 'kind',
  CLASS: 'class',
  LABEL: 'label',
  EDITABLE: 'editable',
  REQUIRED_PARENT: 'required-parent'
}

const hyphenateRE = /([a-z\d])([A-Z])/g
const camelizeRE = /-(\w)/g

/**
 * Data ID from attribute prefix
 * @type {[type]}
 */
export const SelectorAttrId = `data-${ClassPrefix.SHORT}-id`

/**
 * Data component name from attribute prefix
 * @type {[type]}
 */
export const SelectorAttrComponent = `data-${ClassPrefix.SHORT}-component`

/**
 * Generate random UID
 * @return {String}
 */
export const RandomUID = () => {
  const getUID = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  const UIDs = []

  for (let i = 0; i < 4; i++) {
    UIDs.push(getUID(i))
  }

  return UIDs.join('-')
}

/**
 * Generate data selector id
 * @param  {String} id
 * @return {String}
 */
export const SelectorId = id => {
  return `[${SelectorAttrId}="${id}"]`
}

export const ClassName = (name = 'unnamed', selector = '') => {
  return `${selector}${ClassPrefix.SHORT}-${name}`
}

export const GlobalClassName = (name = 'unnamed', selector = '') => {
  return ClassName(`g-${name}`, selector)
}

/**
* Convert pug schema to Object
* @param  {Object} node
* @return {Object}
*/
export const SchemaToObject = node => {
  const domAttrs = node.attrs || [{name: 'label', val: 'text'}]
  const domProps = {}
  const classes = {}
  const attrs = {}
  let childNodes = []
  let editable = false
  let requiredParent = false
  let kind = ''
  let label

  for (let key in domAttrs) {
    const value = typeof domAttrs[key].val === 'string'
      ? domAttrs[key].val.replace(/['"]/g, '')
      : value

    switch (domAttrs[key].name) {
      case attrType.CLASS:
        classes[value] = true
        break

      case attrType.KIND:
        kind = value
        classes[GlobalClassName(value)] = true
        if (value === 'row') {
          domProps.gutter = {}
        }
        break

      case attrType.LABEL:
        label = value
        break

      case attrType.EDITABLE:
        editable = true
        break

      case attrType.REQUIRED_PARENT:
        requiredParent = true
        break

      default:
        attrs[domAttrs[key].name] = value
        break
    }
  }

  if (node.block) {
    const childBlockNodes = []
    if (node.block.nodes.length === 1) {
      const element = node.block.nodes[0]
      if (element.type === tagType.TEXT && element.val.length > 0) {
        domProps.innerHTML = element.val
      }
    } else {
      for (let index in node.block.nodes) {
        const nodeObject = node.block.nodes[index]
        if (nodeObject.type === tagType.TEXT) {
          childBlockNodes.push(nodeObject.val)
        } else {
          let childNode = SchemaToObject(nodeObject)
          if (childNode) {
            childBlockNodes.push(childNode)
          }
        }
      }
    }
    childNodes = childNodes.concat(childBlockNodes)
  }

  if (domAttrs.length > 0 && kind) {
    const id = RandomUID()
    const ref = id.replace(/-/g, '')
    const tagName = node.name || ''
    const domType = node.type.toLowerCase() || 'div'
    const selected = false
    const cssProperties = {
      large: {},
      medium: {},
      small: {},
      tiny: {}
    }

    attrs[SelectorAttrId] = id

    if (!label) {
      label = kind
    }

    const dataObject = {
      ref,
      attrs,
      domProps,
      class: classes
    }

    const schemaObject = {
      id,
      kind,
      label,
      tagName,
      domType,
      selected,
      editable,
      dataObject,
      childNodes,
      cssProperties,
      requiredParent
    }

    return schemaObject
  }
}

/**
 * Convert markup based on pugjs to object
 * @param  {String} markupText
 * @return {Object}
 */
export const MarkupToObject = markupText => {
  let tokens = tagLexer(markupText)
  let schema = tagParser(tokens)
  let schemaObject = SchemaToObject(schema.nodes[0])
  return schemaObject
}

/**
 * CSS Prefixer, convert camelize to kebab and camelize
 * @param {String} propName
 * @return {Object}
 */
export const CssPrefixer = propName => {
  let prop = propName.replace(hyphenateRE, '$1-$2').toLowerCase()
  let camel = prop.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
  let upper = camel.charAt(0).toUpperCase() + camel.slice(1)
  let testEl = document.createElement('div')
  let i = cssPrefixes.length
  let prefixed

  if (camel !== 'filter' && (camel in testEl.style)) {
    return {kebab: prop, camel: camel}
  }

  while (i--) {
    prefixed = camelPrefixes[i] + upper
    if (prefixed in testEl.style) {
      return {
        kebab: cssPrefixes[i] + prop,
        camel: prefixed
      }
    }
  }
}

/**
 * Clone object
 * @param  {Object} object
 * @return {Object}
 */
export const CloneObject = object => {
  return JSON.parse(JSON.stringify(object))
}

/**
* Check if json is valid
* @param  {String} json
* @param  {String} message
* @return {Boolean}
*/
export const IsJSON = (json, message = 'Invalid JSON') => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return false
  }
}

/**
 * Change ID deep
 */
export const ChangeIdDeep = object => {
  const newId = RandomUID()
  if (object.id) {
    object.id = newId
    object.dataObject.attrs[SelectorAttrId] = newId
    object.dataObject.attrs.testid = newId
    object.dataObject.ref = newId.replace(/-/g, '')
    for (let index in object.childNodes) {
      object.childNodes[index] = ChangeIdDeep(object.childNodes[index])
    }
  }
  return object
}

/**
 * Replace object deep
 * @param {Object} object
 * @param {Array} replace
 * @return {Object}
 */
export const ReplaceDeep = (obj, replace) => {
  const replaceItem = item => {
    each(replace, obj => {
      item = item.replace(obj.regex, obj.value)
    })
    return item
  }

  return mapValues(obj, (item) => {
    if (typeof item === 'string') {
      item = replaceItem(item)
    } else if (isArray(item)) {
      item = map(item, (value) => replaceItem(value))
    } else if (isObject(item)) {
      item = ReplaceDeep(item, replace)
    }
    return item
  })
}

/**
 * Request svg file from assets/img
 * @type {String}
 */
export const SVGIcon = filename => {
  return require(`!raw-loader!assets/img/${filename}.svg`)
}

/**
 * Get element's ID
 */
export const GetNodeId = element => {
  return element && element.getAttribute(SelectorAttrId)
}

/**
 * Add event listener crossbrowser
 * @param {ElementNode} element
 * @param {String} event
 * @param {Function} fn
 */
export const addEvent = (element, event, fn) => {
  if (element.addEventListener) {
    fn && element.addEventListener(event, fn, false)
  } else {
    element.attachEvent('on' + event, () => {
      fn && fn.call(element, window.event)
    })
  }
}

/**
 * Remove event listener crossbrowser
 * @param {ElementNode} element
 * @param {Function} fn
 */
export const removeEvent = (element, event, fn) => {
  if (element.addEventListener) {
    element.removeEventListener(event, fn)
  } else {
    element.detachEvent('on' + event, fn)
  }
}

/**
 * Moving element (used for drag n drop)
 * @param {DOMObject} target
 * @param {Object} options
 */
export const moveElement = (target, options) => {
  if (!target) return false
  // define it's default value
  let {
    iframeWindow = undefined,
    canvasScrollTop = 0,
    state: {
      x = 0,
      y = 0
    }
  } = options

  let rect = target.getBoundingClientRect()
  let {width, height} = rect

  let left = 0
  let top = 0
  if (iframeWindow) {
    let iframeOffset = iframeWindow.frameElement.getBoundingClientRect()
    left = iframeOffset.left
    top = iframeOffset.top
  }

  target.style.top = `${y - (height / 2) + top + canvasScrollTop}px`
  target.style.left = `${x - (width / 2) + left}px`
}
