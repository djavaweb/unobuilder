// Import important modules
import $ from 'jquery'
import async from 'async'
import {RandomUID} from './utils'
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

// let this.__registry__ = global.this.__registry__

/**
 * Unobuilder global framework to register components
 */
class UnoBuilder {
  constructor () {
    this.__registry__ = {
      eventList: {},
      components: {},
      blocks: {},
      url: null,
      element: null,
      builder: null,
      queue: null
    }

  /**
   * Async queues to add component or block
   */
    this.__registry__.queue = async.queue((task, next) => {
      const fn = task.type === 'component'
        ? 'initComponent'
        : 'initBlock'

      this[fn](task.url)
        .then(() => {
          next()
          task.resolve()
        })
    }, 1)
  }

  /**
   * Init builder
   * @param  {String} element
   * @return {Object}
   */
  builder (element) {
    this.__registry__.builder = element
    this.emit('prepare', element)
    return this
  }

  /**
   * get builder selector
   * @return {String}
   */
  getBuilderSelector () {
    return this.__registry__.builder
  }

  /**
   * Get builder url
   * @return {String}
   */
  getBuilderUrl () {
    return this.__registry__.url
  }

  /**
   * Uno load URL to uno canvas
   * @param {Object} options
   */
  loadCanvas (options) {
    if (options.url && options.element) {
      const registry = this.__registry__
      registry.url = options.url
      registry.element = options.element
      this.emit('init', {
        builder: registry.builder,
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
  on (...args) {
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

    const { eventList } = this.__registry__

    // eventType doesn't exist, create new one
    if (!eventList[eventType]) {
      eventList[eventType] = []
    }

    eventList[eventType].push({
      callback
    })

    return this
  }

  /**
   * Turn off event
   * @param  {String} eventType [description]
   */
  off (...args) {
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

    const { eventList } = this.__registry__

    if (eventList[eventType]) {
      delete eventList[eventType]
    }

    return this
  }

  /**
   * Uno event emitter
   * @param  {String} eventType
   * @param  {Object|String|Number|Array} variables
   */
  emit (...args) {
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

    const { eventList } = this.__registry__

    if (eventList[eventType]) {
      let arr = eventList[eventType]
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
  events () {
    return this.__registry__.eventList
  }

  /**
   * Reset Events
   */
  resetEvents () {
    let { eventList } = this.__registry__
    eventList = {}
    return eventList
  }

  addQueue (url, type) {
    return new Promise(resolve => {
      this.__registry__.queue.push({ url, type, resolve })
    })
  }

  /**
   * Uno add component to list
   * @param {String} url
   */
  addComponent (url) {
    let type = 'component'
    return this.addQueue(url, type)
  }

  /**
   * Uno add block to list
   * @param {String} url
   */
  addBlock (url) {
    let type = 'block'
    return this.addQueue(url, type)
  }

  /**
  * Load element JSON
  * @return
  */
  loadElementJson (scriptPath, element) {
    return new Promise((resolve, reject) => {
      $.getJSON(`${scriptPath}/${element}.json`, json => {
        if (json.id) {
          json.icon = `${scriptPath}/${json.icon}`
          resolve(json)
        } else {
          reject(new Error(`${errorMessages.invalidJSON}, url: ${scriptPath}/${element}.json`))
        }
      }).fail(() => reject(new Error(`${errorMessages.invalidJSON}, url: ${scriptPath}/${element}.json`)))
    })
  }

  /**
  * Load element template html
  * @return
  */
  loadElementTemplate (scriptPath, element) {
    // Load Markup template
    return new Promise((resolve, reject) => {
      $.get(`${scriptPath}/${element}.html`, res => {
        let template = $.trim(res.replace(/[\t\n]+/g, ' '))
        if (template !== '') {
          resolve(template)
        } else {
          reject(new Error(`${errorMessages.invalidTemplate}, url: ${scriptPath}/${element}.html`))
        }
      }).fail(() => reject(new Error(`${errorMessages.invalidTemplate}, url: ${scriptPath}/${element}.html`)))
    })
  }

  /**
   * Uno init element (block / component)
   * @param {String} url
   */
  initElement (element, url) {
    const scriptPath = getScriptPath(url)

    // Get component object from js file
    // For closure purpose
    let data = {
      _id: RandomUID(),
      path: scriptPath
    }

    const errorLogger = err => console.error(err)

    const parser = new HTMLParser()

    const req = [
      this.loadElementJson(scriptPath, element),
      this.loadElementTemplate(scriptPath, element)
    ]

    return Promise.all(req)
      .catch(errorLogger)
      .then(res => {
        const [json, template] = res
        data.settings = json

        let html = $.parseHTML(template)
        parser.parse(html)
          .then(output => {
            data.template = output

            // Add component to list
            this.__registry__[`${element}s`][data.settings.id] = data

            // Register script
            this.registerScript(url, `${element}-${data.id}`)
          })
      })
  }

  initComponent (url) {
    return this.initElement('component', url)
  }

  initBlock (url) {
    return this.initElement('block', url)
  }

  getComponentList () {
    return this.__registry__.components
  }

  getComponentItem (item) {
    const { components } = this.__registry__
    if (item in components) {
      return components[item]
    }
  }

  getBlockList () {
    return this.__registry__.blocks
  }

  getBlockItem (item) {
    const { blocks } = this.__registry__
    if (item in blocks) {
      return blocks[item]
    }
  }

  registerScript (url) {
    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
  }

  /**
   * Register element (block or component)
   * @param {String} name
   * @param {Object} options
   */
  registerElement (element, name, options) {
    const registry = this.__registry__
    if (registry[element][name]) {
      // Call before init event
      if (options.events.beforeInit) {
        options.events.beforeInit.apply(registry[element][name])
      }

      // Duplicate data that doesn't have events name
      if (options.data) {
        let data = omit(options.data, actionObjectException)
        extend(registry[element][name], data)
      }

      // Duplicate all events
      if (options.events) {
        actionObjectException.forEach(eventName => {
          if (options.events[eventName]) {
            registry[element][name][eventName] = options.events[eventName]
          }
        })
      }

      // Call after init event
      if (options.events.afterInit) {
        options.events.afterInit.apply(registry[element][name])
      }
    }

    return this
  }

  /**
   * Register components
   */
  registerComponent (name, options) {
    this.registerElement('components', name, options)
    return this
  }

  /**
   * Register blocks
   */
  registerBlock (name, options) {
    this.registerElement('blocks', name, options)
    return this
  }
}

global.uno = new UnoBuilder()

export default global.uno
