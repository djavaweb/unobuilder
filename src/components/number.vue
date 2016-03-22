<template>
<div class="input-number" :class="{disabled: !enable}"><a class="uk-icon-minus" @click="minus()"></a><input type="text" v-model="value" @focus="blur($event)"><a class="uk-icon-plus" @click="add()"></a> <span>{{label}}</span>
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

	span {
		margin-right: 5px;
		padding: 2px;
		display: inline-block;
		width: 45px;
		text-align: right;
	}

	input {
		width: 40px;
		border: none;
		color: #4E4E4E;
		padding: 4px 2px;
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
	props: ['enable', 'value', 'label', 'min', 'max'],
	methods: {
		blur (e) {
			e.target.blur()
		},

		minus () {
			if (this.enable) {
				let min = (this.min)? this.min: 0
				this.value -= 1
				if (this.value < min) this.value = min
			}
		},

		add () {
			if (this.enable) {
				let max = (this.max)? this.max: 100
				this.value += 1
				if (this.value > max) this.value = max
			}
		}
	}
}
</script>