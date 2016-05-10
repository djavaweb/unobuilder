<template>
	<div v-if="isKind('section')" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
		<slot></slot>
		<div class="element section" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :style="elementStyle">
			<element v-for="element in data.elements" :data="element" :index="$index"></element>
		</div>
	</div>

	<div v-if="isKind('container')" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
		<slot></slot>
		<div class="uk-container uk-container-center" :class="classListParent">
			<div class="element container" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :style="elementStyle">
				<element v-for="element in data.elements" :data="element" :index="$index"></element>
			</div>
		</div>
	</div>

	<div v-if="isType('grid') && isKind('row')" class="uk-grid uk-grid-collapse" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}" :style="elementStyle">
		<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
	</div>

	<div v-if="isType('grid') && isKind('column')" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
		<div class="element column" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :style="elementStyle">
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
			regValArray: /(.*)\[\]$/g
		}
	},

	computed: {
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
		let self = this
		let watcherMap = function () {
			let obj = {}
			_.each(self.data.props, function (properties, breakpoint) {
				let style = {
					position: properties.position.value,

					/* Display */
					display: properties.display.value,

					/* Margin */
					marginTop: properties.marginTop.value + properties.marginTop.unit,
					marginRight: properties.marginRight.value + properties.marginRight.unit,
					marginBottom: properties.marginBottom.value + properties.marginBottom.unit,
					marginLeft: properties.marginLeft.value + properties.marginLeft.unit,

					/* Padding */
					paddingTop: properties.paddingTop.value + properties.paddingTop.unit,
					paddingRight: properties.paddingRight.value + properties.paddingRight.unit,
					paddingBottom: properties.paddingBottom.value + properties.paddingBottom.unit,
					paddingLeft: properties.paddingLeft.value + properties.paddingLeft.unit,

					/* Border */
					borderTop: properties.borderTop.value + properties.borderTop.unit +' '+ properties.borderTop.style + ' ' + properties.borderTop.color,
					borderRight: properties.borderRight.value + properties.borderRight.unit +' '+ properties.borderRight.style + ' ' + properties.borderRight.color,
					borderBottom: properties.borderBottom.value + properties.borderBottom.unit +' '+ properties.borderBottom.style + ' ' + properties.borderBottom.color,
					borderLeft: properties.borderLeft.value + properties.borderLeft.unit +' '+ properties.borderLeft.style + ' ' + properties.borderLeft.color,
				}


				// Dimension
				/*if (self.data.kind !== 'container') {
					style.width = properties.width.value + properties.width.unit
					style.height = properties.height.value + properties.height.unit
				}*/

				// Position
				if (properties.position.value === 'absolute' || properties.position.value === 'fixed') {
					let top = properties.position.settings[properties.position.value].top
					style.top = top.value + top.unit

					let bottom = properties.position.settings[properties.position.value].bottom
					style.bottom = bottom.value + bottom.unit

					let right = properties.position.settings[properties.position.value].right
					style.right = right.value + right.unit

					let left = properties.position.settings[properties.position.value].left
					style.left = left.value + right.left
				}

				// Display Properties
				if (properties.display.value === 'flex') {
					let reverse = (properties.display.settings.flex.container.reverse)? '-reverse': '';
					style.flexDirection = properties.display.settings.flex.container.direction + reverse;
					style.alignItems = properties.display.settings.flex.container.alignItems
					style.justifyContent = properties.display.settings.flex.container.justifyContent
					style.alignContent = properties.display.settings.flex.container.alignContent

					let reverseWrap = (properties.display.settings.flex.container.reverseWrap)? '-reverse': ''
					style.flexWrap = properties.display.settings.flex.container.wrap + reverseWrap
				}

				// Set Rows display properties like it's parent
				if (self.data.elements.length > 0 && self.data.elements[0].kind === 'row') {
					self.data.elements[0].props[breakpoint].display = properties.display
				}

				// Set grow if element kind is row
				if (self.data.kind === 'row') {
					style.flexGrow = 1
					style.width = '100%'

					// Delete position and other style
					_.each(['position', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom'], function (item) {
						delete style[item]
					})
				}

				obj[breakpoint] = style
			})

			return obj
		}

		let watcherFn = function (value, old) {
			self.$set('elementStyle', value[self.screenView])

			self.$nextTick(function () {

				// Select active element immediately
				self.$root.selectOutline(self.$root.activeElement(self.$root.selected.element))

				// Set outline canvas for margin
				let newValue = value[self.screenView], oldValue = old[self.screenView]
				if (newValue.marginTop !== oldValue.marginTop
				|| newValue.marginRight !== oldValue.marginRight
				|| newValue.marginBottom !== oldValue.marginBottom
				|| newValue.marginLeft !== oldValue.marginLeft) {
					self.$root.parent().$broadcast('drawDiagonalOutline', 'margin')
				}

				// Set outline canvas for padding
				if (newValue.paddingTop !== oldValue.paddingTop
				|| newValue.paddingRight !== oldValue.paddingRight
				|| newValue.paddingBottom !== oldValue.paddingBottom
				|| newValue.paddingLeft !== oldValue.paddingLeft) {
					self.$root.parent().$broadcast('drawDiagonalOutline', 'padding')
				}
			})
		}
		
		// Watcher
		self.$watch(watcherMap, watcherFn, {deep: true})

		// When ready apply style immediately
		let elementStyle = watcherMap()
		self.$set('elementStyle', elementStyle[self.screenView])


		// When screen change
		self.$on('changeScreenView', function (breakpoint) {
			
			// Set screen breakpoint and it's child
			self.$set('screenView', breakpoint)
			self.$broadcast('changeScreenView', breakpoint)

			// Get new style
			elementStyle = watcherMap()
			self.$set('elementStyle', elementStyle[breakpoint])

			// Re-select selected element
			self.$nextTick(function () {
				self.$root.eventFire(self.$root.activeElement(self.$root.selected.element), 'click')
			})
		})
	}
}
</script>