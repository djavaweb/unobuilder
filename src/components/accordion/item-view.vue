<template>
<div class="accordion-item-view" :class="[borderClass]">
<label class="title">{{title}}</label>
<slot></slot>
</div>
</template>

<script>
export default {
	name: 'accordionItemView',
	props: {
		title: {
			required: true,
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