<template>
	<div v-if="isKind('section')" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
		<slot></slot>
		<div class="element section" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :style="elementStyle" :class="{empty: data.elements.length<1}">
			<element v-for="element in data.elements" :data="element" :index="$index"></element>
		</div>
	</div>

	<div v-if="isKind('container')" class="uk-container uk-container-center" :class="classListParent" :style="containerStyle">
		<div class="element container" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :style="elementStyle" :class="{empty: data.elements.length<1}">
			<element v-for="element in data.elements" :data="element" :index="$index"></element>
		</div>
	</div>

	<div v-if="isType('grid') && isKind('row')" class="uk-grid uk-grid-collapse" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}" :style="elementStyle">
		<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
	</div>

	<div v-if="isType('grid') && isKind('column')" :class="classList" data-id="{{data.id}}" data-index="{{index}}" :style="elementStyle">
		<div class="element column" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :class="{empty: data.elements.length<1}">
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
			elementStyle: {},
			screenView: 'large',
			cacheValue: {}
		}
	},

	computed: {
		/**
		 * Class list for element
		 * @return {Object}
		 */
		classList () {
			// Basic class
			let cssClass = {}
			cssClass[this.data.type] = (this.data.type)? true: false
			cssClass[this.data.kind] = (this.data.kind)? true: false
			cssClass.parent = (!this.child)? true: false
			cssClass.child = (this.child)? true: false
		
			// Column Class
			if (this.data.kind === 'column') {
				cssClass[`uk-width-1-${this.itemLength}`] = true
				delete cssClass.element
			}

			return cssClass
		},

		/**
		 * Class list for parent element
		 * @return {Object}
		 */
		classListParent () {
			let cssClass = $.extend(true, {}, this.classList)

			// Set wrapper as non element
			// So we can't select wrapper element
			if (this.data.kind) {
				if (['section', 'container', 'row', 'column'].includes(this.data.kind)) {
					cssClass.nonelement = true
					delete cssClass.element
				}
			}

			return cssClass
		},


		/**
		 * Height style only for container
		 * @return {Object}
		 */
		containerStyle () {
			let cssStyle = {}
			if (this.elementStyle.height && this.elementStyle.height.indexOf('%') > 0) cssStyle.height = this.elementStyle.height
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
		}
	},

	ready () {
		let self = this, elementStyle

		// Large watcher
		self.$watch(function () {
			return self.$root.breakpointWatcher(self.data.props.large)
		}, function (value) {
			self.$root.breakpointPropApplyChange(self.data, value, self.cacheValue, 'large', 'medium')
		}, {deep: true})

		// Medium Watcher
		self.$watch(function () {
			return self.$root.breakpointWatcher(self.data.props.medium)
		}, function (value) {
			self.$root.breakpointPropApplyChange(self.data, value, self.cacheValue, 'medium', 'small')
		}, {deep: true})

		// Small Watcher
		self.$watch(function () {
			return self.$root.breakpointWatcher(self.data.props.small)
		}, function (value) {
			self.$root.breakpointPropApplyChange(self.data, value, self.cacheValue, 'small', 'mini')
		}, {deep: true})
		

		// Watcher
		self.$watch(function () {
			return self.$root.styleWatcher(self.data)
		}, function (value, old) {
			// If current element is flex, forc echild align-self as align-items
			if (value[self.screenView].display === 'flex') self.$broadcast('childAlignSelf', value[self.screenView].alignItems)

			// Style handler
			self.$root.styleHandler(value, old)

			// Set element style
			self.$set('elementStyle', value[self.screenView])
		}, {deep: true})


		// When flex container change align-items, all children will auto update it's align-self property
		self.$on('childAlignSelf', function (alignItems) {
			self.data.props[self.screenView].display.settings.flex.item.alignSelf = alignItems
		})

		// When screen change
		self.$on('changeScreenView', function (breakpoint) {

			// Set screen breakpoint and it's child
			self.$set('screenView', breakpoint)
			self.$broadcast('changeScreenView', breakpoint)

			// Render new style
			elementStyle = self.$root.styleWatcher(self.data)
			self.$set('elementStyle', elementStyle[breakpoint])
		})


		// When ready apply style immediately
		elementStyle = self.$root.styleWatcher(self.data)
		self.$set('elementStyle', elementStyle[self.screenView])
	}
}
</script>