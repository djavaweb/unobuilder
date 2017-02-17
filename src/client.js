// Import important modules
import $ from 'jquery'
import async from 'async'
import {IsJSON, ReplaceDeep, RandomUID} from './utils'
import {extend, omit} from 'lodash'

// Define static vars
const errorMessages = {
  eventRequired: 'UNO: An event type must be specified',
  cannotBeObject: 'UNO: An event type cannot be an Object',
  typeAndCallbackRequired: 'UNO: Event type and callback must be specified',
  allRequired: 'UNO: Event type, route and callback function must be specified',
  JSONNotfound: 'UNO: component.json not found',
  TemplateNotfound: 'UNO: template.html not found',
  invalidJSON: 'UNO: Your JSON is invalid',
  invalidTemplate: 'UNO: Your Template is invalid',
  optionsUndefined: 'UNO: Options Undefined'
}
const actionObjectException = [
  'template',
  'path',
  'settings',
  'beforeInit',
  'afterInit',
  'dragStart',
  'dragMove',
  'dragEnd',
  'added',
  'ready'
]

const getScriptPath = url => {
  let scriptPath = url.split('/')
  scriptPath.splice(-1)
  scriptPath = scriptPath.join('/')

  return scriptPath
}

/**
 * Unobuilder global framework to register components
 */
const UnoBuilder = function () {
  if (!global.__uno__) {
    global.__uno__ = {}
  }

  global.__uno__.eventList = {}
  global.__uno__.components = {}
  global.__uno__.blocks = {}
  global.__uno__.url = null
  global.__uno__.element = null
  global.__uno__.builder = null

  const _root = this

  /**
   * Init builder
   * @param  {String} element
   * @return {Object}
   */
  _root.builder = element => {
    global.__uno__.builder = element
    _root.emit('prepare', element)
    return _root
  }

  /**
   * get builder selector
   * @return {String}
   */
  _root.getBuilderSelector = () => {
    return global.__uno__.builder
  }

  /**
   * Get builder url
   * @return {String}
   */
  _root.getBuilderUrl = () => {
    return global.__uno__.url
  }

  /**
   * Uno load URL to uno canvas
   * @param {Object} options
   */
  _root.loadCanvas = options => {
    if (options.url && options.element) {
      global.__uno__.url = options.url
      global.__uno__.element = options.element
      _root.emit('init', {
        builder: global.__uno__.builder,
        canvas: options.element
      })
    } else {
      throw Error(errorMessages.optionsUndefined)
    }
    return _root
  }

  /**
   * Uno event register
   * @param  {String} eventType
   * @param  {Function} fn
   */
  _root.on = function (eventType, fn) {
    let argsLength = arguments.length
    let callback

    switch (argsLength) {
      case 0:
        throw Error(errorMessages.typeAndCallbackRequired)

      case 1:
        throw Error(errorMessages.typeAndCallbackRequired)

      case 2:
        if (typeof eventType === 'string' && typeof fn === 'function') {
          callback = fn
        } else {
          throw Error(errorMessages.allRequired)
        }
        break
    }

    // eventType doesn't exist, create new one
    if (!global.__uno__.eventList[eventType]) {
      global.__uno__.eventList[eventType] = []
    }

    global.__uno__.eventList[eventType].push({
      callback: callback
    })

    return _root
  }

  /**
   * Turn off event
   * @param  {String} eventType [description]
   */
  _root.off = eventType => {
    var argsLength = arguments.length

    switch (argsLength) {
      case 0:
        throw Error(errorMessages.eventRequired)

      case 1:
        if (typeof eventType !== 'string') {
          throw Error(errorMessages.cannotBeObject)
        }
        break
    }

    if (global.__uno__.eventList[eventType]) {
      delete global.__uno__.eventList[eventType]
    }

    return _root
  }

  /**
   * Uno event emitter
   * @param  {String} eventType
   * @param  {Object|String|Number|Array} variables
   */
  _root.emit = function (eventType, variables) {
    let vars
    let argsLength = arguments.length

    const emitCallbacks = arr => {
      for (let i = 0; i < arr.length; i++) {
        arr[i].callback && arr[i].callback.call(_root, vars)
      }
    }

    switch (argsLength) {
      case 0:
        throw Error(errorMessages.eventRequired)
      case 2:
        vars = variables
        break
    }

    if (global.__uno__.eventList[eventType]) {
      let arr = global.__uno__.eventList[eventType]
      emitCallbacks(arr)
    }
  }

  /**
   * Get event list
   * @return {Object} eventList
   */
  _root.events = () => {
    return global.__uno__.eventList
  }

  /**
   * Reset Events
   */
  _root.resetEvents = () => {
    global.__uno__.eventList = {}
    return global.__uno__.eventList
  }

  /**
   * Async queues to add component or block
   */
  _root.elementQueue = async.queue((task, callback) => {
    const fnName = task.type === 'component'
      ? 'initComponent'
      : 'initBlock'

    _root[fnName](task.url, task.scriptPath, () => {
      callback()
    })
  }, 1)

  /**
   * Uno add component to list
   * @param {String} url
   */
  _root.addComponent = (url) => {
    let scriptPath = getScriptPath(url)
    let type = 'component'
    _root.elementQueue.push({ url, type, scriptPath })
  }

  /**
   * Uno add block to list
   * @param {String} url
   */
  _root.addBlock = (url) => {
    let scriptPath = getScriptPath(url)
    let type = 'block'
    _root.elementQueue.push({ url, type, scriptPath })
  }

  /**
   * Uno init element (block / component)
   * @param {String} url
   */
  _root.initElement = (element, url, scriptPath, callback) => {
    // Get component object from js file
    // For closure purpose
    let data = {
      _id: RandomUID(),
      path: {
        root: scriptPath,
        img: `${scriptPath}/img/`,
        js: `${scriptPath}/js/`,
        css: `${scriptPath}/css/`
      }
    }

    // load json
    const loadJson = callback => {
      $.ajax({
        url: `${scriptPath}/${element}.json`,
        type: 'GET',
        dataType: 'json',
        complete (xhr) {
          // Call after init
          if (xhr.status === 200) {
            let json = IsJSON(xhr.responseText)
            if (json && json.id) {
              // Append component settings
              data.settings = ReplaceDeep(json, [{
                regex: /^(img\/)/g,
                value: data.path.img
              }, {
                regex: /^(js\/)/g,
                value: data.path.js
              }, {
                regex: /^(css\/)/g,
                value: data.path.css
              }])

              callback && callback.apply(this, [json.id, data])
            } else {
              throw Error(`${errorMessages.invalidJSON}, url: ${scriptPath}/${element}.json`)
            }
          } else {
            throw Error(`${errorMessages.JSONNotfound}, url: ${scriptPath}/${element}.json`)
          }
        }
      })
    }

    // Load Markup template
    const loadTemplate = callback => {
      $.ajax({
        url: `${scriptPath}/${element}.html`,
        type: 'GET',
        complete (xhr) {
          // Call after init
          if (xhr.status === 200) {
            let template = $.trim(xhr.responseText.replace(/[\t\n]+/g, ' '))
            if (template !== '') {
              callback && callback.apply(this, [template])
            } else {
              throw Error(`${errorMessages.invalidTemplate}, url: ${scriptPath}/${element}.html`)
            }
          } else {
            throw Error(`${errorMessages.TemplateNotFound}, url: ${scriptPath}/${element}.html`)
          }
        }
      })
    }

    // load JSON and HTML
    loadJson((elementId, _element) => {
      loadTemplate(template => {
        // Add template to component
        _element.template = template

        // Add component to list
        global.__uno__[`${element}s`][elementId] = _element

        // Register script
        _root.registerScript(url, `${element}-${_element._id}`)

        callback && callback()
      })
    })
  }

  _root.initComponent = (url, scriptPath, callback) => {
    _root.initElement('component', url, scriptPath, callback)
  }

  _root.initBlock = (url, scriptPath, callback) => {
    _root.initElement('block', url, scriptPath, callback)
  }

  _root.getComponentList = () => {
    return global.__uno__.components
  }

  _root.getComponentItem = item => {
    if (item in global.__uno__.components) {
      return global.__uno__.components[item]
    }
  }

  _root.getBlockList = () => {
    return global.__uno__.blocks
  }

  _root.registerScript = (url, registerId) => {
    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
  }

  /**
   * Register element (block or component)
   * @param {String} name
   * @param {Object} options
   */
  _root.registerElement = (element, name, options) => {
    if (global.__uno__[element][name]) {
      // Call before init event
      if (options.events.beforeInit) {
        options.events.beforeInit.apply(global.__uno__[element][name])
      }

      // Duplicate data that doesn't have events name
      if (options.data) {
        let data = omit(options.data, actionObjectException)
        extend(global.__uno__[element][name], data)
      }

      // Duplicate all events
      if (options.events) {
        actionObjectException.forEach(eventName => {
          if (options.events[eventName]) {
            global.__uno__[element][name][eventName] = options.events[eventName]
          }
        })
      }

      // Call after init event
      if (options.events.afterInit) {
        options.events.afterInit.apply(global.__uno__[element][name])
      }
    }

    return _root
  }

  /**
   * Register components
   */
  _root.registerComponent = (name, options) => {
    _root.registerElement('components', name, options)
    return _root
  }

  /**
   * Register blocks
   */
  _root.registerBlock = (name, options) => {
    _root.registerElement('blocks', name, options)
    return _root
  }

  return _root
}

module.exports = new UnoBuilder()
