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
		}
	},

	computed: {
		borderClass () {
			if (this.border) return 'border-' + this.border
		}
	}
}
</script>