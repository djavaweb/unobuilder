<template>
<div class="element-item">
	<div class="icon" :style="style"></div>
	<div class="label">{{component.settings.label}}</div>
</div>
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
		 * Start draggin' item
		 * @param  {Event} event
		 * @return {void}
		 */
		drag (event) {

		},
	}
}
</script>
