<template lang="pug">
.switch
	label.switch-label(for="switch-{{id}}", v-if="label") {{label}}
	input.switch-input(id="switch-{{id}}", type="checkbox", v-model="value")
	label.switch-paddle(for="switch-{{id}}")
</template>

<script>
import utils from '../../utils.js'
export default {
	name: 'switcher',
	props: {
		value: {
			type: Boolean,
			default: true
		},

		label: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			id: utils.generateId('switcher')
		}
	}
}
</script>
