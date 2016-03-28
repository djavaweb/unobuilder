<template>
<div class="empty uk-text-center" :class="[class]">
	<div class="uk-width-1-1 uk-panel uk-panel-box uk-panel-box-primary uk-vertical-align" :class="[class]">
		<div class="uk-vertical-align-middle" :class="[class, itemClass]">
			<p :class="[class, itemClass]">No content here. Drag new from 'Content' panel.</p>
		</div>
	</div>
</div>
</template>

<style lang="less">
@import "../css/vars.less";
.empty {
	color: #3498db;

	p {
		margin: 0;
	}

	.uk-panel {
		border: 1px dashed @peterriver;
		&.uk-panel-box-primary {
			background: rgba(235, 247, 253, 0.8)
		}
	}
}
</style>

<script>
export default {
	name: 'Empty',
	props: ['class'],
	computed: {
		itemClass: {
			get() {
				return this.class + '-child'
			}
		}
	}
}
</script>