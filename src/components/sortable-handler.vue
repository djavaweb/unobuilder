<template>
<div class="sortable-handler uk-icon-arrows" :class="[class]"></div>
</template>

<style lang="less">
@import "../css/vars.less";

.sortable-handler {
	cursor: move;
	position: absolute;
	left: -1px;
	top: -26px;
	z-index: 99;
	padding: 5px;
	color: #ffffff;
	background: @greyish-four;
	border: 1px solid @greyish-four;
	&:hover {
		background: @dark-sky-blue;
		border: 1px solid @dark-sky-blue;
	}
}
</style>

<script>
export default {
	name: "sortableHandler",
	props: ['class']
}
</script>