<template lang="pug">
.input-number(:class="{disabled: disabled}")
	label(v-if="label", :style="{width: labelWidth}") {{label}}
	.input-number-wrapper(:class="{focus: focus}")
		input(type="text",
		min="{{min}}",
		max="{{max}}",
		step="{{step}}",
		:disabled="disabled",
		v-model="value",
		placeholder="None",
		@focus="onFocus()",
		@blur="onBlur()",
		:style="inputStyle")

		.unit-toggler
			a(@click="toggleUnit()", :class="{'select-unit': displayUnit}")
				| {{activeUnit}}

			.unit-select(v-if="displayUnit")
				a(@click="changeUnit(unit)", v-for="unit in units") {{unit}}

		a.increase.uk-icon-caret-up(@mousedown="dragStart($event)")
		a.decrease.uk-icon-caret-down(@mousedown="dragStart($event)")
</template>

<script>
import utils from '../../utils.js'
export default {
	name: 'inputNumber',
	props: {
		value: {
			required: true
		},
		unit: {
			required: true
		},
		label: {
			type: String
		},
		labelWidth: {
			default: null
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
		width: {
			type: Number
		},
		units: {
			type: Array,
			default: () => ['px', 'em', '%']
		}
	},

	data () {
		return {
			id: utils.generateId('number'),
			displayUnit: false,
			focus: false,
			dragState: {
				coord: 0,
				move: false,
				initialValue: 0
			}
		}
	},

	computed: {
		activeUnit () {
			if (this.value === 'auto') {
				return '-'
			}

			return this.unit
		},

		inputStyle () {
			if (this.width) {
				return {
					width: this.width + 'px'
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
		changeUnit (unit) {
			this.unit = unit
			this.displayUnit = false
		},


		/**
		 * Toggle show/hide unit selector
		 * @return {void}
		 */
		toggleUnit () {
			if (this.disabled) {
				return
			}

			this.displayUnit = !this.displayUnit
		},

		/**
		 * Input on :focus
		 * @return {void}
		 */
		onFocus () {
			this.focus = true
			this.displayUnit = false
		},

		/**
		 * Input on blur
		 * @return {void}
		 */
		onBlur () {
			this.focus = false
		},

		/**
		 * Start dragging
		 * @param  {Event} event
		 */
		dragStart (event) {
			let value = parseInt(this.value)
			if (this.value.toString().indexOf('.')>=0) {
				value = parseFloat(this.value)
			}

			if (! isNaN(value)) {
				this.dragState.move = false
				this.dragState.coord = event.pageY
				this.dragState.initialValue = value
				utils.addEvent(document, 'mousemove', this.dragMove, false)
				utils.addEvent(document, 'mouseup', this.dragEnd, false)
			}
		},

		/**
		 * On dragging
		 * @param  {Event} event
		 */
		dragMove (event) {
			let delta = parseInt((this.dragState.coord - event.pageY)/2)
			let value = this.dragState.initialValue + (delta * this.step)

			// Check minimum
			if (value<this.min) {
				value = this.min
			}

			// Check maximum number
			if (value>this.max) {
				value = this.max
			}

			this.dragState.move = true
			this.value = value
		},

		/**
		 * Drag Ended
		 * @param  {Event} event
		 */
		dragEnd (event) {
			this.dragState = {
				coord: 0,
				move: false,
				initialValue: 0
			}
			utils.removeEvent(document, 'mousemove', this.dragMove, false)
			utils.removeEvent(document, 'mouseup', this.dragEnd, false)
		}
	}
}
</script>
