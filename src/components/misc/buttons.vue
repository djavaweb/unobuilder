<template>
<div class="buttons"><rect-button v-for="item in items" :active="item.active" @click="click(item)"><i v-if="item.icon" class="uk-icon-{{item.icon}}"></i> <span v-if="item.label">{{item.label}}</span></rect-button></div>
</template>

<style lang="less">
.buttons {
	display: inline-block;
	.rect-button {
		color: #ffffff;
		vertical-align: middle;
	    margin: 0;
		padding: 5px;
		font-size: 11px;
		text-align: center;
		display: inline-block;
		height: 10px;
		width: auto;
		span {
			vertical-align: -5px;
		}
	}
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
