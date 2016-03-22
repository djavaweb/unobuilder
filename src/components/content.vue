<template>
<div class="uk-width-{{width}} draggable content">
	<div class="item uk-panel uk-panel-box uk-text-bold uk-text-center">{{label}}</div>
</div>
</template>

<script>
export default {
	name: "Content",
	props: ['width', 'label'],
	data() {}
}
</script>