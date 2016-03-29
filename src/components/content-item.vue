<template>
<div class="uk-width-{{width}} draggable item">
	<div class="content uk-panel uk-panel-box uk-text-bold uk-text-center"><i class="uk-icon-{{icon}}"></i> <slot>{{label}}</slot></div>
</div>
</template>

<script>
export default {
	name: 'contentItem',
	props: ['width', 'icon']
}
</script>