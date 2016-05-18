<template>
<ul class="_cm" :style="position" v-if="show" @contextmenu="noop(event)">
	<li v-for="item in menus">
		<span v-if="item === '-'" class="_cm-delimiter"></span>
		<a @click="click(item.click)" @mouseover="over(item.over)" @mouseleave="leave(item.leave)" v-else>
			<span class="_cm-label">{{item.label}}</span>
			<span class="_cm-shortcut" v-if="item.shortcut">{{{item.shortcut}}}</span>
		</a>
	</li>
</ul>
</template>

<style lang="less">
@import "../../css/colors.less";

	._cm {
		position: absolute;
		width: 200px;
		background: @dark;
		list-style: none;
		padding: 0;
		margin: 0;
		border-radius: 4px;
		box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.7);
		border: 1px solid @dark;
		z-index: 999;
		overflow: hidden;

		li {
			padding: 0;
			margin: 0;
		}

		a {
			padding: 3px 10px;
			color: @white;
			display: block;
			font-size: 12px;
			text-shadow: 0 0 1px @black;
			cursor: default;
			&:after {
				display: block;
				content: ' ';
				clear: both;
				float: none;
			}
			&:hover {
				background: @charcoal-semi-dark;
			}
		}

		._cm-label {
			float: left;
			font-weight: bold;
		}

		._cm-shortcut {
			float: right;
			font-style: italic;
		}

		._cm-delimiter {
			display: block;
			height: 2px;
			margin: 2px 0;
			background: @steel-young-grey2
		}
	}
</style>

<script>
export default {
	name: 'contextMenu',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		menus: {
			type: Array,
			default: null
		},
		position: {
			type: Object,
			default: null
		}
	},

	methods: {
		noop (event) {
			event && event.preventDefault()
		},

		click (fn) {
			fn && fn()
		},

		over (fn) {
			fn && fn()
		},

		leave (fn) {
			fn && fn()
		}
	}
}
</script>