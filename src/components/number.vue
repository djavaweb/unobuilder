<template>
<div class="input-number" :class="{disabled: !enable}"><span v-if="suffix" class="suffix">{{label}}</span><a class="uk-icon-minus" @click="minus()" @mousedown="minus(true)" @mouseup="nothing()"></a><input type="text" v-model="value" @focus="blur($event)"><a class="uk-icon-plus" @click="add()" @mousedown="add(true)" @mouseup="nothing()"></a> <span v-if="prefix" class="prefix">{{label}}</span>
</div>
</template>

<style lang="less">
@import "../css/mixins.less";

.input-number {
	display: inline-block;
	color: #5A5A5A;
	font-size: 11px;

	&.disabled, &.disabled input, &.disabled a {
		color: #A8A8A8
	}

	* {
		float: right
	}

	.prefix {
		margin-right: 5px;
		padding: 2px;
		display: inline-block;
		width: 45px;
		text-align: right;
	}

	.suffix {
		margin-left: 5px;
	}

	input {
		width: 55px !important;
		border: none;
		color: #4E4E4E;
		padding: 5px 2px !important;
		text-align: center;
	}

	a {
		.gradient(#E4E4E4,#D8D8D8,#F6F6F6);
		padding: 5px 7px;
		border: 1px solid #C1C1C1;
		color: #5A5A5A;
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
		step: {default: 1}
	},
	data () {
		return {interval: null, isMouseDown: false}
	},
	methods: {
		blur (e) {
			e.target.blur()
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
					}, 100)
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
					}, 100)
				} else {
					add()
				}
			}
		}
	}
}
</script>