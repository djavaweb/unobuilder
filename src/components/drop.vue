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
			border-right: 5px solid @dark-sky-blue;
		}
	}

	&.right {
		right: 0;
		&:before {
			border-right: 5px solid @dark-sky-blue;
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
		border-bottom: 5px solid @dark-sky-blue;
	}

	&:after {
		display: none;
		content: 'Drag it here';
		padding: 0 10px;
		background: @dark-sky-blue;
		margin: 0 auto;
		color: white;
		font-size: 12px;
		z-index: 2;
		border-radius: 4px;
		position: relative;
		margin-bottom: -10px;
	}
}

.drop-active {
	background-color: white;
}

.drop-enter {
	margin-bottom: -20px;
	&.relative {
		margin-bottom: -10px;
	}
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