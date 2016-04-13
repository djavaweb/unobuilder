<template>
<div class="parent element-empty uk-text-center uk-grid-match" :class="[class, selectedClass]">
	<div :style="[styles]" :class="[class, classStyle]">
		<div class="uk-width-1-1 uk-panel uk-panel-box uk-panel-box-yellow uk-vertical-align" :class="[class, itemClass]">
			<div class="uk-vertical-align-middle" :class="[class, itemClass]">
				<p :class="[class, itemClass]">{{text}}</p>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="less">
@import "../../css/vars.less";
.element-empty {
	color: #3498db;

	p {
		margin: 0;
	}

	.uk-panel {
		border: 1px dashed @peterriver;
		&.uk-panel-box-yellow {
			background: @sun-young-yellow;
		}
	}
}
</style>

<script>
export default {
	name: 'Empty',
	props: {
		class: {default: ''},
		selected: {default: false},
		styles: {default: ''},
		text: {default: 'No content here. Drag new from \'Content\' panel.'}
	},
	computed: {
		selectedClass: {
			get () {
				return (this.selected)? 'selected': ''
			}
		},
		classStyle: {
			get () {
				return this.class + '-style'
			}
		},
		itemClass: {
			get() {
				return this.class + '-child'
			}
		}
	}
}
</script>