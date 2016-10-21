<template lang="pug">
.element-selector-wrapper(v-if="state!==''")

	// Hover element selector
	.element-selector-tools.hover(
	:class="{orange: dragComponent}",
	:style="hover.css",
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
</template>

<script>
import _last from 'lodash/last'
import breadcrumb from './Breadcrumb.vue'
export default {
	name: 'elementSelector',
	components: {
		breadcrumb
	},

	data () {
		return {
			hover: {},
			select: {}
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
		 * @param {Object} object
		 */
		setState (object) {
			this[object.state] = object

			// Hide all tools
			if (object.state === 'select') {
				// Set expanded breadcrumb to collapse
				this.$nextTick(() => {
					this.$refs.selectBreadcrumb.expand = false
				})
			} else {
				let hoverEl = this.getElementById(object.id)
				if (hoverEl) {
					// Move block's position
					let position = 0

					// If element type is body a.k.a layout
					// and body has no elements, set position of block to top
					// but if body has at least 1 elements
					// set position to last element's height
					if (object.type === 'body') {
						if (hoverEl.$childElements().length > 0) {
							let firstChild = _last(hoverEl.$childElements()).$outline()
							position = firstChild.$top + firstChild.$height
						} else {
							position = object.css.$top
						}
					}
					// Other than body set position of block's with this case
					// If element has parent and it's not a root's child (first node of root)
					// find it until it's root's child
					else {
						let parent = hoverEl.$parentOfLayout(),
						outline = parent.$outline()
						position = (outline.$top + outline.$height) - 20
					}

					// Set the position
					this.$root.canvasBuilder('block').position = position
				}
			}
		},

		/**
		 * Is valid hover
		 * @return {Boolean}
		 */
		isHover () {
			if (this.hover.breadcrumbs && this.hover.breadcrumbs.length>0 &&
			this.hover.id !== this.select.id) {
				return true
			}
		},

		/**
		 * Is valid select
		 * @return {Boolean}
		 */
		isSelect () {
			if (this.select.breadcrumbs && this.select.breadcrumbs.length>0) {
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
			.$emit('removeElement', this.select.id)
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
				.$emit('keyCapture', 'copy', this.select.id)
			} else {
				this.$root
				.canvasBuilder()
				.layout()
				.$emit('copyElement', this.select.id)
			}
		},

		/**
		 * Paste element from memory, see copyElement
		 */
		pasteElement () {
			this.$root
			.canvasBuilder()
			.layout()
			.$emit('keyCapture', 'paste')
		},

		isElementResizable () {},
		isDragDirection () {},
		isResizable () {},
		resizeElement() {}
	}
}
</script>
