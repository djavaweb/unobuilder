<template>
	<div class="uno-wrapper uno-el" data-id="body">
		<element v-for="element in elements" :data="element" :index="element.index"></element>
	</div>
</template>


<style lang="less">
@import "../../css/viewer.less";
</style>


<script>
// Dependencies
import _ from 'underscore'

// Import child components
import element from './element.vue'

export default {
	name: 'layout',
	components: {element},
	computed: {
		/**
		 * Get elements from $parent
		 *
		 * @return {Object}
		 */
		elements () {
			return this.$root.body.elements
		}
	},

	methods: {
		/**
		 * Check is array empty
		 *
		 * @param  {Array} array
		 * @return {Boolean}
		 */
		empty (array) {
			return array.length === 0
		}
	}
}
</script>
