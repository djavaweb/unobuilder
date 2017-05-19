import { each, mapValues, map, isArray, isObject } from 'lodash'
import { ClassPrefix } from './const'

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

export const TagType = {
  TAG: 'Tag',
  TEXT: 'Text'
}

export const AttrType = {
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
export const SelectorAttrId = `data-${ ClassPrefix.SHORT }-id`

/**
 * Data component name from attribute prefix
 * @type {[type]}
 */
export const SelectorAttrComponent = `data-${ ClassPrefix.SHORT }-component`

/**
 * Generate random UID
 * @return {String}
 */
export const RandomUID = prefix => {
  const getUID = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  const UIDs = []

  if (prefix) {
    UIDs.push(prefix)
  }

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
  return `[${ SelectorAttrId }="${ id }"]`
}

export const ClassName = (name = 'unnamed', selector = '') => {
  return `${ selector }${ ClassPrefix.SHORT }-${ name }`
}

export const GlobalClassName = (name = 'unnamed', selector = '') => {
  return ClassName(`g-${ name }`, selector)
}

/**
 * CSS Prefixer, convert camelize to kebab and camelize
 * @param {String} propName
 * @return {Object}
 */
export const CssPrefixer = propName => {
  const prop = propName.replace(hyphenateRE, '$1-$2').toLowerCase()
  const camel = prop.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
  const upper = camel.charAt(0).toUpperCase() + camel.slice(1)
  const testEl = document.createElement('div')
  let i = cssPrefixes.length
  let prefixed

  if (camel !== 'filter' && (camel in testEl.style)) {
    return { kebab: prop, camel: camel }
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
    object.dataObject.ref = newId.replace(/-/g, '')
    for (const index in object.childNodes) {
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
  return require(`!raw-loader!assets/img/${ filename }.svg`)
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
 * Dragging element (used for drag n drop)
 * @param {DOMObject} target
 * @param {Object} options
 */
export const dragElement = (target, options) => {
  if (!target) return false
  // define it's default value
  const {
    iframeWindow = undefined,
    canvasScrollTop = 0,
    state: {
      x = 0,
      y = 0
    }
  } = options

  const rect = target.getBoundingClientRect()
  const { width, height } = rect

  let left = 0
  let top = 0
  if (iframeWindow) {
    const iframeOffset = iframeWindow.frameElement.getBoundingClientRect()
    left = iframeOffset.left
    top = iframeOffset.top
  }

  target.style.top = `${ y - (height / 2) + top + canvasScrollTop }px`
  target.style.left = `${ x - (width / 2) + left }px`
}

/**
 * Value formatter
 * @param {Object} property
 */
export const valueFormatter = property => {
  const valueType = typeof property.value
  if (valueType === 'object' && 'rgba' in property.value) {
    const { r, g, b, a } = property.value.rgba
    return `rgba(${ r }, ${ g }, ${ b }, ${ a })`
  }

  if ('unit' in property) {
    return `${ property.value }${ property.unit }`
  }

  return property.value
}
