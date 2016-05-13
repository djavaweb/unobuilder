<template>
<div class="input-number" :class="{disabled: disabled}">
	<label v-if="label" :style="{width: labelWidth}">{{label}}</label>
	<div class="input-number-wrapper">
		<input type="text" number min="{{min}}" max="{{max}}" step="{{step}}" v-model="value" :disabled="disabled">
		<div class="unit-toggler">
			<a @click="toggleSelectUnit()">{{selectedUnit}}</a>
			<div class="unit-select" v-show="selectUnit">
				<a @click="changeUnit('px')">px</a>
				<a @click="changeUnit('em')">em</a>
				<a @click="changeUnit('%')">%</a>
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
			default: 0
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
		}
	},

	computed: {
		selectedUnit () {
			if (this.value === 'auto') return '-'
			return this.unit
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
				self.$set('value', value + 1)
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
				self.$set('value', value - 1)
			}, 100)
		},

		/**
		 * Clear timer interval
		 * @return {void}
		 */
		clearTimer () {
			clearInterval(this.timer)
		},


		toggleSelectUnit () {
			if (this.disabled) return
			this.$set('selectUnit', !this.selectUnit)
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
			timer: null,
			units: ['px', 'em', '%']
		}	
	}
}
</script>