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
	eventRequired: 'An event type must be specified',
	cannotBeObject: 'An event type cannot be an Object',
	typeAndCallbackRequired: 'Event type and callback must be specified',
	allRequired: 'Event type, route and callback function must be specified',
	JSONNotfound: 'component.json not found',
	invalidJSON: 'Your JSON is invalid',
	optionsUndefined: 'Options Undefined'
}
const actionObjectException = ['path', 'settings', 'beforeInit', 'afterInit', 'dragStart', 'dragMove', 'dragEnd', 'ready']

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
	const $root = this

	/**
	* Uno load URL or uno initialization
	* @param {Object} options
	*/
	$root.loadUrl = (options) => {
		if (options.url && options.element) {
			global.__uno__.url = options.url
			global.__uno__.element = options.element
			$root.emit('init', options.element)
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
	$root.off = function (eventType) {
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
        var argsLength = arguments.length, vars;
        var emitCallbacks = function (arr) {
            for (var i = 0; i < arr.length; i++) {
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
			var arr = global.__uno__.eventList[eventType];
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
	$root.addComponent = (url) => {
		//$root.emit('addComponent', url);
		let scriptPath = url.split('/')
		scriptPath.splice(-1)
		scriptPath = scriptPath.join('/')

		// Get component object from component.js
		// For closure purpose
		let componentObj = {
			path: {
				root: scriptPath,
				img: `${scriptPath}/img/`,
				js: `${scriptPath}/js/`,
				css: `${scriptPath}/css/`
			}
		}

		// load json
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
						componentObj.settings = utils.replaceDeep(json, [
							{regex: /^(img\/)/g, value: componentObj.path.img},
							{regex: /^(js\/)/g, value: componentObj.path.js},
							{regex: /^(css\/)/g, value: componentObj.path.css}
						])

						// Add component to list
						global.__uno__.components[json.id] = componentObj

						// Register script
						$root.registerScript(url)
					} else {
						throw Error(errorMessages.invalidJSON)
					}
				} else {
					throw Error(errorMessages.JSONNotfound)
				}
			}
		})

		return $root
	}

	$root.getComponentList = () => {
		return global.__uno__.components
	}

	$root.registerScript = (url) => {
		let script = document.createElement('script'),
		tagId = utils.generateId('component')
		script.src = url
		script.setAttribute('data-uno-register-id', tagId)
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
