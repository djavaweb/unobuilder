<template>
<div class="input-number" :class="{disabled: !enable}"><span v-if="suffix" class="suffix">{{label}}</span><a class="uk-icon-minus" @click="minus()"></a><input type="text" v-model="value" @focus="blur($event)"><a class="uk-icon-plus" @click="add()"></a> <span v-if="prefix" class="prefix">{{label}}</span>
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
	methods: {
		blur (e) {
			e.target.blur()
		},

		minus () {
			if (this.enable) {
				let min = (this.min)? this.min: 0
				this.value -= this.step
				if (this.value < min) this.value = min
			}
		},

		add () {
			if (this.enable) {
				let max = (this.max)? this.max: 100
				this.value += this.step
				if (this.value > max) this.value = max
			}
		}
	}
}
</script>