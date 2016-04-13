<template>
<div class="tree-view">
<slot></slot>
</div>
</template>

<style lang="less">
@import "../css/vars.less";
.tree-view {
	position: relative;
	padding-left: 20px;
	margin-bottom: 5px;
	border-left: 1px solid @warm-grey-eight;
	margin-left: 10px;
	padding-top: 0px;
	&:before {
		content: ' ';
		background-color: @warm-grey-three;
		background-image: url('../img/tree.svg');
		background-repeat: no-repeat;
		width: 16px;
		height: 16px;
		background-size: 100%;
		position: absolute;
		left: -5px;
		top: 0;
	}
}
</style>

<script>
export default {
	name: 'Tree',
	props: {}
}
</script>