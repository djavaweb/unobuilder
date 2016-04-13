<template>
<div class="input-number" :class="{disabled: !enable, inline: inline}"><span v-if="suffix" class="suffix">{{label}}</span><a class="uk-icon-plus" @click="add()" @mousedown="add(true)" @mouseup="nothing()"></a><input type="text" v-model="value" :disabled="!enable"><a class="uk-icon-minus" @click="minus()" @mousedown="minus(true)" @mouseup="nothing()"></a> <span v-if="prefix" class="prefix" :style="prefixWidth">{{label}}</span>
</div>
</template>

<style lang="less">
@import "../css/vars.less";
@import "../css/mixins.less";

.input-number {
	color: #5A5A5A;
	font-size: 11px;
	overflow: hidden;

	&.inline {
		display: inline-block;
	}

	&.disabled, &.disabled input, &.disabled a {
		color: #A8A8A8
	}

	* {
		float: right
	}

	.prefix {
		margin-right: 4px;
		padding: 1px;
		display: inline-block;
		text-align: right;
		.small-label-white;
	}

	.suffix {
		margin-left: 5px;
		.small-label-white;
	}

	input {
		width: 23px !important;
		border: none;
		padding: 3px 0 !important;
		text-align: center;
	}

	a {
		padding: 4px 6px;
		border: 1px solid @greyish-two;
		background-color: @greyish-two;
		color: @white;
		font-size: 9px;

		&:hover, &:active, &:focus {
			background-color: @warm-grey-four;
		}

		&.uk-icon-minus {
			border-top-left-radius: 2px;
			border-bottom-left-radius: 2px;
		}

		&.uk-icon-plus {
			border-top-right-radius: 2px;
			border-bottom-right-radius: 2px;
		}
	}

	&:after {
		content: ' ';
		display: block;
		clear: both;
		width: 100%;
	}
}
</style>

<script>
export default {
	name: 'Number',
	props: {
		enable: {default: true},
		value: {default: 0},
		label: {default: 'Label'},
		prefix: {default: true},
		suffix: {default: false},
		min: {default: 0},
		max: {default: 100},
		step: {default: 1},
		inline: {default: false},
		labelWidth: {default: null}
	},
	data () {
		return {interval: null, isMouseDown: false}
	},
	computed: {
		prefixWidth () {
			let newStyle = {}
			if (this.labelWidth) {
				newStyle.width = this.labelWidth + 'px'
			}
			return newStyle
		}
	},
	methods: {
		blur (e) {
			if (!this.enable) e.target.blur()
		},

		nothing () {
			clearInterval(this.interval)
			this.$set('isMouseDown', false)
		},

		minus (spin) {
			if (this.enable && !this.isMouseDown) {
				let self = this,
				minus = function () {
					let min = (self.min)? self.min: 0
					self.value -= self.step
					if (self.value < min) self.value = min
				}

				if (spin) {
					self.$set('isMouseDown', true)
					self.interval = setInterval(function () {
						minus()
					}, 250)
				} else {
					minus()
				}
			}
		},

		add (spin) {
			if (this.enable && !this.isMouseDown) {
				let self = this,
				add = function () {
					let max = (self.max)? self.max: 100
					self.value += self.step
					if (self.value > max) self.value = max
				}
				
				if (spin) {
					self.$set('isMouseDown', true)
					self.interval = setInterval(function () {
						add()
					}, 250)
				} else {
					add()
				}
			}
		}
	}
}
</script>