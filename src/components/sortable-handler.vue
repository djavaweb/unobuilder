<template>
<div class="sortable uk-icon-arrows"></div>
</template>

<style lang="less">
.sortable {
	background: #3498db;
	color: #ffffff;
    z-index: 99;
    padding: 5px 5px 5px 11px;
    border-radius: 8px;
    position: absolute;
    left: -10px;
	top: 50%;
	-webkit-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
}
</style>

<script>
export default {
	name: "sortableHandler"
}
</script>