<template>
<div class="sortable-handler uk-icon-arrows" :class="[class]"></div>
</template>

<style lang="less">
.sortable-handler {
	cursor: move;
	background: #3498db;
	color: #ffffff;
	z-index: 99;
	padding: 5px 5px 5px 2px;
	border-radius: 100%;
	position: absolute;
	left: 0px;
	top: 50%;
	-webkit-transform: translateY(-50%);
	-moz-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>

<script>
export default {
	name: "sortableHandler",
	props: ['class']
}
</script>