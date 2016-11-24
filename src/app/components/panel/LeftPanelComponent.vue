<template lang="pug">
.element-item(@mousedown="dragStart($event)")
	.icon(:style="style")
	.label {{component.settings.label}}
</template>

<script>
import utils from '../../utils.js'
export default {
	name: 'componentItem',
	props: {
		component: {
			type: Object,
			required: true,
			default: () => {}
		}
	},

	data () {
		return {
			interval: null,
			dragState: {
				x: 0,
				y: 0,
				element: null,
				intervalCount: 0
			}
		}
	},

	computed: {
		/**
		 * Override style
		 * @return {Object}
		 */
		style () {
			let styles = {}

			// Change default icon if any
			if (this.component.settings.icon) {
				styles.backgroundImage = `url(${this.component.settings.icon})`
			}

			return styles
		}
	},

	methods: {
		/**
		 * Begin to drag a component
		 * @param  {Event} event
		 * @return {void}
		 */
		dragStart (event) {
			let element = event.target

			// Select root node
			if (! element.classList.contains('element-item')) {
				element = element.parentElement
			}

			// Clone element item
			this.dragState.element = element.cloneNode(true)
			// this.dragState.element.style.display = 'none'
			this.dragState.element.classList.add('element-item--dragging')
			document.body.appendChild(this.dragState.element)

			// Set initial coords
			this.dragState.x = event.pageX
			this.dragState.y = event.pageY

			// Fire event tell that component is begin to drag
			this.component.dragStart && this.component.dragStart.apply(this.component)

			// Tell the builder that we're begin to drag
			let componentClone = element.cloneNode(true)
			componentClone.style.height = `${element.getBoundingClientRect().height}px`
			componentClone.firstChild.removeAttribute('style')
			this.$root.canvasBuilder().layout().dragComponentStart(componentClone, this.component)

			// Hide left panel
			this.$root.ref('leftPanel').hide()

			// Start dragging
			utils.addEvent(document, 'mousemove', this.dragMove, false)
			utils.addEvent(document, 'mouseup', this.dragEnd, false)

			// After mouse down/click, and mouse isn't hold left click
			// And it's over that 1 seconds, let's ended it
			this.interval = setInterval(() => {
				if (this.dragState.intervalCount === 1) {
					this.dragEnd(event, true)
					clearInterval(this.interval)
				}

				this.dragState.intervalCount++
			}, 150)
		},

		/**
		 * Dragging a component
		 * @param  {Event} event
		 * @return {void}
		 */
		dragMove (event) {
			// Remove interval
			if (this.interval) {
				clearInterval(this.interval)
			}

			// After mouse down/click, and mouse isn't hold left click
			// But we're moving anyway, it's not valid though.
			// So we must kill it.
			if (event.which === 0) {
				this.dragEnd(event, true)
			}

			let x = event.pageX, y = event.pageY, coords = {x, y}

			// Move element UI
			let rect = this.dragState.element.getBoundingClientRect(),
			width = rect.width, height = rect.height
			this.dragState.element.style.position = 'absolute'
			this.dragState.element.style.top = `${y-(height/2)}px`
			this.dragState.element.style.left = `${x-(width/2)}px`
			this.dragState.element.style.zIndex = 999

			// Fire event tell that component is moving
			this.component.dragMove && this.component.dragMove(this.component, [coords])

			// Tell the canvas builder that we're dragging a component
			this.$root.canvasBuilder().layout().dragComponentMove(coords)

			// Tell the left panel that we're dragging a component
			this.$root.ref('leftPanel').dragComponent = true
		},

		/**
		 * Dragging is over
		 * @param  {Event} event
		 * @param  {Boolean} notMoving
		 * @return {void}
		 */
		dragEnd (event, notMoving) {
			// Remove interval
			if (this.interval) {
				clearInterval(this.interval)
			}

			// Stop dragging
			utils.removeEvent(document, 'mousemove', this.dragMove, false)
			utils.removeEvent(document, 'mouseup', this.dragEnd, false)

			// Fire event tell that dragging a component is over
			this.component.dragEnd && this.component.dragEnd(this.component)

			// Left panel too
			this.$root.ref('leftPanel').dragComponent = false

			// If it's actually not moving
			// Just add component to active element
			if ((event.pageX === this.dragState.x && event.pageY === this.dragState.y) || notMoving) {
				let activeElement = this.$root.elementSelector().activeElement
				this.$root.canvasBuilder().layout().overlapElement = activeElement
				this.$root.canvasBuilder().layout().dropElement = activeElement
			}

			// Tell to canvas
			this.$root.canvasBuilder().layout().dragComponentEnd(this.component)

			// Remove element and reset dragtate to default
			this.dragState.element.remove()
			utils.resetObject(this.dragState)
		}
	}
}
</script>
