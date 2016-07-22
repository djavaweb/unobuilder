<template>
	<style>{{stylesheet()}}</style>
	<div v-if="isKind('section')" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
		<slot></slot>
		<div class="uno-el" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :class="[data.elements.length<1?$root.klass('col-empty'):'',$root.klass('section')]">
			<element v-for="element in data.elements" :data="element" :index="$index"></element>
		</div>
	</div>

	<div v-if="isKind('container')" class="uk-container uk-container-center" :class="classListParent" :style="containerStyle">
		<div class="uno-el" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :class="[data.elements.length<1?$root.klass('col-empty'):'',$root.klass('container')]">
			<element v-for="element in data.elements" :data="element" :index="$index"></element>
		</div>
	</div>

	<div v-if="isType('grid') && isKind('row')" class="uk-grid" :class="classListParent" data-id="{{data.id}}" data-index="{{index}}">
		<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
	</div>

	<div v-if="isType('grid') && isKind('column')" :class="classList" data-id="{{data.id}}" data-index="{{index}}">
		<div class="uno-el" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" :class="[data.elements.length<1?$root.klass('col-empty'):'',$root.klass('column')]">
			<element v-for="element in data.elements" :data="element" :index="$index" :item-length="data.elements.length"></element>
		</div>
	</div>

	<div v-if="isType('component')" @dblclick="activateEditor()" :contenteditable="contentEditable" class="uno-el" :class="classList" data-component="{{data.uid}}" data-kind="{{data.kind}}" data-index="{{index}}" data-id="{{data.id}}" v-html="compile(data.view)"></div>
</template>

<script>
import _ from 'underscore'

const prefixes = ['-webkit-', '-moz-', '-ms-']
const camelPrefixes = ['Webkit', 'Moz', 'ms']
const hyphenateRE = /([a-z\d])([A-Z])/g
const importantRE = /!important;?$/
const camelizeRE = /-(\w)/g

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
			cacheValue: {},
			contentEditable: false
		}
	},

	computed: {
		/**
		 * Class list for element
		 * @return {Object}
		 */
		classList () {
			// Basic class
			let cssClass = {}, $root = this.$root
			cssClass[$root.klass(this.data.type)] = (this.data.type)? true: false
			cssClass[$root.klass(this.data.kind)] = (this.data.kind)? true: false

			// p is parent, c is children
			cssClass[$root.klass('p')] = (!this.child)? true: false
			cssClass[$root.klass('c')] = (this.child)? true: false

			switch (this.data.kind) {
				case 'column':
					cssClass[`uk-width-1-${this.itemLength}`] = true
					delete cssClass[$root.klass('el')]
				break;
			}

			switch (this.data.type) {
				case 'component':
					cssClass[$root.klass('component')] = true
					cssClass[$root.klass('editable')] = (this.data.editable)? true: false
					cssClass[$root.klass('inline')] = (this.data.inline)? true: false
				break;
			}

			return cssClass
		},

		/**
		 * Class list for parent element
		 * @return {Object}
		 */
		classListParent () {
			let cssClass = $.extend(true, {}, this.classList),
			properties = this.data.props[this.screenView],
			$root = this.$root

			// Set wrapper as non element
			// So we can't select wrapper element
			switch (this.data.kind) {
				case 'container':
				case 'column':
				case 'section':
					cssClass[$root.klass('n-el')] = true
					delete cssClass[$root.klass('el')]
				break

				case 'row':
					cssClass[$root.klass('n-el')] = true
					cssClass['uk-grid-' + properties.getParent().gutter.value] = true

					delete cssClass[$root.klass('el')]
				break
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
		compile: function (str) {
			return this.$interpolate(str)
		},

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
		 * Sanitize CSS property name
		 * @param  {String} prop
		 * @return {Object}
		 */
		prefixCSS (prop) {
			prop = prop.replace(hyphenateRE, '$1-$2').toLowerCase()

			let camel = prop.replace(camelizeRE, function (_, c) {
				return c ? c.toUpperCase() : ''
			}),
			upper = camel.charAt(0).toUpperCase() + camel.slice(1),
			testEl = document.createElement('div'),
			i = prefixes.length, prefixed

			if (camel !== 'filter' && (camel in testEl.style)) {
				return {kebab: prop, camel: camel}
			}

			while (i--) {
				prefixed = camelPrefixes[i] + upper
				if (prefixed in testEl.style) {
					return {
						kebab: prefixes[i] + prop,
						camel: prefixed
					}
				}
			}
		},

		/**
		 * Render css as style tag
		 * @return {String}
		 */
		stylesheet () {
			let $root = this.$root,
			selector = '.'.concat($root.klass(this.data.kind), '[data-id="', this.data.id, '"]'),
			selectorPrefix = '',
			cssArrChild = [],
			cssArr = [],
			css = ''

			/**
			 * Filter element style, since we're using uikit it's difficult to
			 * make a perfect layout, but there is solutions
			 * we're add child element to uikit element
			 */
			for (name in this.elementStyle) {
				let val = this.elementStyle[name],
				prop = this.prefixCSS(name)

				if (prop && val) {
					let isImportant = importantRE.test(val)? 'important': ''
					if (isImportant) {
						val = val.replace(importantRE, '').trim()
					}

					switch (this.data.kind) {
						case 'section':
						case 'column':
							// Add type to element selector
							selectorPrefix = '.' + $root.klass(this.data.type)

							// Excludes these css properties
							let exclusionProps = [
								'display',
								'padding-left',
								'padding-right',
								'padding-top',
								'padding-bottom',
								'background-color',
								'border-top',
								'border-bottom',
								'border-left',
								'border-right'
							]

							if (exclusionProps.indexOf(prop.kebab)<0) {
								cssArr.push(prop.kebab + ':' + val)
							}

							if (exclusionProps.indexOf(prop.kebab)>-1) {
								cssArrChild.push(prop.kebab + ':' + val)
							}
						break;

						default:
							cssArr.push(prop.kebab + ':' + val)
						break;
					}
				}
			}

			if (selectorPrefix !== undefined) {
				selector = selectorPrefix + selector
			}

			if (cssArr.length>0) {
				css += selector.concat('{' + cssArr.join(';') + '}')
			}

			if (cssArrChild.length>0) {
				css += selector.concat('>.', $root.klass('el'), '{' + cssArrChild.join(';') + '}')
			}

			return css
		},

		/**
		 * Enable content editor for editable content
		 */
		activateEditor () {
			let element = document.querySelector(`[data-component="${this.data.uid}"]`)

			// When user pressing enter reselect element
			this.$root.addEvent(element, 'keypress', this.editorNewline)
			this.$root.addEvent(element, 'paste', this.editorNewline)

			// Set contenteditable attribute
			this.$set('contentEditable', true)
			this.$root.parent().$broadcast('setEditorElement', element)

			// Trigger click (select element)
			this.$root.reselectElement(this.data.id)
		},

		/**
		 * Disable content editor
		 */
		deactivateEditor () {
			this.$broadcast('disableEditor')

			// Prevent non editable element to continue
			if (! this.data.editable && ! this.contentEditable) return

			// Disable it
			this.$set('contentEditable', false)
			this.$root.parent().$broadcast('setEditorElement', null)

			// Save content
			let element = document.querySelector(`[data-component="${this.data.uid}"]`)
			if (element) {
				this.saveEditor(element)
				this.$root.removeEvent(element, 'keypress', this.editorNewline)
				this.$root.removeEvent(element, 'paste', this.editorNewline)
			}
		},

		/**
		 * Callback when user press keyboard
		 * [enter] reselect element
		 * @return {void}
		 */
		editorNewline (event) {
			this.$root.reselectElement(this.data.id)
		},

		/**
		 * Callback when user blur the contenteditable element
		 * Save html as data.view
		 *
		 * @param  {ElementNode} element
		 * @return {void}
		 */
		saveEditor (element) {
			let html = element.innerHTML.replace('<!--v-html-->', '')
			if (html === '') {
				html = 'Empty Element'
			}

			this.$nextTick(function () {
				this.$set('data.view', html)
			})
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


		// Disable editing
		self.$on('disableEditor', function () {
			self.deactivateEditor()
		})

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

		// Fire component is ready
		if (self.isType('component')) {
			self.$root.parent().$broadcast('elementReady', self)
		}
	}
}
</script>
