// Modules
import Vue from 'vue'
import dot from 'dot-object'
import _ from 'underscore'

// Main Layout
import layout from '../components/viewer/layout.vue'

/* Polyfill of classList */
import classList from "./classlist.js"

/* Vue Config */
Vue.config.debug = true;

/* Animation config */
Vue.transition('appear', {
	enterClass: 'slideInDown',
	leaveClass: 'slideOutUp'
})

/* Main app */
const App = new Vue({
	el: 'html',
	components: {layout},
	
	data () {
		return {
			selectedProperties: null,
			body: {
				elements: [],
				props: {}
			},

			props: {
				display: {
					value: 'block',
					settings: {
						flex: {
							container: {
								direction: 'row',
								_reverse: false,
								alignItems: 'stretch',
								alignContent: 'stretch',
								justifyContent: 'flex-start',
								wrap: 'nowrap',
								_reverseWrap: false
							},
							item: {
								$sizing: {value: 'flexGrow', custom: {}},
								$order: {value: 'auto', custom: {}},
								alignSelf: 'flex-start'
							}
						}
					}
				}
			},
		}
	},

	methods: {
		/**
		 * Generate Id with current time and random integer from 10 to 1000
		 * 
		 * @param  {string} Id Prefix
		 * @return {string} Generated ID
		 */
		generateId (prefix) {
			prefix = prefix || ''
			return prefix + '-' + Date.now() + this.randomInt(10, 1000)
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
		 * Get parent window scope
		 */
		parent () {
			return window.parent.document.querySelector('#app').__vue__
		},


		/**
		 * Clone deep object
		 * @param  {Object} obj
		 * @return {Object}
		 */
		cloneObject (obj) {
			return JSON.parse(JSON.stringify(obj))
		},


		/**
		 * Get breadcrumbs (parent) from current element
		 * @param  {ElementNode} target 
		 * @param  {Boolean} withParent [Whether include parent or not]
		 * @return {String}
		 */
		getBreadcrumbs (target, withParent) {
			let breadcrumbs = [],
			dataBreadcrumb = 'data-breadcrumb',
			dataId = 'data-id',
			kind = target.getAttribute('data-kind'),
			breadcrumb = target.getAttribute(dataBreadcrumb),
			id = target.getAttribute(dataId)
			
			// Add current element to breadcrumbs
			breadcrumbs.push({
				id: id,
				label: breadcrumb
			})

			// Check parent
			if (withParent && target.parentElement.getAttribute && target.parentElement.getAttribute(dataBreadcrumb)) {
				let parentBreadcrumb = this.getBreadcrumbs(target.parentElement, true)
				if (kind) parentBreadcrumb.shift()
				breadcrumbs.push(parentBreadcrumb)
			}

			if (withParent) breadcrumbs = _.flatten(breadcrumbs)
			return breadcrumbs
		},

		/**
		 * Element outline
		 * 
		 * @param  {ElementNode} target
		 * @return {void}
		 */
		outline (target) {
			let offset = target.getBoundingClientRect(),
			width = target.offsetWidth,
			height = target.offsetHeight,
			bodyRect = document.body.getBoundingClientRect()
			
			return {
				$top: offset.top - bodyRect.top,
				top: 0,
				left: 0,
				transform: `translate(${offset.left}px, ${offset.top-bodyRect.top}px)`,
				width: `${width}px`,
				height: `${height}px`
			}
		},


		/**
		 * Display element outline on mouse over
		 * 
		 * @param  {ElementNode} target
		 * @param  {Boolean} hide
		 * @return {void}
		 */
		hoverOutline (target, hide) {
			let css = this.outline(target),
			breadcrumbs = this.getBreadcrumbs(target, false)

			if (hide) css.display = 'none'

			// Remove temporary top position
			let top = css.$top
			delete css.$top

			// Notify parent
			this.parent().$broadcast('elementHover', {
				css: css,
				breadcrumbs: breadcrumbs,
				boundTop: top
			})
		},


		/**
		 * Set Properties
		 * @param {String} breakpoint [Device Breakpoint]
		 * @param {String} prop       [Property name]
		 * @param {String|Number|Object|Array} value  [Properties Value]
		 */
		setProperties (breakpoint, prop, value) {
			dot.set(`${breakpoint}.${prop}`, value, this.selectedProperties)
		},


		/**
		 * Display element outline on click/select
		 * 
		 * @param  {ElementNode} target
		 * @return {void}
		 */
		selectOutline (target) {
			let css = this.outline(target), 
			breadcrumbs = this.getBreadcrumbs(target, true), properties, id

			// Since body doesn't have data-index, we select it manually
			if (target.classList.contains('body')) {
				properties = this.body.props,
				id = 'body'
			} else {
				let index = target.getAttribute('data-index')
				properties = this.body.elements[index].props
				id = this.body.elements[index].id
			}

			// Remove temporary top position
			let top = css.$top
			delete css.$top

			// Notify parent to select the element
			this.$set('selectedProperties', properties)
			this.parent().$broadcast('elementSelect', {
				css: css,
				id: id,
				properties: properties,
				breadcrumbs: breadcrumbs,
				boundTop: top,
				showBreadcrumbs: false
			})
		},


		/**
		 * On mouse over
		 *
		 * @param  {Event} event
		 * @return {void}
		 */
		over (event) {
			let	target = (event.target.classList.contains('element'))? event.target: event.target.parentElement
			if (target.classList.contains('element')) this.hoverOutline(target)
		},

		/**
		 * On mouse leave
		 * 
		 * @param  {Event} event
		 * @return {void}
		 */
		leave (event) {
			let	target = (event.target.classList.contains('element'))? event.target: event.target.parentElement
			if (target.classList.contains('element')) this.hoverOutline(target, true)
		},


		/**
		 * Element clicked
		 * @param  {Event} event
		 * @return {void}
		 */
		click (event) {
			let	target = (event.target.classList.contains('element'))? event.target: event.target.parentElement
			
			// If it's an element (has properties)
			if (target.classList.contains('element')) {

				// Hide hover outline
				this.hoverOutline(target, true)

				// Set selected element
				this.selectOutline(target)
			}
			
			// Notify to parent to hide the left panel
			this.parent().$broadcast('hideParentPanel')
		},


		/**
		 * Reordering element Index
		 * @return {void}
		 */
		reorderElementIndex () {
			_.each(this.body.elements, function (item, index) {
				item.index = index
			})
		},


		/**
		 * Find Element nested with given ID
		 * 
		 * @param  {Number} nested [How many deep is the element]
		 * @param  {String} id     [Element ID]
		 * @return {Object}        [target is where the element belongs, found element is the selected element]
		 */
		findElement (deep, id) {
			let elements = []

			// How many times element nested
			for (let i = 0; i < deep; i++) {
				elements.push('elements')
			}

			// Select elements
			let target = dot.pick('body.' + elements.join('.'), this),
			foundElement = _.findWhere(target, {id: id})

			return {
				target: target,
				found: foundElement
			}
		},


		/**
		 * Add Element
		 * 
		 * @type {Object}
		 */
		addElement (data) {
			data.id = this.generateId('el')

			// Copy default props to breakpoints object, each breakpoint has unique value
			data.props = this.cloneObject(this.body.props)

			// Element Children
			data.elements = []

			// Add Data to elements
			this.body.elements.splice(data.index + 1, 0, data)

			// Reorder Index
			this.reorderElementIndex()
		},

		/**
		 * Copy Element
		 *
		 * @param {Object} obj [Deep nested count and id]
		 * @return {void}
		 */
		copyElement (obj) {
			let searchElement = this.findElement(obj.deep, obj.id)

			// Copy selected element to it's parent
			let copy = this.cloneObject(searchElement.found)
			copy.index += 1
			searchElement.target.splice(copy.index, 0, copy)

			// Reorder index
			this.reorderElementIndex()
		},


		/**
		 * Remove Element
		 *
		 * @param {Object} obj [Deep nested count and id]
		 * @return {void}
		 */
		removeElement (obj) {
			let searchElement = this.findElement(obj.deep, obj.id)

			// Remove element
			searchElement.target.$remove(searchElement.found)
			document.body.click()

			// Reorder index
			this.reorderElementIndex()
		},


		drop (event) {
			//console.log('drop', event)
		},

		dragover (event) {
			event.preventDefault()
			//console.log('dragover', event)
		}
	},

	ready () {
		let self = this

		// Set body properties by responsive breakpoint
		self.$set('body.props', {
			large: self.cloneObject(self.props),
			medium: self.cloneObject(self.props),
			small: self.cloneObject(self.props),
			mini: self.cloneObject(self.props)
		})

		// Notify layout is ready
		document.body.click()
		self.parent().$broadcast('viewerReady', {App: this})

		// On set properties
		self.$on('setProperties', self.setProperties)

		// On add block
		self.$on('addBlock', function (data) {
			self.addElement(data)
			self.$broadcast('addedBlock')
		})

		// On copy / remove element
		self.$on('manipulate', function (data) {
			// Copy
			if (data.action === 'copy') self.copyElement(data)

			// Remove
			else if (data.action === 'remove') self.removeElement(data)
		})


		// Breadcrumbs on selects element
		self.$on('elementSelect', function (breadcrumb) {
			document.querySelector(`[data-id="${breadcrumb.id}"]`).click()
		})

		// Breadcrumbs on hover element
		self.$on('elementHover', function (breadcrumb, enter) {
			let element = document.querySelector(`[data-id="${breadcrumb.id}"]`),
			state = (enter) ? 'mouseover': 'mouseleave'

			// Support IE 9
			if (element && element.fireEvent) {
				element.fireEvent(state);
			} else {
				let event = new MouseEvent(state, {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
				element.dispatchEvent(event);
			}
		})
		

		// Scroll watcher
		window.addEventListener('scroll', function () {
			self.parent().$broadcast('scroll', document.body.getBoundingClientRect().top)
		});
	}
})