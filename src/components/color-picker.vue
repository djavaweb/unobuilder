<template>
	<div class="cp color-picker-toggler">
		<div class="cp color-transparent" @click="transparent()"></div>
		<a class="cp picker" @click="toggle()" :style="bgColor"></a><span class="hex" v-if="showHex">#{{hexColor}}</span>
		<div class="cp color-picker" v-if="show" :class="[position]">
			<div class="cp _variations" :style="variations">
				<div class="cp _whites">
					<div class="cp _blacks">
						<div class="cp _cursor" v-if="cursor" :style="colorCursor"></div>
						<div class="cp _mouse-trap" @mousedown="drag($event, 'color')"></div>
					</div>
				</div>
			</div>
			<div class="cp _hues">
				<div class="cp _ie-1"></div>
				<div class="cp _ie-2"></div>
				<div class="cp _ie-3"></div>
				<div class="cp _ie-4"></div>
				<div class="cp _ie-5"></div>
				<div class="cp _ie-6"></div>
				<div class="cp _cursor" :style="hueCursor"></div>
				<div class="cp _mouse-trap" @mousedown="drag($event, 'hue')"></div>
			</div>

			<div class="cp color-alpha">
				<div class="cp inner" :style="bgColorAlpha">
					<div class="cp alpha-handler"></div>
				</div>
			</div>

			<div class="cp value">
				<label class="cp"><input class="hex cp" v-model="hexColor" maxlength="6"></label>
				<div class="cp">RGBA <input v-model="R" class="cp"> <input v-model="G" class="cp"> <input v-model="B" class="cp"> <input v-model="A" class="cp"></div>
			</div>
		</div>
	</div>
</template>

<script>
import Slider from "nouislider"

const WH = 160;

export default {
	name: 'colorPicker',
	props: {
		enable: {default: true},
		color: {default: {hex: '#ffffff', rgba: [255, 255, 255, 1]}},
		position: {default: 'left'},
		showHex: {default: false}
	},
	data() {
		return {
			alpha: 0,
			alphaHandler: null,
			show: false,
			hue: null,
			hsv: {h: 0, s: 0, v: 0},
			cursor: {},
			rgb: {r: 255, g: 255, b: 255},
			dragType: null,
			dragRect: null,
			hexRegex: /^([A-Fa-f0-9]{6})$/,
			rgbRegex: /^([0-9]{1,3})$/
		}
	},
	ready () {
		let self = this

		self.$set('rgb', {
			r: self.color.rgba[0],
			g: self.color.rgba[1],
			b: self.color.rgba[2]
		})
		self.$set('alpha', self.color.rgba[3])

		this.$on('clicked', function (params) {
			let el = params.el

			if (! el.classList.contains('cp')) {
				self.close()
			}
		})

		self.$watch('show', function (val) {
			if (val) {
				let alphaHandler = self.$el.querySelector('.alpha-handler');
				self.$set('alphaHandler', Slider.create(alphaHandler, {
					start: self.alpha * 100,
					connect: 'lower',
					step: 1,
					range: {
						min: 0,
						max: 100
					}
				}));

				self.alphaHandler.on('update', function(){
					let selector = alphaHandler.querySelectorAll('*')
					for (let i in selector) {
						if (selector[i].classList && !selector[i].classList.contains['cp']) selector[i].classList.add('cp')
					}
				});

				self.alphaHandler.on('slide', function(strValue, e, value){
					let alpha = value[0] / 100
					self.$set('alpha', alpha)
					self.$set('color.rgba', [self.color.rgba[0], self.color.rgba[1], self.color.rgba[2], alpha])
				});
			}
		})
		/**/
	},
	computed: {
		bgColor () {
			let self = this;
			return {
				background: self.color.hex
			}
		},

		bgColorAlpha () {
			let self = this,
			rgb = self.R +', '+ self.G +', '+ self.B

			return {
				background: 'linear-gradient(to right, rgba('+ rgb +', 0), rgb('+ rgb +'))'
			}
		},

		R: {
			get () { return this.color.rgba[0] },
			set (val) {
				if (! this.isRGB(val)) return
				this.$set('color.rgba', [val, this.G, this.B, this.A])
				this.RenderRGBCursor()
			}
		},

		G: {
			get () { return this.color.rgba[1] },
			set (val) {
				if (! this.isRGB(val)) return
				this.$set('color.rgba', [this.R, val, this.B, this.A])
				this.RenderRGBCursor()
			}
		},

		B: {
			get () { return this.color.rgba[2] },
			set (val) {
				if (! this.isRGB(val)) return
				this.$set('color.rgba', [this.R, this.G, val, this.A])
				this.RenderRGBCursor()
			}
		},

		A: {
			get () { return this.color.rgba[3] },
			set (val) {
				val = (val > 1)? 1: val

				if (this.alphaHandler && !isNaN(parseFloat(val))) {
					this.alphaHandler.set(val * 100)
					this.$set('alpha', val)
					this.$set('color.rgba', [this.R, this.G, this.B, val])
				}
			}
		},

		variations () {
			let self = this;
			return {
				backgroundColor: '#' + self.HSVtoRGB(self.hsv.h, 1, 1)
			}
		},

		colorCursor () {
			let self = this;
			return {
				left: self.cursor.x - 5 + 'px',
				top: self.cursor.y - 5 + 'px'
			}
		},

		hueCursor () {
			let self = this;
			return {top: (self.hsv.h * WH) - 5 + 'px'}
		},

		hexColor: {
			get () {
				return this.color.hex.replace(/\#/g, '')
			},

			set (val) {
				if (! this.hexRegex.test(val)) return false;
				
				let hsv = this.RGBtoHSV(val)
				this.$set('color.hex', '#' + val)
				this.$set('hsv', hsv)
				this.$set('cursor', {
					x: hsv.v * WH,
					y: WH - ((hsv.s * WH))
				})
			}
		}
	},
	methods: {
		toggle () {
			if (this.enable) this.$set('show', !this.show)
		},

		close () {
			this.$set('show', false)
		},

		transparent () {
			this.$set('color.hex', 'transparent')
			this.$set('color.rgba', [255, 255, 255, 0])
		},

		RenderRGBCursor () {
			let hex = this.RGBtoHex(this.R, this.G, this.B)
			this.$set('color.hex', '#' + hex)

			let hsv = this.RGBtoHSV(hex);
			this.$set('hsv', hsv)
			this.$set('cursor', {
				x: hsv.v * WH,
				y: WH - ((hsv.s * WH))
			})
		},

		isRGB (val) {
			return this.rgbRegex.test(val) && val > -1 && val <= 255
		},

		drag (e, type) {
			var rect = e.target.getBoundingClientRect(),
			self = this;

			this.dragType = type;
			this.dragRect = {
				x: rect.left,
				y: rect.top,
				width: rect.right - rect.left,
				height: rect.bottom - rect.top
			};
			this.dragging(e.offsetX || e.layerX, e.offsetY || e.layerY);

			window.addEventListener('mousemove', self.move, false)
			window.addEventListener('mouseup', function () {
				window.removeEventListener('mousemove', self.move, false)
			}, false);
		},

		move (e) {
			e.preventDefault();
			this.dragging(e.clientX - this.dragRect.x, e.clientY - this.dragRect.y);
		},

		dragging (x, y) {
			x = Math.max(Math.min(x, this.dragRect.width), 0)
			y = Math.max(Math.min(y, this.dragRect.height), 0)

			if (this.dragType === 'hue') {
				this.hue = y;
				this.hsv.h = y / this.dragRect.height;
				this.hueBg = this.HSVtoRGB(this.hsv.h, 1, 1)

				let rgb = this.HSVtoRGB(this.hsv.h, 1, 1, 'rgb')
				this.$set('color.rgba', [rgb.r, rgb.g, rgb.b, this.alpha])
			}
			else {
				this.cursor = {x: x, y: y};
				this.hsv.s = x / this.dragRect.width;
				this.hsv.v = 1 - y / this.dragRect.height;

				let rgb = this.HSVtoRGB(this.hsv.h, this.hsv.s, this.hsv.v, 'rgb')
				this.$set('color.rgba', [rgb.r, rgb.g, rgb.b, this.alpha])
			}

			if (typeof this.hsv.s !== 'undefined') {
				this.$set('color.hex', '#' + this.HSVtoRGB(this.hsv));
			}
		},

		HSVtoRGB (h, s, v, output) {
			if (typeof h === 'object') {
				s = h.s;
				v = h.v;
				h = h.h;
			}

			var i = Math.floor(h * 6),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);

			var r, g, b;

			switch (i % 6) {
				case 0:
					r = v;
					g = t;
					b = p;
				break;
				case 1:
					r = q;
					g = v;
					b = p;
				break;
				case 2:
					r = p;
					g = v;
					b = t;
				break;
				case 3:
					r = p;
					g = q;
					b = v;
				break;
				case 4:
					r = t;
					g = p;
					b = v;
				break;
				case 5:
					r = v;
					g = p;
					b = q;
				break;
			}

			r = Math.floor(r * 255)
			g = Math.floor(g * 255)
			b = Math.floor(b * 255)

			if (typeof output !== 'undefined' && output) {
				let self = this
				return {
					r: r,
					g: g,
					b: b,
					a: self.alpha
				}
			}

			return (r + 256).toString(16).slice(1)
			+ (g + 256).toString(16).slice(1)
			+ (b + 256).toString(16).slice(1);
		},

		RGBtoHex (...rgb) {
			let color = []
			for (let i in rgb) {
				let hex = (parseInt(rgb[i])).toString(16);
				hex = (hex.length === 1)? '0' + hex: hex;
				color.push(hex)
			}
			return color.join('');
		},

		hexToRgb (hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		},

		RGBtoHSV (hex) {
			let rgb = this.hexToRgb(hex),
			r = rgb.r, g = rgb.g, b = rgb.b

			console.log(rgb)

			var max = Math.max(r, g, b), min = Math.min(r, g, b),
			d = max - min,
			h,
			s = (max === 0 ? 0 : d / max),
			v = max / 255;

			switch (max) {
				case min: h = 0; break;
				case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
				case g: h = (b - r) + d * 2; h /= 6 * d; break;
				case b: h = (r - g) + d * 4; h /= 6 * d; break;
			}

			return {
				h: h,
				s: s,
				v: v
			};
		}
	}
}
</script>

<style lang="less">
@import "../../node_modules/nouislider/distribute/nouislider.min.css";

@wh200: 160px;

.color-transparent {
	background: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAAwADAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpQkksS2524dx92Rf7q/wC1QB8wftsE48GDI2D7aFQ/eUfuODQAH9q3k7fBmEx8ijVOFb+9/qaAPL/jZ8Vh8ThoudF/sx9O87c32rz/ADvM8v8A2Fxjy/fOfagD/9k=");
	width: 8px;
	height: 8px;
	position: absolute;
	top: 0;
	left: 0;
	border: 1px solid #cccccc;
}
.color-picker-toggler {
	display: inline-block;
	vertical-align: top;
	position: relative;
	a.picker {
		width: 20px;
		height: 17px;
		display: inline-block;
		border: 1px solid #c0c0c0;
	}
	.hex {
		vertical-align: top;
	}
}
.color-picker {
	position: absolute;
	background:#ffffff;
	border:1px solid #dddddd;
	padding:5px;
	display:inline-block;
	top: 20px;
	z-index: 999;
	&.left {
		left: (-30 - @wh200);
	}
	.value {
		margin-top: 10px;
		font-size: 12px;
		color: #000000;

		div {
			float: none;
			width: 100%
		}
		label {
			float: right;
			display: inline-block;
			&:before {
				content: '\#'
			}
		}
		input {
			&.hex {
				width: 40px;
			}
			width: 20px;
		}
		&:after {
			display: block;
			clear: both;
			content: ' '
		}
	}
	> ._variations {
		border:1px solid #808080;
		width:@wh200;
		height:@wh200;
		float:left;
		transition:background-color 250ms;
		> ._whites {
			width:@wh200;
			height:@wh200;
			background:-webkit-linear-gradient(left,#ffffff 0,transparent 100%);
			background:-moz-linear-gradient(left,#ffffff 0,transparent 100%);
			background:-ms-linear-gradient(left,#ffffff 0,transparent 100%);
			background:linear-gradient(to right,#ffffff 0,transparent 100%);
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#00ffffff', GradientType='1')";
			> ._blacks {
				width:@wh200;
				height:@wh200;
				background:-webkit-linear-gradient(top,transparent 0,#000000 100%);
				background:-moz-linear-gradient(top,transparent 0,#000000 100%);
				background:-ms-linear-gradient(top,transparent 0,#000000 100%);
				background:linear-gradient(to bottom,transparent 0,#000000 100%);
				filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#ff000000')";
				position:relative;
				> ._cursor {
					position:absolute;
					display:inline-block;
					width:8px;
					height:8px;
					border:1px solid #ffffff;
					border-right-color:#000000;
					border-left-color:#000000;
					border-radius:5px;
				}
				> ._mouse-trap {
					position:relative;
					z-index:1;
					width:@wh200;
					height:@wh200;
				}
			}
		}
	}
	> ._hues {
		border:1px solid #808080;
		position:relative;
		margin-left: (@wh200 + 10);
		height:@wh200;
		width:30px;
		background:-webkit-linear-gradient(top,#ff0000 0%,#ffff00 17%,#00ff00 33%,#00ffff 50%,#0000ff 67%,#ff00ff 83%,#ff0000 100%);
		background:-moz-linear-gradient(top,#ff0000 0%,#ffff00 17%,#00ff00 33%,#00ffff 50%,#0000ff 67%,#ff00ff 83%,#ff0000 100%);
		background:-ms-linear-gradient(top,#ff0000 0%,#ffff00 17%,#00ff00 33%,#00ffff 50%,#0000ff 67%,#ff00ff 83%,#ff0000 100%);
		background:linear-gradient(to bottom,#ff0000 0%,#ffff00 17%,#00ff00 33%,#00ffff 50%,#0000ff 67%,#ff00ff 83%,#ff0000 100%);
		> ._cursor {
			position:absolute;
			left:-7px;
			width:33px;
			height:0;
			border:5px solid transparent;
			border-left-color:#808080;
			border-right-color:#808080;
		}
		> ._mouse-trap {
			position:absolute;
			z-index:1;
			top:0;
			left:0;
			width:30px;
			height:@wh200;
		}
		> ._ie-1 {
			height:17%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0000', endColorstr='#ffff00')";
		}
		> ._ie-2 {
			height:16%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffff00', endColorstr='#00ff00')";
		}
		> ._ie-3 {
			height:17%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ff00', endColorstr='#00ffff')";
		}
		> ._ie-4 {
			height:17%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffff', endColorstr='#0000ff')";
		}
		> ._ie-5 {
			height:16%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#0000ff', endColorstr='#ff00ff')";
		}
		> ._ie-6 {
			height:17%;
			filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff00ff', endColorstr='#ff0000')";
		}
	}
}

.color-alpha {
	position: relative;
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
	height: 6px;
    margin: 10px 0 5px;
    border: 1px solid #848484;

	.inner {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.noUi-horizontal {
		height: auto;
		.noUi-handle {
			border-color: #848484;
			width: 17px;
			height: 17px;
			border-radius: 100%;
			left: -7px;
			top: -5px;
			box-shadow: none;
			&:before, &:after {
				background: none;
			}
		}
	}

	.noUi-target {
		border: none;
	}
}
</style>