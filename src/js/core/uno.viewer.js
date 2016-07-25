// Modules
import Vue from 'vue'
import dot from 'dot-object'
import diff from 'deep-diff'
import _ from 'underscore'
import async from 'async'
import Mousetrap from '../lib/mousetrap.min.js'
import classList from '../lib/classlist.js'
import helpers from './uno.helpers.js'

// Main Layout
import layout from '../../components/viewer/layout.vue'

/* Vue Config */
Vue.config.debug = true;

/* Animation config */
Vue.transition('appear', {
	enterClass: 'slideInDown',
	leaveClass: 'slideOutUp'
})

const classPrefix = 'uno-';
const PROPERTIES = {
	gutter: {
		value: 'medium'
	},
	display: {
		value: 'block',
		disabled: false,
		settings: {
			flex: {
				container: {
					direction: 'row',
					reverse: false,
					alignItems: 'stretch',
					alignContent: 'stretch',
					justifyContent: 'flex-start',
					wrap: true,
					reverseWrap: false
				},
				item: {
					sizing: {value: 'flexGrow', custom: {}},
					order: {value: 'auto', custom: {}},
					forceAlign: false,
					alignSelf: 'flex-start'
				}
			}
		}
	},
	position: {
		value: 'relative',
		settings: {
			absolute: {
				top: {
					value: 0,
					unit: 'px'
				},
				right: {
					value: 0,
					unit: 'px'
				},
				bottom: {
					value: 0,
					unit: 'px'
				},
				left: {
					value: 0,
					unit: 'px'
				}
			},

			fixed: {
				top: {
					value: 0,
					unit: 'px'
				},
				right: {
					value: 0,
					unit: 'px'
				},
				bottom: {
					value: 0,
					unit: 'px'
				},
				left: {
					value: 0,
					unit: 'px'
				}
			}
		}
	},
	paddingTop: {
		value: 0,
		unit: 'px'
	},
	paddingBottom: {
		value: 0,
		unit: 'px'
	},
	paddingLeft: {
		value: 0,
		unit: 'px'
	},
	paddingRight: {
		value: 0,
		unit: 'px'
	},
	marginTop: {
		value: 0,
		unit: 'px'
	},
	marginBottom: {
		value: 0,
		unit: 'px'
	},
	marginLeft: {
		value: 0,
		unit: 'px'
	},
	marginRight: {
		value: 0,
		unit: 'px'
	},
	borderTop: {
		value: 0,
		unit: 'px',
		borderStyle: 'solid',
		radius: {
			value: 0,
			unit: 'px'
		},
		color: {
			hex: '#000000',
			hsl: {
				h: 0,
				s: 0,
				l: 0,
				a: 1
			},
			hsv: {
				h: 0,
				s: 0,
				v: 0,
				a: 1
			},
			rgba: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},
			a: 1
		}
	},
	borderRight: {
		value: 0,
		unit: 'px',
		borderStyle: 'solid',
		radius: {
			value: 0,
			unit: 'px'
		},
		color: {
			hex: '#000000',
			hsl: {
				h: 0,
				s: 0,
				l: 0,
				a: 1
			},
			hsv: {
				h: 0,
				s: 0,
				v: 0,
				a: 1
			},
			rgba: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},
			a: 1
		}
	},
	borderBottom: {
		value: 0,
		unit: 'px',
		borderStyle: 'solid',
		radius: {
			value: 0,
			unit: 'px'
		},
		color: {
			hex: '#000000',
			hsl: {
				h: 0,
				s: 0,
				l: 0,
				a: 1
			},
			hsv: {
				h: 0,
				s: 0,
				v: 0,
				a: 1
			},
			rgba: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},
			a: 1
		}
	},
	borderLeft: {
		value: 0,
		unit: 'px',
		borderStyle: 'solid',
		radius: {
			value: 0,
			unit: 'px'
		},
		color: {
			hex: '#000000',
			hsl: {
				h: 0,
				s: 0,
				l: 0,
				a: 1
			},
			hsv: {
				h: 0,
				s: 0,
				v: 0,
				a: 1
			},
			rgba: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},
			a: 1
		}
	},
	width: {
		value: 'auto',
		unit: 'px',
		disabled: false
	},
	minWidth: {
		value: '',
		unit: 'px',
		disabled: false
	},
	maxWidth: {
		value: '',
		unit: 'px',
		disabled: false
	},
	height: {
		value: 'auto',
		unit: 'px',
		disabled: false
	},
	minHeight: {
		value: '',
		unit: 'px',
		disabled: false
	},
	maxHeight: {
		value: '',
		unit: 'px',
		disabled: false
	},

	/* Typography */
	fontFamily: {
		value: 'Inherit (Default)'
	},
	fontWeight: {
		value: 100
	},
	fontSize: {
		value: 14,
		unit: 'px'
	},
	fontStyle: {
		value: 'normal'
	},
	fontColor: {
		hex: '#000000',
		hsl: {
			h: 0,
			s: 0,
			l: 0,
			a: 1
		},
		hsv: {
			h: 0,
			s: 0,
			v: 0,
			a: 1
		},
		rgba: {
			r: 0,
			g: 0,
			b: 0,
			a: 1
		},
		a: 1
	},
	lineHeight: {
		value: 17,
		unit: 'px',
		disabled: false
	},
	letterSpacing: {
		value: 0,
		unit: 'px',
		disabled: false
	},
	textAlign: {
		value: 'left'
	},
	textDecoration: {
		value: 'none'
	},
	background: {
		value: 'none',
		disabled: false,
		settings: {
			color: {
				hex: '#000000',
				hsl: {
					h: 0,
					s: 0,
					l: 0,
					a: 1
				},
				hsv: {
					h: 0,
					s: 0,
					v: 0,
					a: 1
				},
				rgba: {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				},
				a: 1
			},
			image: {},
			video: {},
			gradient: {}
		}
	}
}

/* Main app */
const App = new Vue({
	el: '.body[data-id="body"]',
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
				type: 'body',
				breadcrumb: 'body',
				elements: [],
				props: {}
			},

			selected: {
				element: null,
				properties: null
			},

			hovered: {
				element: null
			},

			copiedElement: null,
			copiedElementStyle: null,
			screenView: 'large',
			loadedFonts: []
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
		 * Generate class name with uno- as prefix
		 * @param  {String} className
		 * @return {String}
		 */
		klass (className) {
			return classPrefix + className
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
		 * Load font family dynamically, check if it's google font or native
		 * @param  {Object} font
		 * @return {String}
		 */
		loadFont (font) {
			let fontFamily = font.value
			if (fontFamily.indexOf('Default')>0) {
				fontFamily = 'inherit'
			}

			if (! this.loadedFonts.includes(fontFamily)) {
				if (! helpers.NATIVE_FONTS.includes(fontFamily) && fontFamily !== 'inherit') {
					WebFont.load({
						google: {
							families: [fontFamily]
						}
					})
				}

				this.loadedFonts.push(fontFamily)
			}

			return fontFamily
		},


		/**
		 * Watch all properties for breakpoints
		 * @param  {Object} props
		 * @return {void}
		 */
		breakpointWatcher (props) {
			let properties = {}

			_.each(props, function (value, prop) {
				properties[prop] = value
			})

			return properties
		},


		/**
		 * Apply individual properties change of selected screen
		 * @param  {Object} data
		 * @param  {Object} value
		 * @param  {Object} cache
		 * @param  {String} src
		 * @param  {String} dest
		 * @return {void}
		 */
		breakpointPropApplyChange (data, value, cache, src, dest) {
			// Get diff new value and old value
			let self = this, propDiff = diff.diff(value, cache[`${data.id}-${src}`])

			// Iterate and apply new value for each properties
			if (propDiff && propDiff.length > 0) {
				_.each(propDiff, function (diff, key) {
					if (diff.path && diff.path.length > 0) {
						// Get object path
						let propValue = dot.pick(diff.path.join('.'), value)

						// Set properties
						dot.set(diff.path.join('.'), propValue, data.props[dest])

					} else if (diff.kind === 'D') {

						data.props[dest] = self.cloneObject(diff.lhs, true)

					}
				})
			}

			// Set old value cache
			cache[`${data.id}-${src}`] = self.cloneObject(value, true)
		},


		/**
		 * CSS Style watcher
		 * @param  {Object} data
		 * @return {Object}
		 */
		styleWatcher (data) {
			let self = this, obj = {}

			_.each(data.props, function (properties, breakpoint) {
				let style = {
					position: properties.position.value,

					/* Display */
					display: properties.display.value,

					/* Margin */
					marginTop: self.autoUnit(properties.marginTop),
					marginRight: self.autoUnit(properties.marginRight),
					marginBottom: self.autoUnit(properties.marginBottom),
					marginLeft: self.autoUnit(properties.marginLeft),

					/* Padding */
					paddingTop: self.autoUnit(properties.paddingTop),
					paddingRight: self.autoUnit(properties.paddingRight),
					paddingBottom: self.autoUnit(properties.paddingBottom),
					paddingLeft: self.autoUnit(properties.paddingLeft),

					/* Border */
					borderTop: self.autoUnit(properties.borderTop, false) +' '+ properties.borderTop.borderStyle + ' ' + self.rgbaColor(properties.borderTop.color),
					borderRight: self.autoUnit(properties.borderRight, false) +' '+ properties.borderRight.borderStyle + ' ' + self.rgbaColor(properties.borderRight.color),
					borderBottom: self.autoUnit(properties.borderBottom, false) +' '+ properties.borderBottom.borderStyle + ' ' + self.rgbaColor(properties.borderBottom.color),
					borderLeft: self.autoUnit(properties.borderLeft, false) +' '+ properties.borderLeft.borderStyle + ' ' + self.rgbaColor(properties.borderLeft.color),
				}


				/**
				 * Text style including:
				 * font family, font color, font style, text-align,
				 * text-decoration, etc
				 */
				style.fontFamily = self.loadFont(properties.fontFamily)
				style.fontSize = self.autoUnit(properties.fontSize)
				style.fontStyle = properties.fontStyle.value
				style.textAlign = properties.textAlign.value
				style.textDecoration = properties.textDecoration.value
				style.lineHeight = self.autoUnit(properties.lineHeight)
				style.letterSpacing = self.autoUnit(properties.letterSpacing)
				style.color = self.rgbaColor(properties.fontColor)

				/**
				 * Background
				 */
				 if (properties.background.value === 'color') {
				 	style.backgroundColor = self.rgbaColor(properties.background.settings.color)
				 }

				// Dimension
				// Width
				if (! properties.width.disabled) style.width = self.autoUnit(properties.width)
				if (! properties.minWidth.disabled) style.minWidth = self.autoUnit(properties.minWidth, true)
				if (! properties.maxWidth.disabled) style.maxWidth = self.autoUnit(properties.maxWidth, true, 'inherit')

				// Height
				style.height = self.autoUnit(properties.height)
				if (properties.minHeight.value > 0) style.minHeight = self.autoUnit(properties.minHeight, true)
				if (properties.maxHeight.value > 0) style.maxHeight = self.autoUnit(properties.maxHeight, true, 'inherit')

				// Position
				if (properties.position.value === 'absolute' || properties.position.value === 'fixed') {
					style.top = self.autoUnit(properties.position.settings[properties.position.value].top)
					style.bottom = self.autoUnit(properties.position.settings[properties.position.value].bottom)
					style.right = self.autoUnit(properties.position.settings[properties.position.value].right)
					style.left = self.autoUnit(properties.position.settings[properties.position.value].left)
				}

				// Display Properties
				if (properties.display.value === 'flex') {
					// flex-direction
					let reverse = (properties.display.settings.flex.container.reverse)? '-reverse': ''
					style.flexDirection = properties.display.settings.flex.container.direction + reverse

					// flex-wrap
					let wrap = properties.display.settings.flex.container.wrap,
					reverseWrap = properties.display.settings.flex.container.reverseWrap,
					flexWrap = ''

					if (wrap) {
						flexWrap = 'wrap'
					} else {
						flexWrap = 'nowrap'
					}

					if (reverseWrap) {
						flexWrap += '-reverse'
					}

					style.flexWrap = flexWrap

					// align-items
					style.alignItems = properties.display.settings.flex.container.alignItems
					style.justifyContent = properties.display.settings.flex.container.justifyContent
					style.alignContent = properties.display.settings.flex.container.alignContent
				}

				// Flex align-self
				if (properties.getParent().display.value === 'flex' && data.kind === 'column') {
					style.alignSelf = properties.display.settings.flex.item.alignSelf
				}

				// Style applied only for row
				if (data.kind === 'row') {
					// Set Rows display properties like it's parent
					properties.display = properties.getParent().display

					// Always set width, height and flex-grow to fill with parent
					style.flexGrow = 1
					style.width = 'auto'
					style.height = '100%'

					// Delete position and other unnecesery style
					_.each(['position',
						'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
						'marginTop', 'marginLeft', 'marginRight', 'marginBottom',
						'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
						'borderTop', 'borderLeft', 'borderRight', 'borderBottom'], function (item) {
						delete style[item]
					})
				}

				if (data.kind === 'column' && style.display === 'flex') {
					style.flexGrow = 1
				}

				// Set style by breakpoint
				obj[breakpoint] = style
			})

			return obj
		},


		/**
		 * CSS Style watcher callback
		 * @param  {Object|String|Number} value   [New Value]
		 * @param  {Object|String|Number} old   [Old Value]
		 * @return {void}
		 */
		styleHandler (value, old) {
			let self = this,
			newValue = value[self.screenView],
			oldValue = old[self.screenView]

			self.$nextTick(function () {
				// Select active element immediately
				let activeElement = self.activeElement(self.selected.element)
				self.selectOutline(activeElement)
				self.hoverOutline(activeElement, true)

				// Set outline canvas for margin
				if (newValue.marginTop !== oldValue.marginTop
				|| newValue.marginRight !== oldValue.marginRight
				|| newValue.marginBottom !== oldValue.marginBottom
				|| newValue.marginLeft !== oldValue.marginLeft) {
					self.parent().$broadcast('drawDiagonalOutline', 'margin')
				}

				// Set outline canvas for padding
				if (newValue.paddingTop !== oldValue.paddingTop
				|| newValue.paddingRight !== oldValue.paddingRight
				|| newValue.paddingBottom !== oldValue.paddingBottom
				|| newValue.paddingLeft !== oldValue.paddingLeft) {
					self.parent().$broadcast('drawDiagonalOutline', 'padding')
				}
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
			if (element && ! element.classList.contains('uno-el')) {
				element = element.querySelector('.uno-el')
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
			let offset = $(target).offset(),
			width = target.offsetWidth,
			height = target.offsetHeight

			let outline = {
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
					let containerOffset = $(target.parentElement.parentElement).offset()
					outline.$outerLeft = containerOffset.left
					outline.$outerTop = containerOffset.top
					outline.$outerWidth = target.parentElement.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.parentElement.offsetHeight
				break;

				case 'section':
					let sectionOffset = $(target.parentElement).offset()
					outline.$outerLeft = sectionOffset.left
					outline.$outerTop = sectionOffset.top
					outline.$outerWidth = target.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.offsetHeight
				break;

				case 'column':
					let columnOffset = $(target.parentElement.parentElement).offset()
					outline.$outerLeft = columnOffset.left
					outline.$outerTop = columnOffset.top
					outline.$outerWidth = target.parentElement.parentElement.offsetWidth
					outline.$outerHeight = target.parentElement.parentElement.offsetHeight
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

					let css = self.outline(target)
					if (hide) css.display = 'none'

					// Hover element
					self.$set('hovered.element', element.self.id)

					// Notify parent
					self.parent().$broadcast('elementHover', {
						css: css,
						type: element.self.type,
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

				// Check for initialization
				if (element.self) {

					// Get CSS
					let css = self.outline(target),

					// Set selected element
					selected = {
						element: element.self.id,
						properties: element.self.props,
						kind: element.self.kind
					}

					self.$set('selected', selected)

					// Set parent selected properties
					self.parent().$broadcast('selectedProperties', element.self.props)
					self.parent().$broadcast('selectedElementKind', element.self.kind)

					// Get selected breadcrumbs
					self.getBreadcrumbs(target, true, function (breadcrumbs) {

						// Get element index in element type section only
						let selectedElement = self.activeElement(element.self.id),
						elementIndex = 0

						if (element.self.type === 'section') {
							if (element.self.kind === 'container') {
								elementIndex = selectedElement.parentElement.parentElement.getAttribute('data-index')
							} else {
								elementIndex = selectedElement.parentElement.getAttribute('data-index')
							}

							// First index not allowed, increase index value
							if (elementIndex === 0) {
								elementIndex++
							}
						}


						// Notify parent to select the element
						self.parent().$broadcast('elementSelect', {
							css: css,
							id: id,
							type: element.self.type,
							childSize: element.self.elements.length,
							index: elementIndex,
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
			let elementId = event.target.getAttribute('data-id')
			if (elementId && event.target.classList.contains('uno-el')) {
				this.hoverOutline(event.target)
			}
		},

		/**
		 * On mouse leave
		 *
		 * @param  {Event} event
		 * @return {void}
		 */
		leave (event) {
			let	target = (event.target.classList.contains('uno-el'))? event.target: event.target.parentElement
			if (target.classList.contains('uno-el')) this.hoverOutline(target, true)
		},


		/**
		 * Element clicked
		 * @param  {Event} event
		 * @return {void}
		 */
		click (event) {
			let	target = (event.target.classList.contains('uno-el'))? event.target: event.target.parentElement

			// If it's an element (has properties)
			if (target.classList.contains('uno-el')) {

				// Set selected element
				this.selectOutline(target)

				// Hide hover outline
				this.hoverOutline(target, true)

			}

			// Notify to parent to hide pop Input
			this.parent().$broadcast('hidePopInput')

			// Notify to parent to hide the left panel
			this.parent().$broadcast('hideParentPanel')

			// Hide context menu
			this.parent().$broadcast('hideContextMenu')
		},


		/**
		 * Right click event, will show context menu
		 * @param  {Event} event
		 * @return {void}
		 */
		rightclick (event) {
			event.preventDefault()

			// Click hovered element
			this.eventFire(this.activeElement(this.hovered.element), 'click')

			// Notify parent to show context menu
			this.parent().$broadcast('showContextMenu', {
				top: event.pageY,
				left: event.pageX
			})
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
		 * Reselect element
		 * @return {void}
		 */
		reselectElement (selectedElement) {
			let element = selectedElement
			if (! selectedElement) {
				element = this.selected.element
			}
			this.eventFire(this.activeElement(element), 'click')
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
						let index = i

						if (root.elements[i] && root.elements[i].id === id) fn && fn({parent: root, self: root.elements[i], index: index})
						else search(root.elements[i], id, fn);
					}
				}
			}

			// Search body
			search(body, id, fn)
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

				// Clone default properties
				let props = self.cloneObject(PROPERTIES)
				props = self.setDefaultSize(props, data)

				// Copy default props to breakpoints object, each breakpoint has unique value
				data.props = {
					large: self.cloneObject(props),
					medium: self.cloneObject(props),
					small: self.cloneObject(props),
					mini: self.cloneObject(props)
				}

				// Get parent element method
				_.each(['large', 'medium', 'small', 'mini'], function (item, index) {
					data.props[item].getParent = function () {
						return element.self.props[item]
					}

					data.props[item].disableDisplayFlex = function () {
						return data.kind === 'section' && data.elements.length > 0 && data.elements[0].kind === 'container'
					}
				})

				// Element Children
				data.elements = []

				// Add Data to elements
				let index = (data.index === 0) ? data.index + 1: data.index
				element.self.elements.splice(index, 0, data)

				// Reorder Index
				self.reorderElementIndex()

				// New element
				self.findElement(data.id, function (newElement) {
					// Click immediately
					self.$nextTick(function () {
						if (newElement.self && newElement.self.breadcrumb) {
							self.reselectElement(newElement.self.id)
						}

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
					const changeTree = function (root) {
						if (root && root.elements) {
							for (let i = 0, len = root.elements.length;i<len;i++) {
								if (root.elements[i]) {
									// Change ID
									root.elements[i].id = self.generateId('el')

									// Change UID (for components)
									if (root.elements[i].uid) {
										root.elements[i].uid = root.elements[i].id + '-' + Date.now()
									}

									// Change method
									_.each(root.elements[i].props, function (props, screenView) {
										props.getParent = function () {
											return root.props[screenView]
										}
									})

									changeTree(root.elements[i])
								}
							}
						}
					}

					// Copy selected element to it's parent
					copy = self.cloneObject(element.self, true)
					copy.id = self.generateId('el')

					// Rename UID (for component)
					if (copy.uid) {
						copy.uid = self.id + '-' + Date.now()
					}

					// Change all copy's child Id
					changeTree(copy)

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

							case 'container':
								if (selectedElement.self.kind === 'section'
								&& selectedElement.self.elements.length > 0
								|| selectedElement.self.kind === 'body') return

								selectedElement.self.props.large.display.value = 'block'
								next(null, selectedElement.self, copy)
							break

							// If we copy section or container to body
							// Set parent element as body
							case 'section':
								next(null, self.body, copy)
							break;


							default:
								next(null, selectedElement.self, copy)
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

						// Change method
						_.each(copy.props, function (props, screenView) {
							props.getParent = function () {
								return parentElement.props[screenView]
							}
						})

						// Reorder index
						self.reorderElementIndex()

						// Hover immediately
						self.$nextTick(function () {
							// If there is another column
							// Re-select selected outline
							self.reselectElement()

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

				// Get next element to be selected
				self.$nextTick(function () {
					async.waterfall([

						// If there is another child select first child
						function (next) {
							if (element.parent.elements.length > 0) {
								next(true, element.parent.elements[0].id)
							} else {
								next()
							}
						},

						// If element parent is row
						// Delete row and select parent id
						// Else select parent id
						function (next) {
							if (element.parent.kind === 'row') {
								self.findElement(element.parent.id, function (element) {
									element.parent.elements.$remove(element.self)
									next(true, element.parent.id)
								})
							} else {
								next(true, element.parent.id)
							}
						}
					], function (err, nextSelectedId) {
						// Select next selected id
						self.eventFire(self.activeElement(nextSelectedId), 'click')
					})
				})
			})
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
			let element = document.querySelectorAll('.uno-el')
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
			if (_.intersection(data.accept.split(','), self.overlapElement.className.replace(new RegExp(classPrefix, 'g'), '').split(' ')).length === 0) return

			// Find Overlap Element
			self.findElement(self.overlapElement.getAttribute('data-id'), function (element) {
				// Delete Unnecessary properties
				delete data.icon
				delete data.label

				// Data manipulation, delete, add, etc
				switch (data.kind) {
					case 'column':

						// If there is element in section or container, cancel
						if (element.self.kind === 'section' && element.self.elements.length > 0) return

						// Add row
						self.addElement({
							type: 'grid',
							kind: 'row',
							child: true,
							index: 0,
							to: element.self.id
						}, function (row) {
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
										totalColumn: columnSize,
										to: row.self.id
									})
								)
							}
						})
					break;

					default:
						let uid = data.id + '-' + Date.now()
						self.addElement({
							uid: uid,
							type: 'component',
							kind: data.kind,
							child: true,
							index: 0,
							breadcrumb: data.kind,
							view: data.view,
							editable: data.editable,
							display: data.display,
							tpl_data: data.events.data,
							settings : data.settings,
							to: element.self.id
						})
					break;
				}

				// Reactivate iframe
				self.parent().$broadcast('reactivateIframe')
			})
		}
	},

	ready () {
		let self = this


		/**
		 * Window scroll observer, when change notify the parent to set canvas top position as viewer top scroll
		 * @return {void}
		 */
		window.addEventListener('scroll', function () {
			self.parent().$broadcast('scroll', document.body.getBoundingClientRect())
		})

		/**
		 * When window resize reselect element
		 * @return {void}
		 */
		window.addEventListener('resize', function () {
			self.reselectElement()
		})


		// Set body properties with responsive breakpoints
		let bodyProps = self.cloneObject(PROPERTIES)
		bodyProps.display.disabled = true

		self.$set('body.props', {
			large: self.cloneObject(bodyProps),
			medium: self.cloneObject(bodyProps),
			small: self.cloneObject(bodyProps),
			mini: self.cloneObject(bodyProps)
		})

		// Notify layout is ready
		self.selectOutline(document.querySelector('.body[data-id="body"]'))
		self.$nextTick(function () {
			self.parent().$broadcast('viewerReady')
		})


		// Component when Adding a Stylesheet
		self.$on('addCSS', function (src) {
			let css = document.createElement('link')
			css.setAttribute('href', src)
			css.setAttribute('rel', 'stylesheet')
			css.setAttribute('type', 'text/css')
			document.getElementsByTagName('head')[0].appendChild(css)
		})

		// Component Eval Function
		self.$on('evalFunction', function (id, uid, fn, parameters) {
			let params = [], excludes = ['this']
			_.each(parameters, function (param, index) {
				if (!param.includes(excludes)) {
					params.push(window[param])
				}
			})

			fn.apply($(`[data-component="${uid}"][data-kind="${id}"]`), params)
		})


		/**
		 * When new block added, add element and notify block wrapper to close
		 * @param  {Object} data  [Element Data]
		 * @return {void}
		 */
		self.$on('addBlock', function (data) {
			switch (data.kind) {
				case 'container':
					let sectionData = self.cloneObject(data)

					// Overwrite important data of container
					sectionData.kind = 'section'
					sectionData.breadcrumb = 'section'
					sectionData.accept = 'body,section'

					// Add container to section
					self.addElement(sectionData, function (section) {
						data.to = section.self.id
						self.addElement(data)
					})
					break

				default:
					self.addElement(data)
					break
			}
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
			self.eventFire(self.activeElement(breadcrumb.id), 'click')
		})


		/**
		 * When breadcrumbs in layout clicked then hovered, fire mouseover event, otherwise fire mouseleave
		 * @param  {Object} breadcrumb [Breadcrumb data]
		 * @param  {Boolean} enter   [Mouse state, over or leave]
		 * @return {void}
		 */
		self.$on('elementHover', function (breadcrumb, enter) {
			let state = (enter) ? 'mouseover': 'mouseleave'
			this.eventFire(self.activeElement(breadcrumb.id), state)
		})


		/**
		 * On change responsive size / breakpoint
		 */
		self.$on('changeScreenView', function (breakpoint) {
			self.$set('screenView', breakpoint)
			self.$broadcast('changeScreenView', breakpoint)
			self.$nextTick(function () {
				self.reselectElement()
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
		 * @param {Boolean} isHoveredElement
		 */
		self.$on('keyCapture', function (action, isHoveredElement) {
			let selectedElement = (isHoveredElement)? self.hovered.element: self.selected.element

			switch (action) {
				case 'copy':
					self.findElement(selectedElement, function (element) {
						self.$set('copiedElement', element.self.id)
					})
				break;

				case 'paste':
					if (self.copiedElement && self.copiedElement !== 'body') {
						self.copyElement(self.copiedElement)
					}
				break;

				case 'delete':
					if (selectedElement && selectedElement !== 'body') {
						self.removeElement(selectedElement)
					}
				break;

				case 'selectUp':
					if (selectedElement && selectedElement !== 'body') {
						// Find Selected element
						self.findElement(selectedElement, function (element) {
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
					if (selectedElement) {

						// Find Selected element
						self.findElement(selectedElement, function (element) {
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
					if (selectedElement) {
						self.findElement(selectedElement, function (element) {
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

				case 'copyStyle':
					self.findElement(selectedElement, function (element) {
						self.$set('copiedElementStyle', self.cloneObject(element.self.props[self.screenView], true))
					})
				break;

				case 'pasteStyle':
					if (self.copiedElementStyle && self.copiedElementStyle !== 'body') {
						self.findElement(selectedElement, function (element) {
							element.self.props[self.screenView] = self.copiedElementStyle
							self.$nextTick(function () {
								self.$set('copiedElementStyle', self.cloneObject(self.copiedElementStyle, true))
							})
						})
					}
				break;

				case 'clearStyle':
					self.findElement(selectedElement, function (element) {
						let props = self.cloneObject(PROPERTIES)
						props = self.setDefaultSize(props, element.self)

						element.self.props[self.screenView] = props
						element.self.props[self.screenView].getParent = function () {
							return element.parent.props[self.screenView]
						}
						element.self.props[self.screenView].disableDisplayFlex = function () {
							return element.self.kind === 'section' && element.self.elements.length > 0 && element.self.elements[0].kind === 'container'
						}
					})
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

		// Copy element style
		Mousetrap.bind(['ctrl+shift+c', 'command+shift+c'], function () {
			self.$emit('keyCapture', 'copyStyle')
		})

		// Paste element style
		Mousetrap.bind(['ctrl+shift+v', 'command+shift+v'], function () {
			self.$emit('keyCapture', 'pasteStyle')
		})

		// Clear element style
		Mousetrap.bind(['ctrl+shift+del', 'command+shift+del'], function () {
			self.$emit('keyCapture', 'clearStyle')
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
	}
})
