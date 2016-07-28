<template>
<div class="buttons"><rect-button v-for="item in items" :active="item.active" @click="click(item)" class="group"><i v-if="item.icon" class="uk-icon-{{item.icon}}"></i> <span v-if="item.label">{{item.label}}</span></rect-button></div>
</template>

<style>
.buttons {
	display: inline-block
}
</style>

<script>
import rectButton from './rect-button.vue'

export default {
	name: 'buttons',
	components: {
		rectButton
	},
	props: {
		items: {
			type: Array,
			default: [],
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
