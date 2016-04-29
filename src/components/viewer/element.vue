<template>
{{data|json}}
<div v-if="isType('section')" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
	<slot></slot>
	<element v-if="isKind('section')" v-for="element in data.elements" :data="element" :index="$index"></element>
	<div v-if="isKind('container')" class="element uk-container uk-container-center" :class="classList" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}">
		<element v-for="element in data.elements" :data="element" :index="$index"></element>
	</div>
</div>

<div v-if="isType('grid') && isKind('row')" class="uk-grid uk-grid-collapse" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
	<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
</div>

<div v-if="isType('grid') && isKind('column')" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
	<div class="element column" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}">
		<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
	</div>
</div>
</template>

<script>
import _ from 'underscore'

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
		},

		itemLength: {
			type: Number,
			default: 0
		}
	},

	data () {
		return {
			regValArray: /(.*)\[\]$/g
		}
	},

	computed: {
		classList () {
			let cssClass = {}

			// Basic class
			cssClass.element = true
			cssClass[this.data.type] = (this.data.type)? true: false
			cssClass[this.data.kind] = (this.data.kind)? true: false
			cssClass.parent = (!this.child)? true: false
			cssClass.child = (this.child)? true: false
			cssClass['deep-' + this.data.deep] = true

			// Column Class
			if (this.data.kind === 'column') {
				cssClass[`uk-width-1-${this.itemLength}`] = true
			}

			return cssClass
		},

		classListParent () {
			let cssClass = _.extend({}, this.classList)

			// Set wrapper as non element
			// So we can't select wrapper element
			if (this.data.kind && ['container', 'row', 'column'].includes(this.data.kind)) {
				cssClass.nonelement = true
				delete cssClass.element
			}

			return cssClass
		},


		elementStyle () {
			let self = this,
			cssStyle = {},
			computedStyle = self.data.props[self.$root.screenView]

			this.$nextTick(function () {

				_.each(computedStyle, function (data, prop) {
					let compiledValue

					switch (true) {
						// If value is string
						case _.isString(data.value):
						break;

						// If value is Object
						case self.isRealObject(data.value):
							_.each(data.value, function (value, property) {
								if (self.regValArray.test(property)) {

									// Replace [] at the end
									property = property.replace(self.regValArray, "$1")

									// Property suffix such as padding-top, padding-bottom, etc
									cssStyle[prop + '-' + property] = self.propFlattenValue(value)
								}
							})
						break;

						// If value is Array
						case _.isArray(data.value):
						break;
					}

					if (compiledValue) cssStyle[prop] = compiledValue
				})
			})

			return cssStyle
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
		},


		/**
		 * If value is real object, not array nor function
		 * @param  {Object}  obj
		 * @return {Boolean}
		 */
		isRealObject (obj) {
			return _.isObject(obj) && ! _.isArray(obj) && ! _.isFunction(obj) && _.size(obj) > 0
		},

		/**
		 * Flatten properties value
		 * @param  {Array} value
		 * @return {void}
		 */
		propFlattenValue (value) {
			let self = this, flatten = [],
			delimiter = _.last(value)
			delete value[value.length - 1]

			// Remove undefined value
			let cleanValue = value.filter(n => true)

			_.each(cleanValue, function (val, index) {
				if (_.isArray(val)) flatten.push(self.propFlattenValue(val))
				else flatten.push(val)
			})

			return flatten.join(delimiter)
		}
	}
}
</script>