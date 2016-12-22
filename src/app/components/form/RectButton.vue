<template>
<a class="rect-button" :class="{'rect-button--active': active, 'rect-button--disabled': disabled}"><slot></slot></a>
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