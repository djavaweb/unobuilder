const CLASSPREFIX = 'uno-'

// Modules
import Vue from 'vue'
import _ from 'underscore'
import dot from 'dot-object'
import classList from '../lib/classlist.js'
import Mousetrap from '../lib/mousetrap.min.js'
import constant from '../core/uno.constant.js'

import stylesheet from '../../components/viewer/stylesheet.vue'

/* Vue Config */
Vue.config.debug = true;

/* Main app */
const App = new Vue({
	el: 'body',
	components: {stylesheet},

	/**
	 * Main Data
	 */
	data () {
		return {
			screenSize: 'large',
			activeElement: null,
			hoverElement: null,
			copiedElement: null,
			customCSS: '',
			elements: {}
		}
	},

	/**
	 * Method collections
	 * @type {Object}
	 */
    methods: {
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
		 * Generate Id with current time and random integer from 10 to 1000
		 *
		 * @param  {string} Id Prefix
		 * @return {string} Generated ID
		 */
		generateId () {
			return CLASSPREFIX + Date.now() + this.randomInt(10, 1000)
		},

        /**
		 * Generate Random Integer
		 *
		 * @param  {Number}
		 * @param  {Number}
		 * @return {Number}
		 */
		randomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		},

        /**
		 * Generate class name with uno- as prefix
		 * @param  {String} className
		 * @return {String}
		 */
		klass (className) {
			return CLASSPREFIX + className
		},

        /**
		 * Element outline
		 *
		 * @param  {ElementNode} target
		 * @return {void}
		 */
		outline (target) {
			let offset = $(target).offset(),
			width = target.offsetWidth -1,
			height = target.offsetHeight -1

			let outline = {
				$top: offset.top,
				top: 0,
				left: 0,
				$left: offset.left,
				width: `${width}px`,
				$width: width,
				height: `${height}px`,
				$height: height,
				transform: `translate(${offset.left}px, ${offset.top}px)`
			}

			switch (target.$kind) {
				/*case 'container':
					let containerOffset = $(target.$element()).offset()
					outline.$outerLeft = containerOffset.left
					outline.$outerTop = containerOffset.top
					outline.$outerWidth = target.parentElement.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.parentElement.offsetHeight
				break;

				case 'section':
					let sectionOffset = $(target.$element()).offset()
					outline.$outerLeft = sectionOffset.left
					outline.$outerTop = sectionOffset.top
					outline.$outerWidth = target.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.offsetHeight
				break;

				case 'column':
					let columnOffset = $(target.$element()).offset()
					outline.$outerLeft = columnOffset.left
					outline.$outerTop = columnOffset.top
					outline.$outerWidth = target.parentElement.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.parentElement.offsetHeight
				break;*/
			}

			return outline
		},

		/**
		 * Set default size (width & height) of an element
		 * @param {Object} props
		 * @param {Object} data
		 *
		 * @return {Object}
		 */
		setDefaultSize (props, data) {
			// Change properties of data kind
			switch (data.kind) {
				case 'column':
					let width = 100 / data.totalColumn
					props.width = {value: width, unit: '%'}
					props.minWidth = {value: '60', unit: 'px'}
					props.maxWidth = {value: '', unit: '%'}
					props.minHeight = {value: 60, unit: 'px'}
					delete data.totalColumn
				break

				case 'section':
					props.width.disabled = true
					props.minWidth.disabled = true
					props.maxWidth.disabled = true
					props.minHeight = {value: 60, unit: 'px'}
				break

				case 'container':
					props.width.disabled = true
					props.minWidth.disabled = true
					props.maxWidth.disabled = true
					props.height = {value: 100, unit: '%'}
					props.minHeight = {value: 60, unit: 'px'}
				break
			}

			return props
		},


        /**
         * Create element
         * @param  {Object} element
         * @param  {Function} ready
         * @return {Node}
         */
        createElement (element, ready) {
			let el = document.createElement(element.tag),
			id = this.generateId()

			// Add random ID

            el.setAttribute('data-id', id)
            el.$id = element.id || id
			el.$klass = []

			// Only for selectable element
			if (element.selectable === undefined) {
				element.selectable = true
			}

			let structure = this.cloneObject(element, true)
			el.$structure = structure
			this.elements[el.$id] = _.extend({
				id: el.$id
			}, el.$structure)

			if (element.selectable) {
				// Apply Attributes and Properties
				let props = this.cloneObject(constant.PROPERTIES)
				props = this.setDefaultSize(props, element)
				props.getParent = () => {
					let parent = el.$parentElement()
					if (parent) {
						return parent.$props()
					}
				}

				let properties = {
					large: this.cloneObject(props, true),
					medium: this.cloneObject(props, true),
					small: this.cloneObject(props, true),
					mini: this.cloneObject(props, true)
				}

				if (element.propsclone) {
					let elementAttributes = this.elements[element.propsclone]
					if (elementAttributes) {
						properties = this.cloneObject(elementAttributes.props, true)
					}
				}

				this.elements[el.$id].props = properties

				// Add class if element is selectable
				// Set default attributes
				el.$selectable = true
				el.$klass.push(this.klass('el'))
				el.$klass.push(this.klass('el-' + this.elements[el.$id].kind))
				el.$klass.push(this.klass('el-' + this.elements[el.$id].type))
			}

			// Set wrapper
			if (element.wrapper) {
				el.$wrap = true
				el.$klass.push(this.klass('el-wrapper'))
			}

			// Get data properties
			el.$props = (screenSize) => {
				if (! screenSize) {
					screenSize = this.screenSize
				}

				return this.elements[el.$id].props[screenSize]
			}

			// Set properties
			el.$set = (key, val, screenSize) => {
				if (!screenSize) {
					screenSize = 'large'
				}

				// If we set properties into large screen
				// All screen size will update too, so on
				if (screenSize === 'large') {
					dot.set(key, val, el.$props('large'))
				}

				// for medium
				if (['large', 'medium'].includes(screenSize)) {
					dot.set(key, val, el.$props('medium'))
				}

				// for small screen
				if (['large', 'medium', 'small'].includes(screenSize)) {
					dot.set(key, val, el.$props('small'))
				}

				// for mini screen
				if (['large', 'medium', 'small', 'mini'].includes(screenSize)) {
					dot.set(key, val, el.$props('mini'))
				}

				// ID and class
				if (['id', 'klass'].includes(key)) {
					el.$attr(key, val)
				}

				this.$nextTick(() => {
					this.$emit('elementHasChanged', true)
				})
			}

			// Set Attributes
			el.$attr = (key, value) => {
				if (key !== 'klass') {
					el.setAttribute(key, value)
				} else {
					el.setAttribute('class', value + ' ' + el.$klass.join(' '))
				}
			}


			// Get properties
			el.$get = (key, screenSize) => {
				return dot.pick(key, el.$props(screenSize))
			}

			// Traversing child elements
			el.$find = (id) => {
				let element = document.querySelector('#' + id)
				if (! element) {
					element = element.firstChild;
					while (element) {
						el.$find(element)
						element = element.nextSibling
					}
				} else {
					return element
				}
			}

			// Get breadcrumbs
			el.$breadcrumbs = () => {
				let breadcrumbs = []

				// Self element
				let element = el.$element()
				if (element) {
					breadcrumbs.push({
						id: element.$id,
						label: element.$kind
					})

					// 2nd parent element
					let parent = element.$parentElement()
					if (parent) {
						breadcrumbs.push({
							id: parent.$id,
							label: parent.$kind
						})

						// 3rd parent element
						let grandParent = parent.$parentElement()
						if (grandParent) {
							breadcrumbs.push({
								id: grandParent.$id,
								label: grandParent.$kind
							})
						}
					}
				}

				return breadcrumbs
			}

			// Kind attributes
			el.setAttribute('data-kind', this.elements[el.$id].kind)
			el.$kind = this.elements[el.$id].kind

			// Type attributes
			el.setAttribute('data-type', this.elements[el.$id].type)
			el.$type = this.elements[el.$id].type

			// Accpeted drag and drop
			el.$accept = this.elements[el.$id].accept

			// Select element
			el.$select = () => {
				if (element.selectable) {
					this.activeElement = el.$id
					this.$nextTick(() => {
						this.parent().$broadcast('elementSelect', {
							id: el.$id,
							css: this.outline(el),
							type: el.$type,
							index: 0,
							childSize: el.querySelectorAll('*').length,
							breadcrumbs: el.$breadcrumbs(),
							showBreadcrumbs: false
						})
					})
				}
			}

			// Hover element
			el.$hover = () => {
				if (element.selectable) {
					this.hoverElement = el.$id
					this.$nextTick(() => {
						this.parent().$broadcast('elementHover', {
							id: el.$id,
							css: this.outline(el),
							type: el.$type,
							breadcrumbs: el.$breadcrumbs()
						})
					})
				}
			}

			// Get tagName
			el.$tag = () => {
				return el.tagName.toLowerCase()
			}

			// Add child elements
			el.$add = (element, ready) => {
				let newElement = this.createElement(element, ready)
				el.appendChild(newElement)
			}

			// Remove element
			el.$remove = () => {
				let childs = el.$childElements()
				for (let i in childs) {
					childs[i].$remove()
				}

				delete this.elements[el.$id]
				el.remove()
			}


			// Get structure
			el.$structureTree = (clone) => {
				let structure = this.cloneObject(el.$structure, true)
				if (clone) {
					structure.propsclone = el.$id
				}

				// Delete old structure
				delete structure.append
				delete structure.prepend

				structure.elements = []

				let childs = el.$childElements(), structureChilds = []
				for (let i in childs) {
					structure.elements.push(childs[i].$structureTree(clone))
				}

				return structure
			}

			// Copy destination
			el.$copy = (to) => {
				let structure = el.$structureTree(true),
				dstElement = this.getElement(to, true),
				acceptedElement = el.$accept.split(',')

				// Only copy if accept arguments passed
				if (dstElement.$kind && acceptedElement.includes(dstElement.$kind)) {
					structure.append = dstElement
					this.createElement(structure, (newEl) => {
						newEl.$select()
					})
				}
			}

			// Change tag element
			el.$changeTag = (tag) => {
				let newElement = this.createElement({
					tag: tag,
					kind: el.$kind,
					type: el.$type
				}, ready)

				// While element has first child
				while (el.firstChild) {
					newElement.appendChild(firstChild)
				}

				// Change data attributes if any
				for (let index = el.attributes.length - 1; index >= 0; --index) {
					newElement.attributes.setNamedItem(el.attributes[index].cloneNode());
				}

				el.parentNode.replaceChild(newElement, el)
			}

			// Get actual element
			// Select only when element has class uno-el
			el.$element = (parent) => {
				let element = parent || el

				if (element.$type && element.$type === 'body') {
					return element
				}

				if (element.$wrap) {
					return element.firstChild
				} else {
					return element
				}

				return element
			}

			// Get wrapper element
			el.$wrapper = () => {
				if (el.parentElement.classList.contains(this.klass('el-wrapper'))) {
					return el.parentElement
				}
			}

			// Get element wrapper if parent element is $wrapper
			el.$elementWrapper = () => {
				let wrapper = el.$wrapper(),
				wrapperEl = el

				if (wrapper) {
					wrapperEl = wrapper
				}

				return wrapperEl
			}

			// Get next element
			el.$next = () => {
				let nextEl = el.$elementWrapper()
				if (nextEl.nextSibling && nextEl.nextSibling.$element) {
					return nextEl.nextSibling.$element()
				}
			}

			// Get previous element
			el.$prev = () => {
				let prevEl = el.$elementWrapper()
				if (prevEl.previousSibling && prevEl.previousSibling.$element) {
					return prevEl.previousSibling.$element()
				}
			}

			// Get sibling element, if there is no next / previous then,
			// select it's parent
			el.$sibling = () => {
				let siblingEl = el.$elementWrapper()

				// Get next sibling
				if (siblingEl.nextSibling) {
					siblingEl = siblingEl.nextSibling
				} else if (siblingEl.previousSibling) {
					siblingEl = siblingEl.previousSibling
				} else {
					siblingEl = el.$parentElement()
				}

				return siblingEl.$element()
			}

			// Get next Sibling
			el.$nextSibling = () => {
				let nextSibling = el.$sibling()
				return nextSibling.$next()
			}

			// Get previous sibling
			el.$prevSibling = () => {
				let prevSibling = el.$sibling()
				return prevSibling.$prev()
			}

			// Get parent element
			el.$parentElement = () => {
				let element = el.$element()
				if (element && element.parentElement) {
					if (element.parentElement.$wrap) {
						if (element.parentElement.parentElement && element.parentElement.parentElement.$element) {
							return element.parentElement.parentElement.$element()
						}
					} else {
						if (element.parentElement.$element) {
							return element.parentElement.$element()
						}
					}
				}
			}

			el.$childElements = () => {
				let childNodes = el.childNodes, children = [],
				i = childNodes.length

				while (i--) {
				    if (childNodes[i].nodeType === 1) {
				        children.unshift(childNodes[i]);
				    }
				}

				return children
			}

			// Prepend element to element.prepend value
			if (element.prepend) {
				let elementPrepend = $(element.prepend).get(0)
				elementPrepend.insertBefore(el, elementPrepend.firstChild)
			}

			// Append element to element.append value
			if (element.append) {
				$(element.append).get(0).appendChild(el)
			}

			// Finish
			this.$nextTick(() => {
				// Add custom attributes if any
				if (element.attrs) {
					for (let key in element.attrs) {
						let value = element.attrs[key]
						if (key === 'class') {
							value += ' ' + el.$klass.join(' ')
						}

						el.setAttribute(key, value)
					}
				} else {
					// Add class
					el.setAttribute('class', el.$get('klass') + ' ' + el.$klass.join(' '))
				}

				// Rehover element
				this.tryHover()

				// fire ready event
				ready && ready.call(this, el)

				// If element has child
				// Add child elements
				if (element.elements) {
					for (let i in element.elements) {
						el.$add(element.elements[i], ready)
					}
				}

				// Fire events ready
				this.$emit('elementHasChanged', true)
			})

			return el
		},

        /**
		 * Get parent window scope
		 */
		parent () {
			return window.parent.document.querySelector('#app').__vue__
		},

		/**
		 * On mouse over
		 *
		 * @param  {Event} event
		 * @return {void}
		 */
		over (event) {
			let element = event.target
			if (element.$selectable) {
				element.$hover()
			}
		},

		/**
		 * On mouse leave
		 *
		 * @param  {Event} event
		 * @return {void}
		 */
		leave (event) {

		},

		/**
		 * Element clicked
		 * @param  {Event} event
		 * @return {void}
		 */
		click (event) {
			event.target.$select()
		},

		/**
		 * Right click event, will show context menu
		 * @param  {Event} event
		 */
		rightclick (event) {
			event.preventDefault()
			event.target.$select()

			// Notify parent to show context menu
			this.$nextTick(() => {
				this.parent().$broadcast('displayContextMenu', {
					top: event.pageY,
					left: event.pageX
				})
			})
		},


		/**
		 * Update hover outline element
		 */
		tryHover () {
			if (this.hoverElement) {
				this.getElement(this.hoverElement).$hover()
			}
		},

		/**
		 * Update hover outline element
		 */
		trySelect () {
			if (this.activeElement) {
				this.getElement(this.activeElement).$select()
			}
		},

		/**
		 * Get element by id
		 * @param  {String} id
		 * @return {Node}
		 */
		getElement (id, selectOriginal) {
			let element = document.querySelector(`[data-id="${id}"]`)
			if (element) {
				if (! selectOriginal) {
					element = element.$element()
				}

				return element
			}
		}
    },

	/**
	 * Event list
	 * @type {Object}
	 */
    events: {
        addCSS () {},

		/**
		 *  On screen size change
		 */
		screenSize (size) {
			this.screenSize = size
			this.$emit('elementHasChanged', true)
		},

		/**
		 * Notify that element has been changed
		 * @param {Boolean} reselect
		 */
		elementHasChanged (reselect) {
			this.$broadcast('elementHasChanged', this.elements, this.screenSize)

			// Reselec element
			if (reselect) {
				this.$nextTick(() => {
					this.tryHover()
					this.trySelect()
				})
			}
		},


		/**
		 * element on hover by Id
		 * @param  {Object} breadcrumb
		 */
		elementHover (breadcrumb) {
			let element = this.getElement(breadcrumb.id)
			element.$hover()
		},

		/**
		 * Element on click by Id
		 * @param  {Object} breadcrumb
		 */
		elementSelect (breadcrumb) {
			let element = this.getElement(breadcrumb.id)
			element.$select()
		},

		/**
		 * Remove element by id
		 * @param  {String} id
		 */
		removeElement (id) {
			let el = this.getElement(id),
			removeEl = el.$elementWrapper()

			// Prevent delete of body element
			if (removeEl.$kind && removeEl.$kind !== 'body') {

				// Get element sibling
				let sibling = removeEl.$sibling()

				// Set hover element
				if (this.hoverElement === removeEl.$id || this.hoverElement === el.$id) {
					this.hoverElement = sibling.$id
				}

				// Remove attributes and element
				removeEl.$remove()

				// Update elements style
				this.$emit('elementHasChanged')

				// After remove, select parent element immediately
				this.$nextTick(() => {
					this.tryHover()
					sibling.$select()
				})
			}
		},

		/**
		 * Copy element by id
		 * @param  {String} id
		 * @return {}
		 */
		copyElement (id, dstId) {
			let el = this.getElement(id),
			copyEl = el.$elementWrapper(),
			parent = el.$parentElement().$id

			if (dstId) {
				parent = dstId
			}

			copyEl.$copy(parent)
		},


		/**
		 * On adding block
		 */
		addBlock (element) {
			// Exeptions for body
			if (element.append === 'body') {
				element.append = '[data-type="body"]'
			}

			/** Override attribute */
			this.createElement(element, el => {
				el.$select()
			})
		},

		/**
		 * On keyboard event binding
		 * @param {String} action
		 * @param {Boolean} isHoveredElement
		 */
		keyCapture (action, isHoveredElement) {
			let activeElement

			// Prevent to copy and remove of body element
			if (this.activeElement && this.activeElement !== 'body') {
				activeElement = this.getElement(this.activeElement)
			}

			switch (action) {
				case 'copy':
					// When user copy element, we set copy element to
					// copiedElement variable, will be used in paste
					this.copiedElement = this.activeElement
				break;

				case 'paste':
					// Prevent to copy body element, skip it
					if (this.copiedElement && this.copiedElement !== 'body') {
						let copiedElement = this.getElement(this.copiedElement),
						copyParentId = copiedElement.$parentElement().$id,
						dstElement = activeElement.$id

						// If copy element is the same with active element
						// set destination element as parent
						if (copiedElement.$id === activeElement.$id) {
							dstElement = copyParentId
						}

						// If active element has parent element such as container
						let parentElement = activeElement.$parentElement()
						if (parentElement) {
							// set destination element as parent of parent
							let activeParentId = parentElement.$id
							if (copyParentId === activeParentId) {
								dstElement = copyParentId
							}
						}

						// Roger that!
						this.$emit('copyElement', copiedElement.$id, dstElement)
						copiedElement.$select()
					}
				break;

				case 'delete':
					if (activeElement) {
						this.$emit('removeElement', activeElement.$id)
					}
				break;

				case 'selectUp':
					if (activeElement) {
						// Get previous element
						let prevEl = activeElement.$prev()

						// if active element position is at 1st, we can't move
						// to up anymore, so we move to parent element
						if (! prevEl) {
							prevEl = activeElement.$parentElement()
						}

						if (prevEl) {
							prevEl.$hover()
							prevEl.$select()
						}
					}
				break;

				case 'selectDown':
					if (activeElement) {
						// Get next element
						let nextEl = activeElement.$next()

						// if active element position is at the end, we can't move
						// to down anymore, so we move to parent element
						if (! nextEl) {
							nextEl = activeElement.$parentElement()
						}

						if (nextEl) {
							nextEl.$hover()
							nextEl.$select()
						}
					}
				break;

				case 'enter':
					if (this.activeElement) {
						// Get active element and it's child
						let activeElement = this.getElement(this.activeElement),
						firstChild = activeElement.firstChild

						// If first element is valid element, here we go!!
						if (firstChild && firstChild.$element) {
							firstChild.$element().$select()
						}
					}
				break;

				case 'copyStyle':

				break;

				case 'pasteStyle':

				break;

				case 'clearStyle':

				break;
			}
		},

		/**
		 * Save custom CSS
		 * @param  {String} css
		 */
		saveCSS (css) {
			this.customCSS = css
			this.$nextTick(() => {
				this.tryHover()
				this.trySelect()
			})
		}
    },

    ready () {
		/**
		 * Window scroll observer, when change notify the parent to set canvas top position as viewer top scroll
		 * @return {void}
		 */
		window.addEventListener('scroll', () => {
			this.parent().$broadcast('scrolling', document.body.getBoundingClientRect())
		})

		/**
		 * When window resize reselect element
		 * @return {void}
		 */
		window.addEventListener('resize', () => {
			this.tryHover()
			this.trySelect()
		})

        /**
         * Create body
         */
        this.createElement({
            prepend: document.body,
            tag: 'div',
            type: 'body',
            kind: 'body'
        }, (el) => {
			el.$set('display.disabled', true)
	        el.$select()
	        this.$nextTick(() => {
				this.parent().$broadcast('viewerReady')
			})
		})

		// Copy element
		Mousetrap.bind(['ctrl+c', 'command+c'], () => {
			this.$emit('keyCapture', 'copy')
		})

		// Paste element
		Mousetrap.bind(['ctrl+v', 'command+v'], () => {
			this.$emit('keyCapture', 'paste')
		})

		// Delete element
		Mousetrap.bind('del', () => {
			this.parent().$broadcast('clearCanvas')
			this.$emit('keyCapture', 'delete')
		})

		// Copy element style
		Mousetrap.bind(['ctrl+shift+c', 'command+shift+c'], () => {
			this.$emit('keyCapture', 'copyStyle')
		})

		// Paste element style
		Mousetrap.bind(['ctrl+shift+v', 'command+shift+v'], () => {
			this.$emit('keyCapture', 'pasteStyle')
		})

		// Clear element style
		Mousetrap.bind(['ctrl+shift+del', 'command+shift+del'], () => {
			this.$emit('keyCapture', 'clearStyle')
		})

		// Select using left and up
		Mousetrap.bind(['left', 'up'], () => {
			this.parent().$broadcast('clearCanvas')
			this.$emit('keyCapture', 'selectUp')
		})

		// Select using right and down
		Mousetrap.bind(['right', 'down'], () => {
			this.parent().$broadcast('clearCanvas')
			this.$emit('keyCapture', 'selectDown')
		})

		// Select childs using space
		Mousetrap.bind(['space', 'enter'], () => {
			this.parent().$broadcast('clearCanvas')
			this.$emit('keyCapture', 'enter')
		})

		// Detect shift keydown/keyup
		Mousetrap.bind('shift', () => {
			this.parent().$broadcast('keyCapture', 'pressShift')
		})
        Mousetrap.bind('shift', () => {
			this.parent().$broadcast('keyCapture', 'releaseShift')
		}, 'keyup')
    }
})
