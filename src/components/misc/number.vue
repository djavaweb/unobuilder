<template>
<div class="input-number" :class="{disabled: disabled}">
	<label v-if="label" :style="{width: labelWidth}">{{label}}</label>
	<div class="input-number-wrapper" :class="{focus: isFocus}">
		<input type="text" min="{{min}}" max="{{max}}" step="{{step}}" v-model="value" :disabled="disabled" placeholder="None" @focus="focus()" @blur="blur()" :style="inputStyle">
		<div class="unit-toggler" v-show="value!==''">
			<a @click="toggleSelectUnit()" :class="{'select-unit': selectUnit}">{{selectedUnit}}</a>
			<div class="unit-select" v-show="selectUnit">
				<a @click="changeUnit('px')">px</a>
				<a @click="changeUnit('%')">%</a>
				<a @click="changeUnit('vh')">vh</a>
				<a @click="changeUnit('em')">em</a>
			</div>
		</div>
		<a class="increase uk-icon-caret-up" @mousedown="increase()" @mouseup="clearTimer()"></a>
		<a class="decrease uk-icon-caret-down" @mousedown="decrease()" @mouseup="clearTimer()"></a>
	</div>
</div>
</template>

<script>
export default {
	name: 'Number',
	props: {
		value: {
			required: true,
			default: ''
		},
		label: {
			required: true,
			default: '',
		},
		labelWidth: {
			default: null
		},
		unit: {
			required: true,
			default: 'px'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		min: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 1
		},
		max: {
			type: Number,
			default: 100
		},
		inputWidth: {
			type: Number,
			default: -1
		}
	},

	computed: {
		selectedUnit () {
			if (this.value === 'auto') return '-'
			return this.unit
		},

		inputStyle () {
			if (this.inputWidth>-1) {
				return {
					width: this.inputWidth + 'px'
				}
			}
			return null;
		}
	},

	methods: {
		/**
		 * Change unit value
		 * @param  {Number} value
		 * @return {void}
		 */
		changeUnit (value) {
			this.$set('unit', value)
			this.$set('selectUnit', false)
		},

		/**
		 * Increase value
		 * @return {void}
		 */
		increase () {
			if (isNaN(this.value) || this.disabled) return
			let self = this, value

			this.timer = setInterval(function () {
				value = parseInt(self.value)
				if (value < self.max) self.$set('value', value + self.step)
			}, 100)
		},

		/**
		 * Decrease value
		 * @return {void}
		 */
		decrease () {
			if (isNaN(this.value) || this.disabled) return
			let self = this, value

			this.timer = setInterval(function () {
				value = parseInt(self.value)
				if (value > self.min) self.$set('value', value - self.step)
			}, 100)
		},

		/**
		 * Clear timer interval
		 * @return {void}
		 */
		clearTimer () {
			clearInterval(this.timer)
		},


		/**
		 * Toggle show/hide unit selector
		 * @return {void}
		 */
		toggleSelectUnit () {
			if (this.disabled) return
			this.$set('selectUnit', !this.selectUnit)
		},


		/**
		 * Input on :focus
		 * @return {void}
		 */
		focus () {
			this.$set('isFocus', true)
			this.$set('selectUnit', false)
		},

		blur () {
			this.$set('isFocus', false)
		}
	},

	ready () {
		this.$set('id', this.$root.generateId('number'))
		this.$el.setAttribute('id', this.id)
	},

	data () {
		return {
			id: '',
			selectUnit: false,
			isFocus: false,
			timer: null,
			units: ['px', 'em', '%']
		}	
	}
}
</script>