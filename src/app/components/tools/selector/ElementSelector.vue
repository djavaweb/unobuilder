<template lang="pug">
.element-selector-wrapper(v-if="state!==''")

	// Hover element selector
	.element-selector-tools.hover(
	:class="{orange: dragElementOrComponent}",
	:style="hoverStyle",
	v-if="isHover()",
	v-el:hover
	)
		breadcrumb(
		:class="hoverClass",
		:list="[hover.breadcrumbs[0]]",
		v-ref:hover-breadcrumb
		)
	// End of hover element selector

	// Select element selector
	.element-selector-tools.selected(
	:class="{remove: select.removeOver}",
	:style="select.css",
	v-if="isSelect()",
	v-el:select
	)
		breadcrumb(
		:class="selectClass",
		:list="select.breadcrumbs",
		state="select",
		v-ref:select-breadcrumb
		)

		// Element Resizer
		.resizer(v-if="isResizable()")
			.resizer-h.resizer-h--r(
			v-if="isElementResizable('width')",
			:class="{active: isDragDirection('right')}",
			@mousedown="resizeElement($event, 'right')"
			)

			.resizer-h.resizer-h--l(
			v-if="isElementResizable('width')",
			:class="{active: isDragDirection('left')}",
			@mousedown="resizeElement($event, 'left')"
			)

			.resizer-v.resizer-v--t(
			v-if="isElementResizable('height')",
			:class="{active: isDragDirection('top')}",
			@mousedown="resizeElement($event, 'top')"
			)

			.resizer-v.resizer-v--b(
			v-if="isElementResizable('height')",
			:class="{active: isDragDirection('bottom')}",
			@mousedown="resizeElement($event, 'bottom')"
			)
		// End of element resizer
	// End of select element selector

	// Drop line
	.dropline(v-if="isHover() && dragElementOrComponent")
		.dropline__x(:style="droplineX")
			.dropline__x-triangle.dropline__x-triangle--left
			.dropline__x-triangle.dropline__x-triangle--right

	// Element Overlay
	.element-overlay(v-if="isHover() && dragElement", :style="dragOverlay")
</template>

<script>
import _last from 'lodash/last'
import breadcrumb from './Breadcrumb.vue'

const droplineMargin = 5
export default {
	name: 'elementSelector',
	components: {
		breadcrumb
	},

	data () {
		return {
			hover: {},
			select: {},
			dropline: {}
		}
	},

	computed: {
		activeElement () {
			if (this.select.id) {
				return this.getElementById(this.select.id)
			}
		},

		elementKind () {
			if (this.activeElement) {
				return this.activeElement.$kind
			}
		},

		elementType () {
			if (this.activeElement) {
				return this.activeElement.$type
			}
		},

		hoverClass () {
            let klass = ['hover']

			// If breadcrumbs exist
			if (this.hover.breadcrumbs.length>0) {
				// If hover at top elements
				if (this.hover.css.$top < 30) {
					klass.push('top')
				}

				// If hover on body element
				if (this.hover.breadcrumbs[0].label === 'body') {
					klass.push('body')
				}
			}

			return klass
		},

		hoverStyle () {
			let style = this.hover.css

			// If it's dragging element and dropline is in bottom
			if (this.dragElementOrComponent && this.dropline.css) {
				if (this.dropline.position === 'bottom') {
					style.height = `${style.$height + droplineMargin}px`
				}
			}

			return style
		},

		selectClass () {
			let klass = ['select']

			if (this.select.breadcrumbs) {
				// If select top element
				if (this.select.css.$top < 30) {
					klass.push('top')
				}

				// If select body
				if (this.select.breadcrumbs[0].label === 'body') {
					klass.push('body')
				}

				// If element is small
				if (this.select.css.$width<235) {
					klass.push('small')
				}

				// If show breadcrumbs
				if (this.select.showBreadcrumbs) {
					klass.push('view')
				}
			}

			return klass
		},

		dragComponent () {
			return this.$root.ref('leftPanel').dragComponent
		},

		dragElement () {
			return this.$root.canvasBuilder().layout().dragElementState.move
		},

		dragElementOrComponent () {
			return this.dragElement || this.dragComponent
		},

		droplineX () {
			let style = {}

			if (this.dragElementOrComponent && this.dropline.css) {
				let width = this.dropline.css.$width - (droplineMargin * 2),
				left = this.dropline.css.$left + droplineMargin,
				top = this.dropline.css.$top + droplineMargin

				// If position is bottom
				// Set dropline to the last child height
				if (this.dropline.position === 'bottom') {
					let lastChild = this.dropline.target.lastChild.$element().$outline()
					top = lastChild.$top + lastChild.$height + (droplineMargin / 2)
				}

				// Okay
				style.width = `${width}px`
				style.transform = `translate(${left}px, ${top}px)`
			}

			return style
		},

		dragOverlay () {
			let style = {}

			if (this.dragElement && this.dropline.css) {
				style.height = this.dropline.css.height
				style.width = this.dropline.css.width
				style.transform = this.dropline.css.transform
			}

			return style
		}
	},

	methods: {
		/**
		 * Get element by Id
		 * @param  {String} id [Uno ID]
		 * @return {ElementNode}
		 */
		getElementById (id) {
			return this.$root
			.canvasBuilder()
			.layout()
			.getElement(id)
		},

		/**
		 * Get properties of active element
		 * @param  {String} key
		 * @param  {String} mouseState
		 * @return {String}
		 */
		getProp (key, mouseState) {
			if (this.activeElement) {
				return this.activeElement.$get(key, mouseState)
			}
		},

		/**
		 * Set properties of active element
		 * @param {String} key
		 * @param {String} val
		 * @param {String} mouseState
		 */
		setProp (key, val, mouseState) {
			if (this.activeElement) {
				this.activeElement.$set(key, val, mouseState)
			}
		},

		/**
		 * Set state
		 * @param {Object} element
		 */
		setState (element) {
			// Set state
			this[element.state] = element

			// Hide all tools
			if (element.state === 'select') {
				// Set expanded breadcrumb to collapse
				this.$nextTick(() => {
					this.$refs.selectBreadcrumb.expand = false
				})
			} else {
				let hoverEl = this.getElementById(element.id)
				if (hoverEl) {
					// Move block's position
					let block = this.$root.canvasBuilder('block'), insertAt, position = 0

					// If element type is body a.k.a layout
					// and body has no elements, set position of block to top
					// but if body has at least 1 elements
					// set position to last element's height
					if (element.type === 'body') {
						if (hoverEl.$childElements().length > 0) {
							let firstChild = _last(hoverEl.$childElements()).$outline()
							position = firstChild.$top + firstChild.$height
						} else {
							position = element.css.$top
						}
					}
					// Other than body set position of block's with this case
					// If element has parent and it's not a root's child (first node of root)
					// find it until it's root's child
					else {
						let parent = hoverEl.$firstParentFromLayout(),
						outline = parent.$outline()
						insertAt = parent.$index()
						position = (outline.$top + outline.$height) - 20
					}

					// Only set position if block hasn't shown yet
					if (! block.showBlock && !this.dragElement) {
						block.position = position
						block.insertAt = insertAt
					}
				}
			}
		},

		/**
		 * Drop line when dragging element
		 * @param {Boolean} display
		 * @param {Object} dropElement
		 * @return {void}
		 */
		dropAt (display, dropElement) {
			if (dropElement) {
				this.dropline = dropElement
			}
		},

		/**
		 * Is valid hover
		 * @return {Boolean}
		 */
		isHover () {
			if (this.hover.breadcrumbs &&
				this.hover.breadcrumbs.length>0 &&
				(this.hover.id !== this.select.id || this.dragElementOrComponent)) {
				return true
			}
		},

		/**
		 * Is valid select
		 * @return {Boolean}
		 */
		isSelect () {
			if (this.select.breadcrumbs &&
				this.select.breadcrumbs.length>0 &&
				(this.hover.id !== this.select.id || ! this.dragElementOrComponent)) {
				return true
			}
		},

		/**
		 * When remove button hovered
		 */
		removeOver () {
			this.select.removeOver = true
		},

		/**
		 * When remove button not hovered
		 */
		removeLeave () {
			this.select.removeOver = false
		},

		/**
		 * Remove element
		 */
		removeElement () {
			this.$root
			.canvasBuilder()
			.layout()
			.removeElement(this.select.id)
		},

		/**
		 * Check whether element has equals kind with given value
		 */
		isKind (kind) {
			return this.elementKind === kind
		},

		/**
		 * Check whether element has equals type with given value
		 */
		isType (type) {
			return this.elementType === type
		},

		/**
		 * Copy element
		 * @param {Boolean} inMemory Store element id in memory
		 */
		copyElement (inMemory) {
			if (inMemory) {
				this.$root
				.canvasBuilder()
				.layout()
				.keyCapture('copy', this.select.id)
			} else {
				this.$root
				.canvasBuilder()
				.layout()
				.copyElement(this.select.id)
			}
		},

		/**
		 * Paste element from memory, see copyElement
		 */
		pasteElement () {
			this.$root
			.canvasBuilder()
			.layout()
			.keyCapture('paste')
		},

		isElementResizable () {},
		isDragDirection () {},
		isResizable () {},
		resizeElement() {}
	}
}
</script>
