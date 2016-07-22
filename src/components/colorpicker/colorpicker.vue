<template>
  <a class="c-picker" :style="{background: activeColor}" @click="toggle()" v-if="!popup && button"></a>

  <div class="c-picker-overlay" v-show="show || popup" v-if="palette"></div>
  <div class="c-picker-wrapper" v-show="show || popup || !button" v-if="palette">
	<div class="c-sketch" :class="{'c-sketch-popup': show || popup}">
	  <div class="saturation-wrap">
		<saturation :colors.sync="colors" :on-change="childChange"></saturation>
	  </div>
	  <div class="controls">
		<div class="sliders">
		  <div class="hue-wrap">
			<hue :colors.sync="colors" :on-change="childChange"></hue>  
		  </div>
		  <div class="alpha-wrap">
			<alpha :colors.sync="colors" :on-change="childChange"></alpha>
		  </div>
		</div>
		<div class="color-wrap">
		  <div class="active-color" :style="{background: activeColor}"></div>
		</div>
	  </div>
	  <div class="field">
		<!-- rgba -->
		<div class="double">
		  <ed-in label="hex"
		  :val.sync="colors.hex"
		  :on-change="inputChange"></ed-in>  
		</div>
		<div class="single">
		  <ed-in label="r" :val.sync="colors.rgba.r" 
		  :on-change="inputChange"></ed-in>
		</div>
		<div class="single">
		  <ed-in label="g" :val.sync="colors.rgba.g" 
		  :on-change="inputChange"></ed-in>
		</div>
		<div class="single">
		  <ed-in label="b" :val.sync="colors.rgba.b"
		  :on-change="inputChange"></ed-in>
		</div>
		<div class="single">
		  <ed-in label="a" :val.sync="colors.a" :arrow-offset="0.01" :max="1"
		  :on-change="inputChange"></ed-in>
		</div>
	  </div>
	  <div class="presets">
		<div class="presets-color"
		  v-for="c in presetColors"
		  track-by="$index"
		  :style="{background: c}"
		  @click="handlePreset(c)"
		  >
		</div>
	  </div>
	  <a @click="close()" class="c-picker-ok">OK</a>
	</div>
  </div>
</template>

<script>
import colorMixin from './mixin/color'
import editableInput from './common/EditableInput.vue'
import saturation from './common/Saturation.vue'
import hue from './common/Hue.vue'
import alpha from './common/Alpha.vue'

let presetColors = [
'#2ecc71', '#27ae60', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#34495e', 
'#1abc9c', '#16a085', '#2980b9', '#8e44ad', '#f39c12', '#d35400', '#c0392b', '#2c3e50',
'#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'
]

export default {
	name: 'colorPicker',
	mixins: [colorMixin],
	props: {
		button: {
			default: true,
			required: false
		},

		palette: {
			default: true,
			required: false
		},

		popup: {
			default: false,
			required: false
		},

		click: {
			default: false,
			type: Function,
			required: false
		},

		ok: {
			default: false,
			type: Function,
			required: false
		}
	},
	components: {
		saturation,
		hue,
		alpha,
		'ed-in': editableInput
	},
	data () {
		return {
			presetColors: presetColors,
			show: false,
		}
	},
	computed: {
		activeColor () {
			var rgba = this.colors.rgba
			return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
		}
	},
	methods: {
		toggle () {
			if (this.palette) {
				this.$set('show', !this.show)
			}

			this.click && this.click.call(this)
		},

		close () {
			this.$set('show', false)
			this.ok && this.ok.call(this)
		},

		handlePreset (c) {
			this.colorChange({
				hex: c,
				a: 1,
				source: 'hex'
			})
		},
		childChange (data) {
			this.colorChange(data)
		},
		inputChange (data) {
			if (!data) {
				return
			}
			if (data.hex) {
				this.isValidHex(data.hex) && this.colorChange({
					hex: data.hex,
					source: 'hex'
				})
			} else if (data.r || data.g || data.b || data.a) {
				this.colorChange({
					r: data.r || this.colors.rgba.r,
					g: data.g || this.colors.rgba.g,
					b: data.b || this.colors.rgba.b,
					a: data.a || this.colors.rgba.a,
					source: 'rgba'
				})
			}
		}
	}
}
</script>

<style lang="less">
@import "../../css/colors.less";
@import "../../css/button.less";

// Height variables (appears count calculates by raw css)
@height2: 10px; // Appears 2 times

.c-picker {
	display: inline-block;
	width: 18px;
	height: 18px;
	margin: 2px 0 0px 5px;
	border: 1px solid @dark;
	box-shadow: 0 0px 1px 0px rgba(0,0,0,0.5);
}

.c-picker-ok {
	.button();
	line-height: normal;
	outline: none;
	width: 100%;
	border: none;
	color: @white !important;
	padding: 6px 0;
	display: block;
	text-align: center;
	font-size: 11px;
	&:hover {
		color: @soft-grey
	}
	&:active {
		border: none;
	}
}

.c-picker-wrapper {
}

.c-picker-overlay {
	background-color: rgba(23, 23, 23, 0.8);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.c-sketch {
	background: @dark;
	border-radius: 4px;
	box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.15);
	box-sizing: initial;
	padding: 10px;
	z-index: 999;

	&.c-sketch-popup {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 200px;
	}

	.saturation-wrap {
		overflow: hidden;
		padding-bottom: 75%;
		position: relative;
		width: 100%;
	}
	.controls {
		display: flex;
		.sliders {
			flex: 1;
			padding: 4px 0;
		}
		.hue-wrap {
			height: @height2;
			position: relative;
		}
		.alpha-wrap {
			height: @height2;
			margin-top: 4px;
			overflow: hidden;
			position: relative;
		}
		.color-wrap {
			border-radius: 3px;
			height: 24px;
			margin-left: 4px;
			margin-top: 4px;
			position: relative;
			width: 24px;
		}
		.active-color {
			border-radius: 2px;
			bottom: 0;
			box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 0 4px rgba(0,0,0,0.25);
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
			z-index: 2;
		}
	}
	.field {
		display: flex;
		padding-top: 4px;
		.single {
			flex: 1;
			padding-left: 6px;
		}
		.double {
			flex: 2;
		}
		.input {
			border: none;
			box-shadow: inset 0 0 0 1px #cccccc;
			font-size: 11px;
			padding: 4px 10% 3px;
			width: 80%;
		}
		.label {
			color: @soft-grey;
			display: block;
			font-size: 11px;
			padding-bottom: 4px;
			padding-top: 3px;
			text-align: center;
			text-transform: capitalize;
		}
	}
	.presets {
		margin-left: -10px;
		margin-right: -10px;
		padding-left: 10px;
		padding-top: 10px;
		.presets-color {
			border-radius: 3px;
			box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);
			cursor: pointer;
			display: inline-block;
			height: 16px;
			margin: 0 10px 10px 0;
			overflow: hidden;
			position: relative;
			vertical-align: top;
			width: 16px;
		}
	}
}
</style>