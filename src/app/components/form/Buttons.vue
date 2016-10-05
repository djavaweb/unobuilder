<template lang="pug">
.buttons
	rect-button.group(v-for="item in items", :active="item.active", @click="click(item)")
		i(v-if="item.icon",class="uk-icon-{{item.icon}}")
		span(v-if="item.label") {{item.label}}
</template>

<style>
.buttons {
	display: inline-block
}
</style>

<script>
import rectButton from './RectButton.vue'

export default {
	name: 'buttons',
	components: {
		rectButton
	},

	props: {
		items: {
			type: Array,
			default: () => [],
			required: true
		}
	},
	methods: {
		click (item) {
			item.click && typeof item.click === 'function' && item.click.call(this)
		}
	}
}
</script>
