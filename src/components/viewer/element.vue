<template>
<div v-if="isType('section')" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
	<slot></slot>
	<element v-if="isKind('section')" v-for="element in data.elements" :data="element" :index="$index"></element>
	<div v-if="isKind('container')" class="element uk-container uk-container-center" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}">
		<element v-for="element in data.elements" :data="element" :index="$index"></element>
	</div>
</div>

<div v-if="isType('grid') && isKind('row')" class="uk-grid uk-grid-collapse" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
	<element v-for="element in data.elements" :data="element" :index="$index"></element>
</div>

<div v-if="isType('grid') && isKind('column')" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
	<div class="element" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}"></div>
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

			// Basic class
			classList.element = true
			classList[this.data.type] = (this.data.type)
			classList[this.data.kind] = (this.data.kind)
			classList.parent = (!this.child)
			classList.child = this.child

			// Column Class
			classList[`uk-width-${this.data.width}`] = (this.data.kind === 'column')

			// If container set section as non element
			// So we can't select section layout
			if (this.data.kind && ['container', 'row', 'column'].includes(this.data.kind)) {
				classList.nonelement = true
				delete classList.element
			}

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