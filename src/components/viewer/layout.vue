<template>
	<block v-if="empty(elements)" :index="0"></block>
	<element v-for="element in elements" :data="element" :index="element.index">
		<block :child="true" :index="$index" :class="{first: $index===0, last: $index === elements.length-1}"></block>
	</element>
</template>


<style lang="less">
@import "../../css/viewer.less";
</style>


<script>
// Dependencies
import _ from 'underscore'

// Import child components
import element from './element.vue'
import block from './block.vue'

export default {
	name: 'layout',
	components: {block, element},
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