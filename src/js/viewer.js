// Modules
import Vue from 'vue'
import dot from 'dot-object'
import _ from 'underscore'
import Mousetrap from './mousetrap.min.js'

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
	el: 'body',
	components: {layout},
	
	data () {
		return {
			/* Drag object */
			dragging: false,
			overlapElement: null,
			clone: null,

			/* Main Object */
			body: {
				id: 'body',
				breadcrumb: 'body',
				elements: [],
				props: {}
			},

			selected: {
				properties: null,
				element: null
			},

			copiedElement: null,

			/* Default Properties */
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
			}
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
		 * Set Properties
		 * @param {String} breakpoint [Device Breakpoint]
		 * @param {String} prop       [Property name]
		 * @param {String|Number|Object|Array} value  [Properties Value]
		 */
		setProperties (breakpoint, prop, value) {
			dot.set(`${breakpoint}.${prop}`, value, this.selected.properties)
		},


		/**
		 * Get breadcrumbs (parent) from current element
		 * @param  {ElementNode} target 
		 * @param  {Boolean} withParent [Whether include parent or not]
		 * @param  {Function} fn [Callback]
		 * @return {String}
		 */
		getBreadcrumbs (target, withParent, fn) {
			let self = this,
			id = target.getAttribute('data-id'),
			kind = target.getAttribute('data-kind'),
			breadcrumbs = []

			self.findElement(id, function (element) {
				// Check for initialization, if undefined don't add breadcrumb
				if (element.self) {
					breadcrumbs.push({
						id: element.self.id,
						label: element.self.breadcrumb
					})
				}

				// remove undefined breadcrumb
				// which is element that doesn't have to show on layout selector
				// like row, etc
				breadcrumbs = _.filter(breadcrumbs, function (item) {
					return item.label !== undefined
				})


				// If with parent find again
				if (withParent && element.parent) {
					let parentElement = document.querySelector(`[data-id="${element.parent.id}"]`)
					self.getBreadcrumbs(parentElement, true, function (breadcrumb) {
						breadcrumbs.push(breadcrumb)
						breadcrumbs = _.flatten(breadcrumbs)
						fn && fn(breadcrumbs)
					})
				} else {
					// Callback
					fn && fn(breadcrumbs)
				}
			})
		},


		/**
		 * Get active element, if it's none element, select it's child
		 * @param  {String} target  [Element data-id]
		 * @return {void}
		 */
		activeElement (id) {
			// Get new element node
			let element = document.querySelector(`[data-id="${id}"]`)

			// Only accept .element, except row
			if (element.classList.contains('nonelement') && !element.classList.contains('row')) {
				element = element.querySelector('.element')
			}
			

			return element
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
				$width: offset.width,
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
			let self = this

			self.getBreadcrumbs(target, false, function (breadcrumbs) {
				let css = self.outline(target)
				if (hide) css.display = 'none'

				// Remove temporary top position
				let top = css.$top
				delete css.$width
				delete css.$top

				// Notify parent
				self.parent().$broadcast('elementHover', {
					css: css,
					breadcrumbs: breadcrumbs,
					boundTop: top
				})
			})
		},


		/**
		 * Display element outline on click/select
		 * 
		 * @param  {ElementNode} target
		 * @return {void}
		 */
		selectOutline (target) {
			let self = this,
			css = self.outline(target),
			id = target.getAttribute('data-id')

			self.findElement(id, function (element) {
				let properties

				if (element.self) {
					// Get current properties
					properties = element.self.props

					// Remove temporary top position
					let top = css.$top, width = css.$width
					delete css.$width
					delete css.$top

					// Notify parent to select the element
					self.$set('selected', {
						properties: properties,
						element: element.self.id
					})

					self.getBreadcrumbs(target, true, function (breadcrumbs) {
						self.parent().$broadcast('elementSelect', {
							css: css,
							id: id,
							properties: properties,
							breadcrumbs: breadcrumbs,
							boundTop: top,
							boundWidth: width,
							showBreadcrumbs: false
						})
					})
				}
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
		 * @param  {String} id     [Element ID]
		 * @param  {Function} fn   [Callback]
		 * @return {Object}        [target is where the element belongs, found element is the selected element]
		 */
		findElement (id, fn) {
			let body = this.body

			if (id === 'body') {
				fn && fn({parent: null,	self: body})
				return
			}


			const search = function (root) {
				if (root && root.elements) {
					for (let i = 0, len = root.elements.length;i<len;i++) {
						if (root.elements[i] && root.elements[i].id === id) fn && fn({parent: root, self: root.elements[i]})
						else search(root.elements[i], id, fn);
					}
				}
			}

			search(body, id, fn)
		},


		/**
		 * Add Element
		 *
		 * @param {Object} data [Type/Kind or etc]
		 * @param {Function} fn [Callback]
		 * @return {String}		[id of new element]
		 */
		addElement (data, fn) {
			let self = this

			// Search parent element
			self.findElement(data.to, function (element) {
				delete data.to

				// Generate new id
				data.id = self.generateId('el')

				// Copy default props to breakpoints object, each breakpoint has unique value
				data.props = self.cloneObject(self.body.props)

				// Element Children
				data.elements = []

				// Add Data to elements
				element.self.elements.splice(data.index + 1, 0, data)

				// Reorder Index
				self.reorderElementIndex()

				// New element
				self.findElement(data.id, function (newElement) {
					// Click immediately
					self.$nextTick(function () {			
						if (newElement.self && newElement.self.breadcrumb) self.eventFire(self.activeElement(newElement.self.id), 'click')

						// Callback
						fn && fn(newElement)
					})
				})
			})
		},

		/**
		 * Copy Element
		 *
		 * @param {String} id  Element Id
		 * @return {void}
		 */
		copyElement (id) {
			let self = this

			this.findElement(id, function (element) {
				let copy, copyElement

				// Copy selected element to it's parent
				copy = self.cloneObject(element.self)
				copy.id = self.generateId('el')

				// search all elements and change Id
				const changeId = function (root) {
					if (root && root.elements) {
						for (let i = 0, len = root.elements.length;i<len;i++) {
							if (root.elements[i]) {
								root.elements[i].id = self.generateId('el')
								changeId(root.elements[i]);
							}
						}
					}
				}

				// Change all copy's child Id
				changeId(copy)

				// Increment index
				copy.index += 1
				element.parent.elements.push(copy)

				// Reorder index
				self.reorderElementIndex()

				// Hover immediately
				self.$nextTick(function () {
					// Hover copy element
					self.hoverOutline(self.activeElement(copy.id))
				})
			})
		},


		/**
		 * Remove Element
		 *
		 * @param {String} id  Element Id
		 * @return {void}
		 */
		removeElement (id) {
			let self = this

			// Find element and remove it
			self.findElement(id, function (element) {

				// Remove element
				element.parent.elements.$remove(element.self)

				// Reorder index
				self.reorderElementIndex()

				self.$nextTick(function () {
					let siblingId

					// Click siblings element
					if (element.parent.elements.length>0) {
						siblingId = _.first(element.parent.elements).id
					} else {
						siblingId = element.parent.id
					}
					
					self.eventFire(self.activeElement(siblingId), 'click')
				})
			})
		},


		/**
		 * Trigger event on element
		 * @param  {ElementNode} element
		 * @param  {String} state
		 * @return {void}
		 */
		eventFire (element, state) {
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
		},


		/**
		 * Check is drag source overlap with destination element
		 * @param  {ElementNode} source [element source]
		 * @param  {ElementNode} dest   [destination element]
		 * @param  {Function} fn [Callback]
		 * @return {void}
		 */
		overlap (source, dest, fn) {
			if (source.getBoundingClientRect && dest.getBoundingClientRect) {
				let sourceRect = source.getBoundingClientRect(),
				destRect = dest.getBoundingClientRect(),
				overlap = !(sourceRect.right - (sourceRect.width/4) < destRect.left || sourceRect.left > destRect.right || sourceRect.bottom - (sourceRect.height/4) < destRect.top || sourceRect.top + 10 > destRect.bottom)

				// Callback
				if (overlap) fn && fn()
			}
		},


		/**
		 * On drag move, move the ghost element
		 * @param  {Object} coords
		 * @return {void}
		 */
		dragmove (coords) {
			let self = this,
			clone = self.clone,
			rect = clone.getBoundingClientRect(),
			x = (coords.x - (rect.width / 2)),
			y = (coords.y - (rect.height / 2))

			// Follow the cursor
			clone.style.top = y + 'px'
			clone.style.left = x + 'px'

			/**
			 * Check overlap for element
			 */
			let element = document.querySelectorAll('.element')
			for (let i in element) {
				self.overlap(clone, element[i], function () {
					self.$set('overlapElement', element[i])
					self.eventFire(element[i], 'mouseover')
				})
			}
		},


		/**
		 * Drag has ended, it's happy ending
		 * @param  {data} event
		 * @return {void}
		 */
		dragend (data) {
			let self = this, elementId

			// Remove it
			if (self.clone) {
				self.clone.remove()
				self.$set('clone', null)
			}

			// Disable dragging state
			self.$set('dragging', false)

			// Get drop element id
			if (self.overlapElement.getAttribute('data-kind')) {
				elementId = self.overlapElement.parentElement.getAttribute('data-id')
			} else {
				elementId = self.overlapElement.getAttribute('data-id')
			}

			// Data manipulation, delete, add, etc
			switch (data.kind) {
				case 'column':
					// Add row
					self.addElement({
						type: 'grid',
						kind: 'row',
						child: false,
						index: 0,
						to: elementId
					}, function (row) {
						// Delete Unnecessary properties
						delete data.icon
						delete data.label

						// Get columns width
						let width = data.width.split(',')

						for (let i in width) {
							// Clone data
							let _data = self.cloneObject(data)
							_data.width = width[i]

							// Add element to parent
							self.addElement(
								_.extend(_data, {
									child: false,
									index: 0,
									breadcrumb: _data.kind,
									to: row.self.id
								})
							)
						}
					})					
				break;
			}

			// Stop moving
			document.removeEventListener('mousemove', self.dragmove, false);
			document.removeEventListener('mouseup', self.dragend, false);
		}
	},

	ready () {
		let self = this

		// Set body properties with responsive breakpoints
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


		/**
		 * When new block added, add element and notify block wrapper to close
		 * @param  {Object} data  [Element Data]
		 * @return {void}
		 */
		self.$on('addBlock', function (data) {
			self.addElement(data)
			self.$broadcast('addedBlock')
		})


		/**
		 * Manipulate elements
		 * @param  {Object} data
		 * @return {void}
		 */
		self.$on('manipulate', function (data) {
			// Copy
			if (data.action === 'copy') self.copyElement(data.id)

			// Remove
			else if (data.action === 'remove') self.removeElement(data.id)
		})


		/**
		 * When breadcrumbs in layout clicked then click parent breadcrumb, fire click event
		 * @param  {Object} breadcrumb [Breadcrumb data]
		 * @return {void}
		 */
		self.$on('elementSelect', function (breadcrumb) {
			// check if it's wrapper or .element
			self.$nextTick(function () {
				self.eventFire(self.activeElement(breadcrumb.id), 'click')
			})
		})

		
		/**
		 * When breadcrumbs in layout clicked then hovered, fire mouseover event, otherwise fire mouseleave
		 * @param  {Object} breadcrumb [Breadcrumb data]
		 * @param  {Boolean} enter   [Mouse state, over or leave]
		 * @return {void}
		 */
		self.$on('elementHover', function (breadcrumb, enter) {
			let state = (enter) ? 'mouseover': 'mouseleave'

			// check if it's wrapper or .element
			this.eventFire(self.activeElement(breadcrumb.id), state)
		})
		

		/**
		 * Window scroll observer, when change notify the parent to set canvas top position as viewer top scroll
		 * @return {void}
		 */
		window.addEventListener('scroll', function () {
			self.parent().$broadcast('scroll', document.body.getBoundingClientRect().top)
		})


		/**
		 * On change responsive size / breakpoint
		 */
		self.$on('changeScreenView', function () {
			self.$nextTick(function () {
				self.eventFire(self.activeElement(self.selected.element), 'click')
			})
		})


		/**
		 * On dragging element from left panel
		 * @param  {Boolean} drag
		 * @param  {String} element
		 */
		self.$on('dragstart', function (drag, element) {
			if (drag) {
				// Set ghost element
				this.$set('clone', element)

				// Set style
				this.clone.style.visibility = 'hidden'
				this.clone.style.position = 'absolute'
				this.clone.style.opacity = 0
				this.clone.style.zIndex = 999
				document.body.appendChild(element)
			}
		})

		/**
		 * On drag move and drag end
		 */
		self.$on('dragmove', self.dragmove)
		self.$on('dragend', self.dragend)

		/**
		 * On keyboard event binding
		 * @param {String} action
		 */
		self.$on('keyCapture', function (action) {
			switch (action) {
				case 'copy':
					self.findElement(self.selected.element, function (element) {
						self.$set('copiedElement', element.self.id)
					})
				break;

				case 'paste':
					if (self.copiedElement && self.copiedElement !== 'body') {
						self.copyElement(self.copiedElement)
					}
				break;

				case 'delete':
					if (self.selected.element && self.selected.element !== 'body') {
						self.removeElement(self.selected.element)
					}
				break;
			}
		})

		// Copy element
		Mousetrap.bind(['ctrl+c', 'command+c'], function () {
			self.$emit('keyCapture', 'copy')
		});

		// Paste element
		Mousetrap.bind(['ctrl+v', 'command+v'], function () {
			self.$emit('keyCapture', 'paste')
		});

		// Delete element
		Mousetrap.bind('del', function () {
			self.$emit('keyCapture', 'delete')
		});
	}
})