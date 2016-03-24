<template>
<div class="switch" :class="[float]">
	<input class="switch-input" id="switch-{{id}}" type="checkbox" v-model="value">
	<label class="switch-paddle" for="switch-{{id}}"></label>
</div>
</template>

<script>
export default {
	name: 'Switch',
	props: {
		value: {default: true},
		float: {default: 'right'}
	},
	data() {
		return {
			id: Date.now()
		}
	}
}
</script>

<style lang="less">
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
	margin-bottom: 1rem;
	outline: 0;
	position: relative;
	user-select: none;
	&.right {
		float: right;
	}

	&.left {}
}
.switch-input {
	opacity: 0;
	position: absolute;
}
.switch-paddle {
	background: #ffffff;
	border-radius: 100px;
	color: inherit;
	cursor: pointer;
	display: block;
	font-weight: inherit;
	height: 17px;
	position: relative;
	transition: all 0.25s ease-out;
	border: 1px solid #C0C0C0;
	width: 3rem;
	&::after {
		-webkit-transform: translate3d(0, 0, 0);
		background: #c0c0c0;
		border-radius: 100px;
		content: '';
		display: block;
		height: 12px;
		left: 0.25rem;
		position: absolute;
		top: 3px;
		transform: translate3d(0, 0, 0);
		transition: all 0.25s ease-out;
		width: 12px;
	}
}
input+.switch-paddle {
	margin: 0;
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
		left: 2rem;
		background: #2199e8;
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
.switch.tiny {
	.switch-paddle {
		font-size: 0.625rem;
		height: 1.3rem;
		width: 3rem;
		&::after {
			height: 1rem;
			width: 1rem;
		}
	}
	input {
		&:checked~.switch-paddle {
			after {
				left: 1.75rem;
			}
		}
	}
}
.switch.small {
	.switch-paddle {
		font-size: 0.75rem;
		height: 1.75rem;
		width: 3.5rem;
		&::after {
			height: 1.25rem;
			width: 1.25rem;
		}
	}
	input {
		&:checked~.switch-paddle {
			after {
				left: 2rem;
			}
		}
	}
}
.switch.large {
	.switch-paddle {
		font-size: 1rem;
		height: 2.5rem;
		width: 5rem;
		&::after {
			height: @height1-5rem;
			width: 2rem;
		}
	}
	input {
		&:checked~.switch-paddle {
			after {
				left: 2.75rem;
			}
		}
	}
}
</style>