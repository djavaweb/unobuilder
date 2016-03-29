<template>
<div class="dropable" :class="[position, class]" data-accept="{{accept}}"></div>
</template>

<style lang="less">
@import "../css/vars.less";
.dropable {
	height: 5px;
	margin-top: -5px;
	position: relative;

	&.relative {
		position: relative;
	}

	&.left, &.right {
		position: absolute;
		height: 100%;
		width: 15px;
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
		left: 0;
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
			

	&:before {
		content: ' ';
		width: 100%;
		position: absolute;
		top: -30px;
		display: none;
		z-index: 1;
		height: 35px;
		border-bottom: 5px solid #3498db;
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
		left: 47%;
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
		accept: {default: ''}
	},
	ready () {
		let self = this, $el = $(self.$el)

		/* Set id */
		this.$el.setAttribute('id', 'dropable-' + Date.now())
	}
}
</script>