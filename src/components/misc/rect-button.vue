<template>
<a class="rect-button" :class="{active: active}"><slot></slot></a>
</template>

<script>
export default {
	name: 'rectButton',
	props: {
		active: {
			default: false
		}
	}
}
</script>