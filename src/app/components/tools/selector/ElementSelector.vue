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
	.dropline(v-if="shouldDisplayDropline")
		.dropline__x(:style="droplineX")
			.dropline__x-triangle.dropline__x-triangle--left
			.dropline__x-triangle.dropline__x-triangle--right

	// Element Overlay
	.element-overlay(v-if="(isHover() && dragElement) || (isSelect() && cutElementState)", :style="dragOverlay")

	// Text Editor
	text-editor(v-if="editContent", :element="edit.target", :style="editContentStyle")

	// Link Editor
	link-editor(v-if="linkEditor.display", :element="linkEditor.element", :position="linkEditor.position")
</template>

<script>
import _last from 'lodash/last'
import breadcrumb from './Breadcrumb.vue'
import textEditor from '../../editor/TextEditor.vue'
import linkEditor from '../../editor/LinkEditor.vue'
import optionsEditor from '../../editor/optionsEditor.vue'

const droplineMargin = 5
export default {
	name: 'elementSelector',
	components: {
		breadcrumb,
		textEditor,
		linkEditor,
		optionsEditor
	},

	data () {
		return {
			hover: {},
			select: {},
			dropline: {},
			overlay: {},
			edit: {},
			linkEditor: {
				display: false,
				element: null,
				position: {
					x: 0,
					y: 0
				}
			}
		}
	},

	computed: {
		activeElement () {
			if (this.select.id) {
				return this.$root
				.canvasBuilder()
				.layout()
				.getElement(this.select.id)
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

		elementOptions () {
			if (this.activeElement) {
				return this.activeElement.$options
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

		editContentStyle () {
			let style = {}

			if (this.editContent) {
				style.transform = `translate(${this.edit.css.$left}px, ${this.edit.css.$top + this.edit.css.$height}px)`
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

		editContent () {
			return this.edit && this.edit.editable
		},

		cutElementState () {
			return this.$root.canvasBuilder().layout().cutElement
		},

		dragElementOrComponent () {
			return (this.dragElement || this.dragComponent) && !this.editContent
		},

		shouldDisplayDropline () {
			return this.isHover() && this.isOverlayNotDropline()
		},

		droplineX () {
			let style = {}

			if (this.dragElementOrComponent && this.dropline.css) {
				// Set dropline outline
				let width = this.dropline.css.$width - (droplineMargin * 2),
				left = this.dropline.css.$left + droplineMargin,
				top = this.dropline.css.$top + droplineMargin

				// If position is bottom
				// Set dropline to the last child height
				if (this.dropline.position === 'bottom') {
					if (this.dropline.target.lastChild && this.dropline.target.lastChild.$element) {
						let lastChild = this.dropline.target.lastChild.$element().$outline()
						top = lastChild.$top + lastChild.$height + (droplineMargin / 2)
					}
				}

				// Okay
				style.width = `${width}px`
				style.transform = `translate(${left}px, ${top}px)`
			}

			return style
		},

		dragOverlay () {
			let style = {}

			if ((this.dragElement || this.cutElementState) && this.overlay.css) {
				style.height = this.overlay.css.height
				style.width = this.overlay.css.width
				style.transform = this.overlay.css.transform
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
		getElement (id) {
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
		 * Apply current element in state mode
		 * @param {Object} state
		 */
		applyState (stateObject) {
			let element = this.getElement(stateObject.id)

			if (element) {
				this[stateObject.mode] = stateObject

				switch (stateObject.mode) {
					case 'edit':
						this.$root.canvasBuilder().layout().applyEditor(stateObject)
					break

					case 'select':
						if (this.editContent && this.edit.id !== stateObject.id) {
							this.edit.editable = false
							this.$root.canvasBuilder().layout().applyEditor(false)
						}

						this.$nextTick(() => {
							this.$refs.selectBreadcrumb.expand = false
						})
					break

					case 'hover':
						// Move block's position
						let block = this.$root.canvasBuilder('block')
						let position = stateObject.css.$top
						let insertAt

						if (stateObject.type !== 'body') {
							let parent = element.$firstParentFromLayout()
							let outline = parent.$outline()
							insertAt = parent.$index()
							position = (outline.$top + outline.$height) - 20
						} else {
							if (element.$childElements().length > 0) {
								let firstChild = _last(element.$childElements()).$outline()
								position = firstChild.$top + firstChild.$height
							}
						}

						if (! block.showBlock && !this.dragElement) {
							block.position = position
							block.insertAt = insertAt
						}
					break
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
		 * Overlays at element
		 * @param  {Object} elementObject
		 * @return {void}
		 */
		overlaying (elementObject) {
			if (elementObject) {
				this.overlay = elementObject
			}
		},

		/**
		 * Resosition text editor
		 * @return {void}
		 */
		textEditorReposition () {
			if (this.edit.target) {
				this.edit.css = this.edit.target.$outline()
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
		 * If overlay elment is not the same with dropline
		 * @return {Boolean}
		 */
		isOverlayNotDropline () {
			if (this.dragElementOrComponent) {
				if (this.overlay.css && this.dropline.css) {
					return this.overlay.id !== this.dropline.id
				} else if (this.dropline.css) {
					return true
				}
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
		 * Cut element from memory
		 */
		cutElement () {
			let activeElement = this.activeElement
			if (activeElement) {
				this.$root.canvasBuilder().layout().keyCapture('cut')
				activeElement.$overlay()
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

		/**
		 * Remove element
		 */
		removeElement () {
			this.$root
			.canvasBuilder()
			.layout()
			.removeElement(this.select.id)
		},

		editLink () {
			// if (this.elementKind === 'link') {
			// 	let offset = this.activeElement.$outline()
			// 	this.linkEditor.display = true
			// 	this.linkEditor.position = {x: offset.$left, y: offset.$top}
			// 	this.linkEditor.element = this.activeElement
			// }
		},

		editOptions () {
			console.log('edit link')
		},

		isElementResizable () {},
		isDragDirection () {},
		isResizable () {},
		resizeElement() {}
	}
}
</script>
