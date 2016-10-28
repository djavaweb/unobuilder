// Import important modules
const _extend = require('lodash/extend')
const _omit = require('lodash/omit')
const _each = require('lodash/each')
const utils = require('./utils.js')

// Define static vars
const rStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const rArgumentNames = /([^\s,]+)/g
const rImgPath = /(\/img\/|$img\/)/g
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
const actionObjectException = ['template', 'path', 'settings', 'beforeInit', 'afterInit', 'dragStart', 'dragMove', 'dragEnd', 'ready']

/**
 * Unobuilder global framework to register components
 */
const unoBuilder = function () {
	if (! global.__uno__) {
		global.__uno__ = {}
	}

	global.__uno__.eventList = {}
	global.__uno__.components = {}
	global.__uno__.url = null
	global.__uno__.element = null
	global.__uno__.builder = null

	const $root = this

	/**
	 * Init builder
	 * @param  {String} element
	 * @return {Object}
	 */
	$root.builder = element => {
		global.__uno__.builder = element
		$root.emit('prepare', element)
		return $root
	}

	/**
	* Uno load URL to uno canvas
	* @param {Object} options
	*/
	$root.loadCanvas = options => {
		if (options.url && options.element) {
			global.__uno__.url = options.url
			global.__uno__.element = options.element
			$root.emit('init', {builder: global.__uno__.builder, canvas: options.element})
		} else {
			throw Error(errorMessages.optionsUndefined)
		}
		return $root
	}

	/**
	* Uno event register
	* @param  {String} eventType
	* @param  {Function} fn
	*/
	$root.on = function (eventType, fn) {
        let argsLength = arguments.length, callback

        switch (argsLength) {
            case 0:
                throw Error(errorMessages.typeAndCallbackRequired);
                break

            case 1:
                throw Error(errorMessages.typeAndCallbackRequired);
                break

            case 2:
                if (typeof eventType === 'string' && typeof fn === 'function') {
                    callback = fn
                } else {
                    throw Error(errorMessages.allRequired);
                }
                break
        }

        // eventType doesn't exist, create new one
        if(!global.__uno__.eventList[eventType]) {
            global.__uno__.eventList[eventType] = []
        }

        global.__uno__.eventList[eventType].push({
            callback: callback
        })

		return $root
    }

	/**
	* Turn off event
	* @param  {String} eventType [description]
	*/
	$root.off = eventType => {
        var argsLength = arguments.length

        switch(argsLength) {
            case 0:
                throw Error(errorMessages.eventRequired)
                break

            case 1:
                if (typeof eventType !== 'string') {
                    throw Error(errorMessages.cannotBeObject)
                }
                break
        }

		if (global.__uno__.eventList[eventType]) {
			delete global.__uno__.eventList[eventType]
		}

		return $root
    }

	/**
	* Uno event emitter
	* @param  {String} eventType
	* @param  {Object|String|Number|Array} variables
	*/
	$root.emit = function (eventType, variables) {
        let argsLength = arguments.length, vars;
        const emitCallbacks = arr => {
            for (let i = 0; i < arr.length; i++) {
                arr[i].callback && arr[i].callback.call($root, vars)
            }
        }

        switch (argsLength) {
            case 0:
                throw Error(errorMessages.eventRequired)
                break
            case 2:
                vars = variables
                break
        }

        if (global.__uno__.eventList[eventType]) {
			let arr = global.__uno__.eventList[eventType];
            emitCallbacks(arr);
        }
    }

	/**
	 * Get event list
	 * @return {Object} eventList
	 */
	$root.events = () => {
        return global.__uno__.eventList;
    }

	/**
	 * Reset Events
	 */
	$root.resetEvents = () => {
        global.__uno__.eventList = {};
        return global.__uno__.eventList;
    }

	/**
	 * Uno add component
	 * @param {String} url
	 */
	$root.addComponent = url => {
		//$root.emit('addComponent', url);
		let scriptPath = url.split('/')
		scriptPath.splice(-1)
		scriptPath = scriptPath.join('/')

		// Get component object from component.js
		// For closure purpose
		let component = {
			$id: Date.now(),
			path: {
				root: scriptPath,
				img: `${scriptPath}/img/`,
				js: `${scriptPath}/js/`,
				css: `${scriptPath}/css/`
			},
		}

		// load json
		const loadJson = callback => {
			$.ajax({
				url: `${scriptPath}/component.json`,
				type: 'GET',
				dataType: 'json',
				complete (xhr) {
					// Call after init
					if (xhr.status === 200) {
						let json = utils.isJSON(xhr.responseText)
						if (json && json.id) {
							// Append component settings
							component.settings = utils.replaceDeep(json, [
								{regex: /^(img\/)/g, value: component.path.img},
								{regex: /^(js\/)/g, value: component.path.js},
								{regex: /^(css\/)/g, value: component.path.css}
							])

							callback && callback.apply(this, [json.id, component])
						} else {
							throw Error(`${errorMessages.invalidJSON}, url: ${scriptPath}/component.json`)
						}
					} else {
						throw Error(`${errorMessages.JSONNotfound}, url: ${scriptPath}/component.json`)
					}
				}
			})
		}

		// Load Markup template
		const loadTemplate = callback => {
			$.ajax({
				url: `${scriptPath}/component.html`,
				type: 'GET',
				complete (xhr) {
					// Call after init
					if (xhr.status === 200) {
						let template = $.trim(xhr.responseText.replace(/[\t\n]+/g,' '))
						if (template !== '') {
							callback && callback.apply(this, [template])
						} else {
							throw Error(`${errorMessages.invalidTemplate}, url: ${scriptPath}/component.html`)
						}
					} else {
						throw Error(`${errorMessages.TemplateNotFound}, url: ${scriptPath}/component.html`)
					}
				}
			})
		}

		// load JSON and HTML
		loadJson((componentId, component) => {
			loadTemplate(template => {
				// Add template to component
				component.template = template

				// Add component to list
				global.__uno__.components[componentId] = component

				// Register script
				$root.registerScript(url, `component-${component.$id}`)
			})
		})



		return $root
	}

	$root.getComponentList = () => {
		return global.__uno__.components
	}

	$root.registerScript = (url, registerId) => {
		let script = document.createElement('script')
		script.src = url
		document.body.appendChild(script)
	}

	/**
	 * Register component
	 * @param {String} name
	 * @param {Object} options
	 */
	$root.registerComponent = (name, options) => {
		if (global.__uno__.components[name]) {

			// Call before init event
			if (options.events.beforeInit) {
				options.events.beforeInit.apply(global.__uno__.components[name])
			}

			// Duplicate data that doesn't have events name
			if (options.data) {
				let data = _omit(options.data, actionObjectException)
				_extend(global.__uno__.components[name], data)
			}

			// Duplicate all events
			if (options.events) {
				_each(actionObjectException, (eventName) => {
					if (options.events[eventName]) {
						global.__uno__.components[name][eventName] = options.events[eventName]
					}
				})
			}

			// Call after init event
			$root.on('componentAdded', (component) => {
				if (options.events.afterInit) {
					options.events.afterInit.apply(global.__uno__.components[name])
				}
			})

			// Broadcast component has been added
			$root.emit('componentAdded', global.__uno__.components[name])
		}

		return $root
	}

	return $root
}

module.exports = new unoBuilder()
