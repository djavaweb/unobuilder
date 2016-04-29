<template>
<div class="input-number">
	<label>{{label}}</label><div class="input-number-wrapper"><input type="text" v-model="value"></div><a>{{unit}}</a>
</div>
</template>

<script>
export default {
	name: 'Number',
	props: {
		value: {
			required: true,
			default: 0
		},
		label: {
			required: true,
			default: '',
		},
		unit: {
			required: true,
			default: 'px'
		}
	}
}
</script>