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
  if (!global.__uno__) global.__uno__ = {}

  global.__uno__ = {
    eventList: {},
    components: {},
    blocks: {},
    url: null,
    element: null,
    builder: null
  }

  const builder = global.__uno__

  /**
   * Init builder
   * @param  {String} element
   * @return {Object}
   */
  this.builder = element => {
    builder.builder = element
    this.emit('prepare', element)
    return this
  }

  /**
   * get builder selector
   * @return {String}
   */
  this.getBuilderSelector = () => {
    return builder.builder
  }

  /**
   * Get builder url
   * @return {String}
   */
  this.getBuilderUrl = () => {
    return builder.url
  }

  /**
   * Uno load URL to uno canvas
   * @param {Object} options
   */
  this.loadCanvas = options => {
    if (options.url && options.element) {
      builder.url = options.url
      builder.element = options.element
      this.emit('init', {
        builder: builder.builder,
        canvas: options.element
      })
    } else {
      throw new Error(errorMessages.optionsUndefined)
    }
    return this
  }

  /**
   * Uno event register
   * @param  {String} eventType
   * @param  {Function} fn
   */
  this.on = (...args) => {
    let argsLength = args.length
    let eventType
    let fn
    let callback

    switch (argsLength) {
      case 0:
        throw new Error(errorMessages.typeAndCallbackRequired)

      case 1:
        throw new Error(errorMessages.typeAndCallbackRequired)

      case 2:
        eventType = args[0]
        fn = args[1]
        if (typeof eventType === 'string' && typeof fn === 'function') {
          callback = fn
        } else {
          throw new Error(errorMessages.allRequired)
        }
        break
    }

    // eventType doesn't exist, create new one
    if (!builder.eventList[eventType]) {
      builder.eventList[eventType] = []
    }

    builder.eventList[eventType].push({
      callback
    })

    return this
  }

  /**
   * Turn off event
   * @param  {String} eventType [description]
   */
  this.off = (...args) => {
    let argsLength = args.length
    let eventType

    switch (argsLength) {
      case 0:
        throw new Error(errorMessages.eventRequired)

      case 1:
        eventType = args[0]
        if (typeof eventType !== 'string') {
          throw new Error(errorMessages.cannotBeObject)
        }
        break
    }

    if (builder.eventList[eventType]) {
      delete builder.eventList[eventType]
    }

    return this
  }

  /**
   * Uno event emitter
   * @param  {String} eventType
   * @param  {Object|String|Number|Array} variables
   */
  this.emit = (...args) => {
    let argsLength = args.length
    let eventType = args[0]
    let variables
    let vars

    switch (argsLength) {
      case 0:
        throw new Error(errorMessages.eventRequired)
      case 2:
        variables = args[1]
        vars = variables
        break
    }

    if (builder.eventList[eventType]) {
      let arr = builder.eventList[eventType]
      // emit callback
      for (let i = 0; i < arr.length; i++) {
        arr[i].callback && arr[i].callback.call(this, vars)
      }
    }
  }

  /**
   * Get event list
   * @return {Object} eventList
   */
  this.events = () => {
    return builder.eventList
  }

  /**
   * Reset Events
   */
  this.resetEvents = () => {
    builder.eventList = {}
    return builder.eventList
  }

  /**
   * Async queues to add component or block
   */
  this.elementQueue = async.queue((task, next) => {
    const fnName = task.type === 'component'
      ? 'initComponent'
      : 'initBlock'

    this[fnName](task.url)
      .then(() => {
        next()
        task.resolve()
      })
  }, 1)

  this.addQueue = (url, type) => {
    return new Promise(resolve => {
      this.elementQueue.push({ url, type, resolve })
    })
  }

  /**
   * Uno add component to list
   * @param {String} url
   */
  this.addComponent = url => {
    let type = 'component'
    return this.addQueue(url, type)
  }

  /**
   * Uno add block to list
   * @param {String} url
   */
  this.addBlock = url => {
    let type = 'block'
    return this.addQueue(url, type)
  }

  /**
   * Uno init element (block / component)
   * @param {String} url
   */
  this.initElement = (element, url) => {
    const scriptPath = getScriptPath(url)

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

    const errorLogger = err => console.error(err)

    const parser = new HTMLParser()

    return new Promise(resolve => {
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
          this.registerScript(url, `${element}-${data.id}`)
          resolve()
        })
      })
    })
  }

  this.initComponent = url => {
    return this.initElement('component', url)
  }

  this.initBlock = url => {
    return this.initElement('block', url)
  }

  this.getComponentList = () => {
    return builder.components
  }

  this.getComponentItem = item => {
    if (item in builder.components) {
      return builder.components[item]
    }
  }

  this.getBlockList = () => {
    return builder.blocks
  }

  this.getBlockItem = item => {
    if (item in builder.blocks) {
      return builder.blocks[item]
    }
  }

  this.registerScript = url => {
    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
  }

  /**
   * Register element (block or component)
   * @param {String} name
   * @param {Object} options
   */
  this.registerElement = (element, name, options) => {
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

    return this
  }

  /**
   * Register components
   */
  this.registerComponent = (name, options) => {
    this.registerElement('components', name, options)
    return this
  }

  /**
   * Register blocks
   */
  this.registerBlock = (name, options) => {
    this.registerElement('blocks', name, options)
    return this
  }

  return this
}

window.uno = new UnoBuilder()

export default window.uno
