<template>
<div v-if="isType('section')" :class="classList" data-id="{{data.id}}" data-index="{{index}}" data-breadcrumb="{{data.type}}">
	<slot></slot>
	<div v-if="isKind('container')" class="element uk-container uk-container-center" data-kind="true" data-index="{{index}}" data-breadcrumb="{{data.type + ' + ' + data.kind}}">
		container
	</div>
</div>
</template>

<script>
export default {
	name: 'element',
	props: {
		index: {
			required: true,
			type: Number,
			default: null
		},

		data: {
			required: true,
			type: Object,
			default: ''
		},

		child: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classList () {
			let classList = {}
			classList.element = true

			if (this.data.type) classList[this.type] = true
			if (this.data.kind) {
				classList[this.data.kind] = true

				// If container set section as non element
				// So we can't select section layout
				if (this.data.kind === 'container') {
					classList.nonelement = true
					delete classList.element
				}
			}

			if (!this.child) classList.parent = true
			else classList.child = true

			return classList
		}
	},

	methods: {
		/**
		 * Check element type is valid
		 * 
		 * @param  {String}  type [Element Type]
		 * @return {Boolean}
		 */
		isType (type) {
			return type === this.data.type
		},


		/**
		 * Check type of element type
		 * 
		 * @param  {String}  type [Type of type]
		 * @return {Boolean}
		 */
		isKind (type) {
			return type === this.data.kind
		}
	}
}
</script>