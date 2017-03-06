// Import important modules
import $ from 'jquery'
import async from 'async'
import {IsJSON, RandomUID} from './utils'
import {extend, omit} from 'lodash'

import HTMLParser from './HTMLParser'

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

  const builder = global.__uno__
  builder.eventList = {}
  builder.components = {}
  builder.blocks = {}
  builder.url = null
  builder.element = null
  builder.builder = null

  const _root = this

  /**
   * Init builder
   * @param  {String} element
   * @return {Object}
   */
  _root.builder = element => {
    builder.builder = element
    _root.emit('prepare', element)
    return _root
  }

  /**
   * get builder selector
   * @return {String}
   */
  _root.getBuilderSelector = () => {
    return builder.builder
  }

  /**
   * Get builder url
   * @return {String}
   */
  _root.getBuilderUrl = () => {
    return builder.url
  }

  /**
   * Uno load URL to uno canvas
   * @param {Object} options
   */
  _root.loadCanvas = options => {
    if (options.url && options.element) {
      builder.url = options.url
      builder.element = options.element
      _root.emit('init', {
        builder: builder.builder,
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
    if (!builder.eventList[eventType]) {
      builder.eventList[eventType] = []
    }

    builder.eventList[eventType].push({
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

    if (builder.eventList[eventType]) {
      delete builder.eventList[eventType]
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

    if (builder.eventList[eventType]) {
      let arr = builder.eventList[eventType]
      emitCallbacks(arr)
    }
  }

  /**
   * Get event list
   * @return {Object} eventList
   */
  _root.events = () => {
    return builder.eventList
  }

  /**
   * Reset Events
   */
  _root.resetEvents = () => {
    builder.eventList = {}
    return builder.eventList
  }

  /**
   * Async queues to add component or block
   */
  _root.elementQueue = async.queue((task, callback) => {
    const fnName = task.type === 'component'
      ? 'initComponent'
      : 'initBlock'

    _root[fnName](task.url, task.scriptPath).then(() => {
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
  _root.initElement = (element, url, scriptPath) => {
    // Get component object from js file
    // For closure purpose
    let data = {
      _id: RandomUID(),
      path: scriptPath
    }

    // Load json
    const loadJson = () => {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${scriptPath}/${element}.json`,
          type: 'GET',
          dataType: 'json',
          complete (xhr) {
            if (xhr.status === 200) {
              let json = IsJSON(xhr.responseText)
              if (json && json.id) {
                json.icon = `${scriptPath}/${json.icon}`
                data.settings = json
                resolve(data)
              } else {
                reject(new Error(`${errorMessages.invalidJSON}, url: ${scriptPath}/${element}.json`))
              }
            } else {
              reject(new Error(`${errorMessages.JSONNotfound}, url: ${scriptPath}/${element}.json`))
            }
          }
        })
      })
    }

    // Load Markup template
    const loadTemplate = () => {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${scriptPath}/${element}.html`,
          type: 'GET',
          complete (xhr) {
            if (xhr.status === 200) {
              let template = $.trim(xhr.responseText.replace(/[\t\n]+/g, ' '))
              if (template !== '') {
                resolve(template)
              } else {
                reject(new Error(`${errorMessages.invalidTemplate}, url: ${scriptPath}/${element}.html`))
              }
            } else {
              reject(new Error(`${errorMessages.TemplateNotFound}, url: ${scriptPath}/${element}.html`))
            }
          }
        })
      })
    }

    const errorLogger = err => {
      console.error(err)
    }

    const parser = new HTMLParser()

    return new Promise((resolve) => {
      loadJson()
      .catch(errorLogger)
      .then(loadTemplate)
      .catch(errorLogger)
      .then(template => {
        let html = $.parseHTML(template)
        parser.parse(html).then(output => {
          data.template = output

          // Add component to list
          builder[`${element}s`][data.settings.id] = data

          // Register script
          _root.registerScript(url, `${element}-${data.id}`)
          resolve()
        })
      })
    })
  }

  _root.initComponent = (url, scriptPath) => {
    return _root.initElement('component', url, scriptPath)
  }

  _root.initBlock = (url, scriptPath) => {
    return _root.initElement('block', url, scriptPath)
  }

  _root.getComponentList = () => {
    return builder.components
  }

  _root.getComponentItem = item => {
    if (item in builder.components) {
      return builder.components[item]
    }
  }

  _root.getBlockList = () => {
    return builder.blocks
  }

  _root.getBlockItem = item => {
    if (item in builder.blocks) {
      return builder.blocks[item]
    }
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
    if (builder[element][name]) {
      // Call before init event
      if (options.events.beforeInit) {
        options.events.beforeInit.apply(builder[element][name])
      }

      // Duplicate data that doesn't have events name
      if (options.data) {
        let data = omit(options.data, actionObjectException)
        extend(builder[element][name], data)
      }

      // Duplicate all events
      if (options.events) {
        actionObjectException.forEach(eventName => {
          if (options.events[eventName]) {
            builder[element][name][eventName] = options.events[eventName]
          }
        })
      }

      // Call after init event
      if (options.events.afterInit) {
        options.events.afterInit.apply(builder[element][name])
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

export default new UnoBuilder()
