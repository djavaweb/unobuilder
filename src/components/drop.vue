<template>
<div class="dropable" :class="[position]"></div>
</template>

<style lang="less">
@import "../css/vars.less";
.dropable {
	height: 5px;
	position: absolute;
	z-index: 999;
	width: 100%;
	left: 0;
	top: 100%;

	&.relative {
		position: relative;
	}

	&:before {
		content: ' ';
		width: 100%;
		position: absolute;
		height: 200px;
		top: -100px;
		display: none;
	}

	&:after {
		display: none;
		content: 'Drag it here';
		padding: 0px 9px;
		background: #3498db;
		margin: 5px auto 0;
		color: white;
		height: 23px;
		font-size: 12px;
    	border-right: 2px solid #3498db;
    	border-left: 2px solid #3498db;
	}
}

.drop-active {
	background-color: white;
}

.drop-enter {
	background-color: @peterriver;
	&:after, &:before {
		display: table;
	}
}
</style>

<script>
export default {
	name: 'Drop',
	props: ['position'],
	ready () {
		this.$el.setAttribute('id', 'dropable-' + Date.now())
	}
}
</script>