<template>
<div class="empty content uk-text-center" :class="[class]">
	<div class="uk-width-1-1 uk-panel uk-panel-box uk-panel-box-primary uk-vertical-align" :class="[class]">
		<div class="uk-vertical-align-middle" :class="[class]">
			<p :class="[class]">No content here. Drag new from 'Content' panel.</p>
		</div>
	</div>
</div>
</template>

<style lang="less">
@import "../css/vars.less";
.empty.content {
	color: #3498db;

	p {
		margin: 0;
	}

	.uk-panel {
		border: 1px dashed @peterriver
	}
}
</style>

<script>
export default {
	name: 'Empty',
	props: ['class'],
	data() {}
}
</script>