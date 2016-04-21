<template>
<switcher :value="switcher" v-if="withSwitcher" :style="switcherStyle" :switcher-label="switcherLabel"></switcher>
<h3 class="uk-accordion-title">
	<i class="uk-icon-caret-right"></i> <i class="uk-icon-caret-down"></i> {{title}}
</h3>
<div class="uk-accordion-content"><slot></slot></div>
</template>

<script>
import Switcher from '../misc/switcher.vue'

export default {
	name: 'accordionItem',
	components: {Switcher},
	props: {
		title: {
			required: true,
			type: String,
			default: 'Title'
		},

		withSwitcher: {
			type: Boolean,
			default: false
		},

		switcher: {
			type: Boolean,
			default: true
		},

		switcherLabel: {
			type: String,
			default: ''
		},

		switcherStyle: {
			required: false,
			type: Object,
			default: null
		}
	},

	ready () {

		// If switcherStyle is undefined
		if (! this.switcherStyle) {

			// Set default style, since vuejs not accept object as props value
			this.$set('switcherStyle', {
				position: 'absolute',
				top: '5px',
				right: '10px',
				zIndex: 10
			})
		}

	}
}
</script>