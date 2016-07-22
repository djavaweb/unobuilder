<template>
<div class="accordion-item-view" :class="[borderClass]">
<label class="title" v-if="title">{{title}}</label>
<slot></slot>
</div>
</template>

<script>
export default {
	name: 'accordionItemView',
	props: {
		title: {
			default: ''
		},

		border: {
			default: null
		},

		borderIf: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		borderClass () {
			if (this.border && this.borderIf) return 'border-' + this.border
		}
	}
}
</script>