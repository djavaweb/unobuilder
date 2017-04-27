// Import important modules
import $ from 'jquery'
import async from 'async'
import ComponentParser from 'unobuilder-component-parser'
import { RandomUID } from './utils'
import { extend, omit } from 'lodash'

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
    const argsLength = args.length
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
    const argsLength = args.length
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
    const argsLength = args.length
    const eventType = args[0]
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
      const arr = eventList[eventType]
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
    const type = 'component'
    return this.addQueue(url, type)
  }

  /**
   * Uno add block to list
   * @param {String} url
   */
  addBlock (url) {
    const type = 'block'
    return this.addQueue(url, type)
  }

  /**
   * Load uno component
   *
   * @param {any} scriptPath
   * @param {any} element
   * @returns
   *
   * @memberOf UnoBuilder
   */
  loadComponent (url, element) {
    return new Promise((resolve, reject) => {
      $.get(`${ url }`, res => {
        ComponentParser(res).then(data => resolve(data))
      }).fail(() => reject(new Error(`${ errorMessages.TemplateNotfound }, url: ${ url }`)))
    })
  }

  /**
   * Uno init element (block / component)
   * @param {String} url
   */
  initElement (element, url) {
    // Get component object from js file
    // For closure purpose
    const data = {
      _id: RandomUID(),
      path: url
    }

    const errorLogger = err => console.error(err)

    const req = [
      this.loadComponent(url, element)
    ]

    return Promise.all(req)
      .catch(errorLogger)
      .then(res => {
        const { template, parsed } = res[0]
        const { script } = parsed
        const { settings, events, data: dataParsed } = script
        data.settings = settings
        data.template = template

        this.registerComponent(data.settings.id, {
          events: events,
          data: dataParsed
        })

        // Add component to list
        this.__registry__[`${ element }s`][data.settings.id] = data

        // Register script
        // this.registerScript(events, `${ element }-${ data.id }`)
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

  registerScript (string) {
    const script = document.createElement('script')
    script.onload = () => {
      script.remove()
    }
    script.innerHTML = string
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
        const data = omit(options.data, actionObjectException)
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
