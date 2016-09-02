/**
 * Unobuilder global framework to register components
 */

var uno = (function unobuilder () {
	'use strict';
	var _root = this, eventList = {},

	// Regex
 	rStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
	rArgumentNames = /([^\s,]+)/g,

	// Text
	TEXT = {

	};

	/* Register instance */
	_root.viewer = null
	_root.component = new component();
	_root.utils = new utils();
	_root.list = {};
	_root.on = on;
	_root.off = off;
	_root.emit = emit;
	_root.events = events;
	_root.resetEvents = resetEvents;

	/* Defalut Events */
	_root.on('initComponent', function (componentPath) {
		var path = {}
		path.root = componentPath
		path.img = path.root + 'img/',
		path.css = path.root + 'css/'
		path.js = path.root + 'js/'
		path.json = path.root + 'component.json'
		path.template = path.root + 'component.html'

		// Get package information
		$.getJSON(path.json, function (data) {
			if (data.id) {
				var componentObj = {}
				componentObj.info = data
				componentObj.path = path

				// Get template
				$.get(path.template, function (response) {
					if (response) {
						componentObj.template = response
					}

					_root.emit('addComponentObject', {
						id: data.id,
						obj: componentObj,
						ready: true
					})
				})
			}
		})
	})

	_root.on('addComponentObject', function (component) {
		if (component) {
			if (! _root.list[component.id]) {
				_root.list[component.id] = {}
			}

			for (var key in component.obj) {
				_root.list[component.id][key] = component.obj[key]
			}

			if (component.ready) {
				_root.emit('addComponent', _root.list[component.id])
			}
		}
	})

	/**
	* Current Script Path
	*
	* Get the dir path to the currently executing script file
	* which is always the last one in the scripts array with
	* an [src] attr
	*/
	function componentPath () {
		var scripts = document.querySelectorAll('script[src]'),
		scriptSrc = scripts[scripts.length - 1].src,
		path = scriptSrc.split( '/' );

		path = path[path.length - 1];
		path = scriptSrc.replace(path, '' );

		return path
	}


	/**
	 * Unobuilder Utils
	 */
	function utils () {
		var self = this

		/**
		 * Get function params
		 * @param  {Function} fn
		 * @return {Array}
		 */
		self.getParams = function (fn) {
			var func = fn.toString().replace(rStripComments, ''),
			params = func.slice(func.indexOf('(') + 1, func.indexOf(')')).match(rArgumentNames);

			if(params === null)	params = [];
			return params;
		}

		self.lastScriptPath = componentPath
	}


	/**
	 * Unobuilder Components
	 */
	function component () {
		var self = this;

		/**
		 * Add component into list
		 * @param {Objects} objects
		 */
		self.add = function (id, objects) {
			var componentObj = {}
			if (objects.methods) {
				componentObj.methods = objects.methods
			}

			if (objects.data) {
				componentObj.data = objects.data
			}

			if (objects.events) {
				componentObj.events = objects.events
			}

			_root.emit('addComponentObject', {
				id: id,
				obj: componentObj
			})
		};

		return self
	};

	/**
	 * Uno event register
	 * @param  {String} eventType
	 * @param  {Function} fn
	 */
	 function on (eventType, fn) {
        var argsLength = arguments.length, callback;

        switch (argsLength) {
            case 0:
                throw Error("Event type and callback must be specified");
                break;

            case 1:
                throw Error("Event type and callback must be specified");
                break;

            case 2:
                if (typeof eventType === 'string' && typeof fn === 'function') {
                    callback = fn;
                } else {
                    throw Error("Event type, route and callback function must be specified");
                }
                break;
        }

        // eventType doesn't exist, create new one
        if(!eventList[eventType]) {
            eventList[eventType] = [];
        }

        eventList[eventType].push({
            callback: callback
        });
    }

	/**
	 * Turn off event
	 * @param  {String} eventType [description]
	 */
    function off (eventType) {
        var argsLength = arguments.length;

        switch(argsLength) {
            case 0:
                throw Error('An event type must be specified');
                break;
            case 1:
                if (typeof eventType !== 'string') {
                    throw Error('An event type cannot be an Object');
                }
                break;
        }

		if (eventList[eventType]) {
			delete eventList[eventType]
		}
    }

	/**
	 * Uno event emitter
	 * @param  {String} eventType
	 * @param  {Object|String|Number|Array} variables
	 */
    function emit (eventType, variables) {
        var argsLength = arguments.length, vars;
        var emitCallbacks = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].callback && arr[i].callback.call(_root, vars);
            }
        }

        switch (argsLength) {
            case 0:
                throw Error('An event type must be specified');
                break;
            case 2:
                vars = variables;
                break;
        }

        if (eventList[eventType]) {
			var arr = eventList[eventType];
            emitCallbacks(arr);
        }
    }

	/**
	 * Get event list
	 * @return {Object} eventList
	 */
    function events () {
        return evenList;
    }

	/**
	 * Reset Events
	 */
    function resetEvents () {
        evenList = {};
        return evenList;
    }

	return _root
}).call(this)

module.exports = uno
