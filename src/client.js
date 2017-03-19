// Import important modules
import $ from 'jquery'
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
class UnoBuilder {
  constructor () {
    this.__registry__ = {
      eventList: {},
      components: {},
      blocks: {},
      url: null,
      element: null,
      builder: null
    }
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

  addQueue (urls, type) {
    const fn = type === 'component'
      ? 'initComponent'
      : 'initBlock'

    const promiseUrls = urls.map(item => {
      return this[fn](item)
    })

    return Promise.all(promiseUrls)
      .then(res => {
        for (let i in res) {
          const {element, data} = res[i]
          // Add component to list
          this.__registry__[`${element}s`][data.settings.id] = data
        }
      })
  }

  /**
   * Uno add component to list
   * @param {String} url
   */
  addComponent (url) {
    let type = 'component'
    if (typeof url === 'string') url = [url]
    return this.addQueue(url, type)
  }

  /**
   * Uno add block to list
   * @param {String} url
   */
  addBlock (url) {
    let type = 'block'
    if (typeof url === 'string') url = [url]
    return this.addQueue(url, type)
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
            resolve({
              element,
              data
            })
          })
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
