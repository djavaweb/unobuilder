<template>
<div class="element-item">
	<div class="icon {{icon}}"></div>
	<div class="label">{{label}}</div>
</div>
</template>

<script>
export default {
	name: 'elementItem',
	props: {
		label: {
			required: true,
			type: String,
			default: 'Label'
		},

		icon: {
			required: true,
			type: String,
			default: ''
		}
	}
}
</script>