<template>
<div class="dropable" :class="[position, class]" data-accept="{{accept}}" data-position="{{position}}" data-index="{{index}}"></div>
</template>

<style lang="less">
@import "../css/vars.less";
.dropable {
	margin-top: -5px;
	position: relative;
	z-index: 999;

	&.relative {
		position: relative;
	}

	&.left, &.right {
		position: absolute;
		height: 100%;
		width: 5px;
		top: 0;
		&:before {
			border: none;
			top: 5px;
			left: -5px;
			height: 100%;
		}
		&:after {
			content: '';
		}
	}

	&.left {
		left: 5px;
		&:before {
			border-right: 5px solid #3498db;
		}
	}

	&.right {
		right: 0;
		&:before {
			border-right: 5px solid #3498db;
		}
	}

	&.bottom {
		margin-top: -10px;
	}
			

	&:before {
		content: ' ';
		width: 100%;
		position: absolute;
		top: -30px;
		display: none;
		z-index: 1;
		height: 35px;
		border-bottom: 5px solid #3498db;
		left: -2px;
		right: 0;
		padding: 0 2px 0 3px;
	}

	&:after {
		display: none;
		content: 'Drag it here';
		padding: 0 10px;
		background: #3498db;
		margin: 0 auto;
		color: white;
		font-size: 12px;
		border-right: 2px solid #3498db;
		border-left: 2px solid #3498db;
		z-index: 2;
		border-radius: 100px;
		position: absolute;
		top: -5px;
		left: 42.5%;
	}
}

.drop-active {
	background-color: white;
}

.drop-enter {
	&:after, &:before {
		display: table;
	}
}
</style>

<script>
export default {
	name: 'Drop',
	props: {
		position: {default: ''},
		class: {default: ''},
		accept: {default: ''},
		index: {default: 0}
	},
	ready () {
		let self = this, $el = $(self.$el)

		/* Set id */
		this.$el.setAttribute('id', 'dropable-' + Date.now())
	}
}
</script>