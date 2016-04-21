<template>
<div class="switch">
	<label class="switch-label" for="switch-{{id}}" v-if="switcherLabel">{{switcherLabel}}</label>
	<input class="switch-input" id="switch-{{id}}" type="checkbox" v-model="value">
	<label class="switch-paddle" for="switch-{{id}}"></label>
</div>
</template>

<script>
export default {
	name: 'Switcher',
	props: {
		value: {
			type: Boolean,
			default: true
		},

		switcherLabel: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			id: this.$root.generateId('switcher')
		}
	}
}
</script>

<style lang="less">
@import "../../css/colors.less";

@fefefe: #fefefe;
@height1-5rem: 1.5rem;
@height2rem: 2rem;

.switch {
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	color: @fefefe;
	font-size: 0.875rem;
	font-weight: bold;
	outline: 0;
	position: relative;
	user-select: none;
	display: inline-block;
	width: auto;
	vertical-align: middle;
	margin-top: 2px;
	&.right {
		float: right;
	}
}
.switch-label {
	text-transform: uppercase;
	font-weight: normal;
	font-size: 10px;
	margin-right: 5px;
	letter-spacing: -0.1px;
}
.switch-input {
	opacity: 0;
	position: absolute;
}
.switch-paddle {
	background: @dark;
	border: 1px solid @dark;
	border-radius: 100px;
	color: inherit;
	cursor: pointer;
	display: block;
	font-weight: inherit;
	height: 13px;
	position: relative;
	transition: all 0.25s ease-out;
	width: 32px;
	&::after {
		-webkit-transform: translate3d(0, 0, 0);
		background: #ffffff;
		border-radius: 100px;
		content: '';
		display: block;
		height: 9px;
		width: 9px;
		position: absolute;
		left: 3px;
		top: 2px;
		transform: translate3d(0, 0, 0);
		transition: all 0.25s ease-out;
	}
}
input+.switch-paddle {
	margin: 0;
	display: inline-block;
    vertical-align: middle;
}
input {
	&:checked+label>.switch-active {
		display: block;
	}
	&:checked+label>.switch-inactive {
		display: none;
	}
}
input:checked~.switch-paddle {
	&::after {
		left: 20px;
		background: @normal-sky-blue;
	}
}
[data-whatinput='mouse']input {
	&:focus~.switch-paddle {
		outline: 0;
	}
}
.switch-active {
	-ms-transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	display: none;
	left: 8%;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}
.switch-inactive {
	-ms-transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	position: absolute;
	right: 15%;
	top: 50%;
	transform: translateY(-50%);
}
</style>