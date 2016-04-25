<template>
<div class="element-item" @mousedown="dragstart($event)">
	<div class="icon {{data.icon}}"></div>
	<div class="label">{{data.label}}</div>
</div>
</template>

<script>
export default {
	name: 'elementItem',
	props: {
		data: {
			required: true,
			type: Object,
			default: null
		}
	},

	data () {
		return {
			clone: null,
			dragging: false
		}
	},

	methods: {
		/**
		 * Start draggin' item
		 * @param  {Event} event
		 * @return {void}
		 */
		dragstart (event) {
			this.$root.$broadcast('dragstart', true, this.$el.cloneNode(true))		
			document.addEventListener('mousemove', this.dragmove, false);
			document.addEventListener('mouseup', this.dragend, false);
		},


		/**
		 * Start drag on move
		 * @param  {Event} event
		 * @return {void}
		 */
		dragmove (event) {
			// Current state is not dragging, let's set to dragging state
			if (! this.dragging) {
				this.$set('dragging', true);
				return
			}

			// Clone element item
			if (! this.clone) {
				this.$set('clone', this.$el.cloneNode(true))
				document.body.appendChild(this.clone)
			}

			// Bounds Rectangle of clone element
			let rect = this.clone.getBoundingClientRect()
			let x = (event.pageX - (rect.width/2)),
			y = (event.pageY - (rect.height/2))

			// Notify the parent and then the viewer to catch the coords
			this.$root.$broadcast('dragmove', {x: x, y: y})

			// Follow the cursor
			this.clone.style.position = 'absolute'
			this.clone.style.top = y + 'px'
			this.clone.style.left = x + 'px'
			this.clone.style.zIndex = 9999
		},


		/**
		 * Drag is over, let's clean up
		 * @param  {Event} event
		 * @return {void}
		 */
		dragend (event) {
			// Remove Cloned element
			if (this.clone) {
				this.clone.remove()
				this.$set('clone', null)
			}

			// Set off all of dragging
			this.$set('dragging', false)
			this.$root.$broadcast('dragend', this.data)
			document.removeEventListener('mousemove', this.dragmove, false);
			document.removeEventListener('mouseup', this.dragend, false);
		}
	}
}
</script>