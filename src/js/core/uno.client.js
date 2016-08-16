/**
 * Unobuilder global framework to register components
 */

var uno = (function unobuilder () {
	'use strict';
	var _root = this,

	/**
	 * Regex
	 */
 	rStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
	rArgumentNames = /([^\s,]+)/g;

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
		return scriptSrc.replace(path, '' );
	}


	/**
	 * Unobuilder Components
	 */
	function component () {
		var self = this;
		self.list = [];

		/**
		 * Add component into list
		 * @param {Objects} objects
		 */
		self.add = function (objects) {
			var path = {}
			path.root = componentPath()
			path.icon = path.root + 'icon/',
			path.css = path.root + 'css/'
			path.js = path.root + 'js/'
			path.json = path.root + 'component.json'
			path.template = path.root + 'component.html'

			// Get package information
			$.getJSON(path.json, function (json) {
				var componentObj = {
					info: json,
					path: path
				}

				if (objects.methods) {
					componentObj.methods = objects.methods
				}

				if (objects.data) {
					componentObj.data = objects.data
				}

				if (objects.events) {
					componentObj.events = objects.events
				}

				self.list.push(componentObj)
			})

			// Get template
			$.get(path.template, function (response) {
				console.log('response', response)
			})
		};

		return self
	};


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
	}


	/* Register instance */
	_root.viewer = null
	_root.component = new component();
	_root.utils = new utils();
	return _root
}).call(this)

module.exports = uno
