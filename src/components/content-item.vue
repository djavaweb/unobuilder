<template>
<div class="uk-width-{{width}} draggable content">
	<div class="item uk-panel uk-panel-box uk-text-bold uk-text-center"><i class="uk-icon-{{icon}}"></i> <slot>{{label}}</slot></div>
</div>
</template>

<script>
export default {
	name: 'contentItem',
	props: ['width', 'icon']
}
</script>