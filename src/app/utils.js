const _mapValues = require('lodash/mapValues')
const _isObject = require('lodash/isObject')
const _isArray = require('lodash/isArray')
const _each = require('lodash/each')
const _map = require('lodash/map')

const classPrefix = 'uno',
cssPrefixes = ['-webkit-', '-moz-', '-ms-'],
camelPrefixes = ['Webkit', 'Moz', 'ms'],
hyphenateRE = /([a-z\d])([A-Z])/g,
importantRE = /!important;?$/,
camelizeRE = /-(\w)/g,
syntaxRE = /\$([a-zA-Z0-9_]+)/g

const utils = {
    /**
     * Generate Id with current time and random integer from 10 to 1000
     *
     * @param  {string} Id Prefix
     * @return {string} Generated ID
     */
    generateId (prefix) {
        prefix = prefix || classPrefix
        return prefix + '-' + Date.now() + this.randomInt(10, 1000)
    },

    /**
     * Generate class name with uno- as prefix
     * @param  {String} className
     * @return {String}
     */
    klass (className) {
    	return classPrefix + '-' + className
    },

    /**
     * Generate Random Integer
     * @param  {Number} min
     * @param  {Number} max
     * @return {Number}
     */
    randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },

    /**
	 * Clone deep object
	 * @param  {Object} obj
	 * @param  {Boolean} usejQuery  whether use json or jquery method
	 * @return {Object}
	 */
	cloneObject (obj, usejQuery) {
		return (!usejQuery)? JSON.parse(JSON.stringify(obj)): $.extend(true, {}, obj)
	},

    /**
     * Add event listener crossbrowser
     * @param {ElementNode} element
     * @param {String} event
     * @param {Function} fn
     */
    addEvent (element, event, fn) {
        if (element.addEventListener) {
            fn && element.addEventListener(event, fn, false)
        } else {
            element.attachEvent('on' + event, function() {
                fn && fn.call(element, window.event)
            })
        }
    },

    /**
     * Remove event listener crossbrowser
     * @param {ElementNode} element
     * @param {Function} fn
     */
    removeEvent (element, event, fn) {
        if (element.addEventListener) {
            element.removeEventListener(event, fn)
        } else {
            element.detachEvent('on' + event, fn)
        }
    },

    /**
     * Get Vue Object reference
     * @param str
     * @return
     */
    ref (obj, str, el) {
        let retval = obj

        /**
         * Get reference by string
         */
        if (str) {
            // Split string
            let refList = str.replace(/\[(\w+)\]/g, '.$1')
            .replace(/^\./, '')
            .split('.')

            for (let i in refList) {
                if (refList[i] in retval.$refs) {
                    retval = retval.$refs[refList[i]]
                } else {
                    retval = undefined
                }
            }
        }

        // Get element reference
        if (retval && el && retval.$els[el]) {
            retval = retval.$els[el]
        }

        return retval
    },

    /**
     * Convert NaN to auto
     * @param  {Number} int
     * @param  {Boolean} useAuto
     * @param  {Number|String} defaultValue
     *
     * @return {void}
     */
    autoUnit (value, useAuto, defaultValue) {
        if (isNaN(parseFloat(value.value))) {
            useAuto = (useAuto === undefined)? true: useAuto
            let autoExceptions = ['maxHeight']

            if (useAuto) {
                if (defaultValue) return defaultValue
                return 'auto'
            }
            return 0 + value.unit
        }

        let parsedValue = ((value.value).toString().indexOf('.') > 0)? parseFloat(value.value): parseInt(value.value)
        return parsedValue + value.unit
    },

    /**
     * Auto value
     * @param  {Number|String} value
     * @return {String}
     */
    autoValue (value, unit, delimiter = '') {
        if (value === '' || isNaN(parseInt(value)) || isNaN(parseFloat(value))) {
            return 'auto'
        }

        return value + delimiter + unit
    },

    /**
     * Render rgba color
     * @param  {colors} value
     * @return {void}
     */
    rgbaColor (value) {
        if (value.rgba.a < 1) {
            return `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
        }

        return value.hex
    },

    /**
     * Sanitize CSS property name
     * @param  {String} prop
     * @return {Object}
     */
    cssPrefixer (prop) {
        prop = prop.replace(hyphenateRE, '$1-$2').toLowerCase()

        let camel = prop.replace(camelizeRE, function (_, c) {
            return c ? c.toUpperCase() : ''
        }),
        upper = camel.charAt(0).toUpperCase() + camel.slice(1),
        testEl = document.createElement('div'),
        i = cssPrefixes.length, prefixed

        if (camel !== 'filter' && (camel in testEl.style)) {
            return {kebab: prop, camel: camel}
        }

        while (i--) {
            prefixed = camelPrefixes[i] + upper
            if (prefixed in testEl.style) {
                return {
                    kebab: cssPrefixes[i] + prop,
                    camel: prefixed
                }
            }
        }
    },


    /**
	 * Capitalize string
	 * @param  {String} str
	 * @param  {Boolean} all
	 * @return {String}
	 */
	capitalize (str, all = true) {
        if (! all) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }

		return str.replace(/\b[a-z]/g, letter => letter.toUpperCase())
	},

    /**
     * Convert string into slug
     * @param  {String} str
     * @return {String}
     */
	slugify (str) {
		return str.toLowerCase()
		.replace(/(^\s*|\s*$)/g, '')
		.replace(/[\._\s]+/g, '-')
		.replace(/([A-Z])/g, '-$1')
		.replace(/-+/g, '-')
	},

    /**
     * Convert slugify into humanize format
     * @param  {String} str [description]
     * @return {String}
     */
	humanize (str) {
		return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
		.replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
		.replace(/[-\s]+/g, '_')
		.toLowerCase()
		.replace(/_id$/,'')
		.replace(/_/g, ' ')
	},

    /**
     * Camelize string from slug or underscore
     * @param  {String} str
     * @return {String}
     */
    camelize (str) {
        return str.replace(/(^\s*|\s*$)/g, '').replace(/(\-|_|\s)+(.)?/g, (mathc, sep, c) => {
            return (c ? c.toUpperCase() : '')
        })
    },

    /**
	* Current Script Data last path and init id
	*/
	lastScriptInitId () {
		let scripts = document.querySelectorAll('script[src]'),
        script = scripts[scripts.length - 1],
        initId = script.getAttribute('data-uno-register-id')
		return initId
	},

    /**
     * Check if json is valid
     * @param  {String}  json
     * @param  {String}  message
     * @return {Boolean}
     */
    isJSON (json, message = 'Invalid JSON') {
        try {
            return JSON.parse(json)
        } catch (e) {
            throw Error(message)
        }
    },

    /**
     * Replace object deep
     * @param {Object} object
     * @param {Array} replace
     * @return {Object}
     */
    replaceDeep (obj, replace) {
        const replaceItem = (_item) => {
            _each(replace, (obj) => {
                _item = _item.replace(obj.regex, obj.value)
            })

            return _item
        }

        return _mapValues(obj, (item) => {
            if (typeof item === 'string') {
                item = replaceItem(item)
            } else if (_isArray(item)) {
                item = _map(item, (value) => replaceItem(value))
            } else if (_isObject(item)) {
                item = this.replaceDeep(item, replace)
            }
            return item
        })
    },

    /**
     * Reset object by type
     * @param {Object} object
     */
    resetObject (object) {
        for (let i in object) {
            switch (typeof object[i]) {
                case 'string':
                    object[i] = ''
                break

                case 'number':
                    object[i] = 0
                break

                case 'boolean':
                    object[i] = false
                break
            }
        }
    },
}

module.exports = utils
