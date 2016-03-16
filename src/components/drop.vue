<template>
<div class="dropable"></div>
</template>

<style lang="less">
@peterriver: #3498db;

.dropable {
	height: 5px;
	margin-top: -5px;
	position: relative;
	z-index:999;
	width: 100%;
	&:after {
		display: none;
		content: 'Drag it here';
		padding: 0px 9px;
		background: #3498db;
		margin: 5px auto 0;
		color: white;
		height: 23px;
		font-size: 12px;
	}
}

.drop-active {
	background-color: white;
}

.drop-enter {
	background-color: @peterriver;
	&:after {
		display: table;
	}
}

.empty.content {
	padding: 5px;
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
	name: 'Drop',
	ready: function () {
		this.$el.setAttribute('id', 'dropable-' + Date.now())
	}
}
</script>