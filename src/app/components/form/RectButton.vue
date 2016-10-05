<template>
<a class="rect-button" :class="{active: active, disabled: disabled}"><slot></slot></a>
</template>

<script>
export default {
	name: 'rectButton',
	props: {
		active: {
			default: false
		},
		disabled: {
			default: false
		}
	}
}
</script>