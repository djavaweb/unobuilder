<template>
<div class="element-item" @mousedown="drag($event)">
	<div class="icon" :style="style"></div>
	<div class="label">{{data.info.label}}</div>
</div>
</template>

<script>
export default {
	name: 'componentItem',
	props: {
		data: {
			required: true,
			type: Object,
			default: null
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
			if (this.data.info && this.data.info.icon) {
				styles.backgroundImage = `url(${this.data.info.icon})`
			}

			return styles
		}
	},

	methods: {
		/**
		 * Start draggin' item
		 * @param  {Event} event
		 * @return {void}
		 */
		drag (event) {
			this.$dispatch('dragComponent', event, this.$el, this.data)
		}
	}
}
</script>
