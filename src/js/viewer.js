// Modules
import Vue from 'vue'
import dot from 'dot-object'
import _ from 'underscore'
import async from 'async'
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
				kind: 'body',
				breadcrumb: 'body',
				elements: [],
				props: {}
			},

			selected: {
				element: null,
				properties: null
			},

			copiedElement: null,
			screenView: 'large',

			/**
			 * Element properties,
			 * Rule: 
			 *
			 * > value can be string | object | array
			 * > all keys with _ as prefix will be excluded, if it's true change parent.hook, to true value, replace $var with parent.hook value
			 * > all keys with $ as prefix are object value, if value is `custom`, get custom settings
			 * > all keys with $ as suffix is array value, render by join their value, separate with delimiter, the last array is delimiter
			 * @type {Object}
			 */
			props: {
				display: {
					value: 'block',
					settings: {
						flex: {
							container: {
								direction: 'row',
								_reverse: {value: false, true: '$direction-reverse', hook: 'direction'},
								alignItems: 'stretch',
								alignContent: 'stretch',
								justifyContent: 'flex-start',
								wrap: 'nowrap',
								_reverseWrap: {value: false, true: 'wrap-reverse', hook: 'wrap'}
							},
							item: {
								$sizing: {value: 'flexGrow', custom: {}},
								$order: {value: 'auto', custom: {}},
								alignSelf: 'flex-start'
							}
						}
					}
				},
				position: {
					value: 'relative',
					settings: {
						absolute: {
							top$: [0, 'px', ''],
							right$: [0, 'px', ''],
							bottom$: [0, 'px', ''],
							left$: [0, 'px', '']
						},

						fixed: {
							top$: [0, 'px', ''],
							right$: [0, 'px', ''],
							bottom$: [0, 'px', ''],
							left$: [0, 'px', '']
						}
					}
				},
				padding: {
					value: {
						top$: [0, 'px', ''],
						right$: [0, 'px', ''],
						bottom$: [0, 'px', ''],
						left$: [0, 'px', '']
					}
				},
				margin: {
					value: {
						top$: [0, 'px', ''],
						right$: [0, 'px', ''],
						bottom$: [0, 'px', ''],
						left$: [0, 'px', '']
					}
				},
				border: {
					value: {
						top$: [[0, 'px', ''], 'solid', '#000000', ' '],
						right$: [[0, 'px', ''], 'solid', '#000000', ' '],
						bottom$: [[0, 'px', ''], 'solid', '#000000', ' '],
						left$: [[0, 'px', ''], 'solid', '#000000', ' ']
					}
				},
				width: {
					value: ['', 'px']
				},
				minWidth: {
					value: ['', 'px']
				},
				maxWidth: {
					value: ['', 'px']
				},
				height: {
					value: ['', 'px']
				},
				minHeight: {
					value: ['', 'px']
				},
				maxHeight: {
					value: ['', 'px']
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
		 * @param  {Boolean} usejQuery  whether use json or jquery method
		 * @return {Object}
		 */
		cloneObject (obj, usejQuery) {
			return (!usejQuery)? JSON.parse(JSON.stringify(obj)): $.extend(true, {}, obj)
		},


		/**
		 * Set Properties
		 * @param {String} prop       [Property name]
		 * @param {String|Number|Object|Array} value  [Properties Value]
		 */
		setProperties (prop, value) {
			let self = this
			dot.set(`${prop}`, value, self.selected.properties[self.screenView])
			self.$nextTick(function () {
				self.parent().$broadcast('changeSelectedProperties', self.cloneObject(self.selected.properties))
			})
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
			if (element && element.classList.contains('nonelement') && !element.classList.contains('row')) {
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
		outline (target, props) {
			let offset = $(target).offset(),
			width = target.offsetWidth,
			height = target.offsetHeight,
			bodyRect = document.body.getBoundingClientRect(),
			outline = {
				$top: offset.top,
				$left: offset.left,
				$width: width,
				$height: height,
				top: 0,
				left: 0,
				transform: `translate(${offset.left}px, ${offset.top}px)`,
				width: `${width}px`,
				height: `${height}px`
			}

			let kind = target.getAttribute('data-kind')
			switch (kind) {
				case 'container':
					let offset = $(target.parentElement).offset()
					outline.$outerLeft = offset.left
					outline.$outerTop = offset.top
					outline.$outerWidth = target.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.offsetHeight
				break;
			}
			
			return outline
		},


		/**
		 * Display element outline on mouse over
		 * 
		 * @param  {ElementNode} target
		 * @param  {Boolean} hide
		 * @return {void}
		 */
		hoverOutline (target, hide) {
			let self = this,
			id = target.getAttribute('data-id')

			self.findElement(id, function (element) {
				self.getBreadcrumbs(target, false, function (breadcrumbs) {
					let css = self.outline(target, element.self.props)
					if (hide) css.display = 'none'

					// Notify parent
					self.parent().$broadcast('elementHover', {
						css: css,
						breadcrumbs: breadcrumbs
					})
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
			id = target.getAttribute('data-id')

			self.findElement(id, function (element) {
				if (element.self) {
					let css = self.outline(target, element.self.props)

					// Get selected breadcrumbs
					self.getBreadcrumbs(target, true, function (breadcrumbs) {

						// Set selected element
						self.$set('selected', {
							element: element.self.id,
							properties: element.self.props
						})

						// Notify parent to select the element
						self.parent().$broadcast('changeSelectedProperties', self.cloneObject(self.selected.properties))
						self.parent().$broadcast('elementSelect', {
							css: css,
							id: id,
							breadcrumbs: breadcrumbs,
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
				fn && fn({parent: null,	self: body, deep: 1})
				return
			}

			// Seeking function
			const search = function (root) {
				if (root && root.elements) {
					for (let i = 0, len = root.elements.length;i<len;i++) {
						let deep = i + 1, index = i

						if (root.elements[i] && root.elements[i].id === id) fn && fn({parent: root, self: root.elements[i], deep: deep, index: index})
						else search(root.elements[i], id, fn);
					}
				}
			}

			// Search body
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
			data = self.cloneObject(data, true)

			// Search parent element
			self.findElement(data.to, function (element) {
				delete data.to

				// Deep
				data.deep = element.deep + 1

				// Generate new id
				data.id = self.generateId('el')

				// Copy default props to breakpoints object, each breakpoint has unique value
				data.props = self.cloneObject(self.body.props, true)

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

			async.waterfall([

				// Find copied element id
				function (next) {
					self.findElement(id, function (element) {
						next(null, element)
					})
				},

				// Clone copy and manipulate copy data
				function (element, next) {
					// search all elements and change Id
					let copy, copyElement
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

					// Copy selected element to it's parent
					copy = self.cloneObject(element.self)
					copy.id = self.generateId('el')

					// Change all copy's child Id
					changeId(copy)

					// Increment index
					copy.index += 1

					// Continue
					next(null, element, copy)
				},

				// Find if selected element is different
				function (element, copy, next) {

					self.findElement(self.selected.element, function (selectedElement) {

						// If copy element and destination can't accept, cancel it
						if ((element.self.accept !== undefined && selectedElement.self.kind !== undefined) && ! element.self.accept.includes(selectedElement.self.kind)) return

						// Check parent element
						next(null, element, selectedElement, copy)
					})
				},

				// Check parent element
				function (element, selectedElement, copy, next) {

					// If element destination is the same, set parent element as usual
					// If we selected another element after copying element, find the parent element
					if (selectedElement.self.id === element.self.id) {
						next(null, element.parent, copy)
					} else {
						switch (element.self.kind) {
							case 'column':
								// If we copy column into section or container
								if (element.self.accept.split(',').includes(selectedElement.self.kind)) {

									// And there is row element
									if (selectedElement.self.elements.length > 0 && selectedElement.self.elements[0].kind === 'row') {

										// Set parent as row
										next(null, selectedElement.self.elements[0], copy)

									} else {

										// Add new row
										self.addElement({
											type: 'grid',
											kind: 'row',
											child: true,
											index: 0,
											to: selectedElement.self.id
										}, function (row) {

											// Set parent as new row
											next(null, row.self, copy)
										})
									}
								}
							break;

							// If we copy section or container to body
							// Set parent element as body
							case 'section':
							case 'container':
								if (selectedElement.self.kind === 'body') {
									next(null, self.body, copy)
								}
							break;
						}
					}
				},


				function (parentElement, copy, next) {
					// If this is grid-column and more than 6 cancel
					if (copy.kind === 'column' && parentElement.elements.length>5) return;

					if (parentElement) {

						// Push to right element
						parentElement.elements.push(copy)

						// Reorder index
						self.reorderElementIndex()

						// Hover immediately
						self.$nextTick(function () {
							// If there is another column
							// Re-select selected outline
							self.eventFire(self.activeElement(self.selected.element), 'click')

							// Hover copy element
							self.hoverOutline(self.activeElement(copy.id))

							// Done
							next()
						})
					}
				}
			], function (err, done) {
				console.log('Copied element')
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
				overlap = !(sourceRect.right < destRect.left || sourceRect.left > destRect.right || sourceRect.bottom < destRect.top || sourceRect.top > destRect.bottom)

				// Callback
				if (overlap) fn && fn()
			}
		},


		/**
		 * On drag move, move the ghost element
		 * @param  {Object} coords
		 * @return {void}
		 */
		dragmove (coords, gutter) {
			let self = this,
			clone = self.clone,
			rect = clone.getBoundingClientRect(),
			bodyTop = document.body.getBoundingClientRect().top

			// Get coordinate
			let x = (coords.x - (rect.width / 2)) - (gutter / 2),
			y = (coords.y - (rect.height / 2)) - bodyTop

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
		 * @param  {Object} obj
		 * @return {void}
		 */
		dragend (obj) {
			let self = this,
			data = self.cloneObject(obj)

			// Stop moving earlier
			// Remove clone elements
			if (self.clone) {
				self.clone.remove()
				self.$set('clone', null)
			}

			// Disable dragging state
			self.$set('dragging', false)
			document.removeEventListener('mousemove', self.dragmove, false)
			document.removeEventListener('mouseup', self.dragend, false)

			// Cancel if acceptable drop area not valid
			if (! self.overlapElement) return
			if (_.intersection(data.accept.split(','), self.overlapElement.className.split(' ')).length === 0) return

			// Find Overlap Element
			self.findElement(self.overlapElement.getAttribute('data-id'), function (element) {

				// Data manipulation, delete, add, etc
				switch (data.kind) {
					case 'column':

						// If there is element in section or container, cancel
						if (! element.self.child && element.self.elements.length > 0) return

						// Add row
						self.addElement({
							type: 'grid',
							kind: 'row',
							child: true,
							index: 0,
							to: element.self.id
						}, function (row) {

							// Delete Unnecessary properties
							delete data.icon
							delete data.label

							// Get columns width
							let columnSize = data.size
							delete data.size

							for (let i = 0; i < columnSize; i++) {
								// Clone data
								let _data = self.cloneObject(data)

								// Add element to parent
								self.addElement(
									_.extend(_data, {
										child: true,
										index: 0,
										breadcrumb: _data.kind,
										to: row.self.id
									})
								)
							}
						})					
					break;
				}
			})
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
		self.selectOutline(document.body)
		self.$nextTick(function () {
			self.parent().$broadcast('viewerReady', this)
		})

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
		self.$on('changeScreenView', function (breakpoint) {
			self.$set('screenView', breakpoint)
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
				this.clone.classList.add('ondrag')
				this.clone.style.position = 'absolute'
				this.clone.style.visibility = 'hidden'
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

				case 'selectUp':
					if (self.selected.element && self.selected.element !== 'body') {
						// Find Selected element
						self.findElement(self.selected.element, function (element) {
							let elementId

							// Get previous element ID
							if (element.index === 0) {
								elementId = element.parent.id
							} else {
								let prevElement = element.index - 1
								elementId = element.parent.elements[prevElement].id
							}

							// Select previous element
							self.$nextTick(function () {
								self.eventFire(self.activeElement(elementId), 'click')
							})
						})
					}
				break;

				case 'selectDown':
					if (self.selected.element) {
						// Find Selected element
						self.findElement(self.selected.element, function (element) {
							let elementId

							// For body
							if (! element.parent) {
								if (element.self.elements.length > 0) {
									elementId = element.self.elements[0].id
								}
							} else {
								let nextElement = element.index + 1
								if (nextElement < element.parent.elements.length) {
									elementId = element.parent.elements[nextElement].id
								}
							}

							// Select next element
							if (elementId) {
								self.$nextTick(function () {
									self.eventFire(self.activeElement(elementId), 'click')
								})
							}
						})
					}
				break;

				case 'enter':
					if (self.selected.element) {
						self.findElement(self.selected.element, function (element) {
							if (element.self.elements.length>0) {
								let childElement

								if (element.self.elements[0].kind==='row') {
									if (element.self.elements[0].elements.length>0) {
										childElement = element.self.elements[0].elements[0].id
									}
								} else {
									childElement = element.self.elements[0].id
								}

								self.$nextTick(function () {
									self.eventFire(self.activeElement(childElement), 'click')
								})
							}
						})
					}
				break;
			}
		})


		// Copy element
		Mousetrap.bind(['ctrl+c', 'command+c'], function () {
			self.$emit('keyCapture', 'copy')
		})

		// Paste element
		Mousetrap.bind(['ctrl+v', 'command+v'], function () {
			self.$emit('keyCapture', 'paste')
		})

		// Delete element
		Mousetrap.bind('del', function () {
			self.parent().$broadcast('clearCanvas')
			self.$emit('keyCapture', 'delete')
		})

		// Select using left and up
		Mousetrap.bind(['left', 'up'], function () {
			self.parent().$broadcast('clearCanvas')
			self.$emit('keyCapture', 'selectUp')
		})

		// Select using right and down
		Mousetrap.bind(['right', 'down'], function () {
			self.parent().$broadcast('clearCanvas')
			self.$emit('keyCapture', 'selectDown')
		})

		// Select childs using space
		Mousetrap.bind(['space', 'enter'], function () {
			self.parent().$broadcast('clearCanvas')
			self.$emit('keyCapture', 'enter')
		})



		/**
		 * Watch element properties
		 */
		/*self.$watch(function () {
			return _.map(self.body.elements, function (element) {
				return _.map(element.props, function (properties, breakpoint) {
					return {
						breakpoint: breakpoint,
						properties: properties.margin.value
					}
				})
			})
		}, function (value) {
			console.log(value)
		}, {deep: true})*/
	}
})