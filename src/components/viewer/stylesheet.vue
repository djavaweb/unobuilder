<template>
<style>
{{{css}}}
{{{$root.customCSS}}}</style>
</template>

<style lang="less">
@import "../../css/viewer.less";
</style>


<script>
import _ from 'underscore'
import constant from '../../js/core/uno.constant.js'

const prefixes = ['-webkit-', '-moz-', '-ms-'],
camelPrefixes = ['Webkit', 'Moz', 'ms'],
hyphenateRE = /([a-z\d])([A-Z])/g,
importantRE = /!important;?$/,
camelizeRE = /-(\w)/g,
syntaxRE = /\$([a-zA-Z0-9_]+)/g

export default {
	name: 'stylesheet',
	data () {
		return {
			css: '',
			loadedFonts: [],
			screenSize: 'large',
			elements: {}
		}
	},

	events: {
		/**
		 * When elements properties has changed
		 * @param  {Object} elements
		 */
		elementHasChanged (elements, screenSize) {
			// Set screen size
			this.screenSize = screenSize

			// Render css
			this.$nextTick(() => {
				this.renderCSS(elements)
			})
		}
	},

	methods: {
		/**
		 * Convert NaN to auto
		 * @param  {Number} int
		 * @param  {Boolean} useAuto
		 * @param  {Number|String} defaultValue
		 *
		 * @return {void}
		 */
		autoUnit (value, useAuto, defaultValue) {
			if (isNaN(parseFloat(value.value))) {
				useAuto = (useAuto === undefined)? true: useAuto
				let autoExceptions = ['maxHeight']

				if (useAuto) {
					if (defaultValue) return defaultValue
					return 'auto'
				}
				return 0 + value.unit
			}

			let parsedValue = ((value.value).toString().indexOf('.') > 0)? parseFloat(value.value): parseInt(value.value)
			return parsedValue + value.unit
		},

		/**
		 * Render rgba color
		 * @param  {colors} value
		 * @return {void}
		 */
		rgbaColor (value) {
			if (value.rgba.a < 1) {
				return `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
			}

			return value.hex
		},

		/**
		 * Load font family dynamically, check if it's google font or native
		 * @param  {Object} font
		 * @return {String}
		 */
		loadFont (font) {
			let fontFamily = font.value
			if (fontFamily.indexOf('Default')>0) {
				fontFamily = 'inherit'
			}

			if (! this.loadedFonts.includes(fontFamily)) {
				if (! constant.NATIVE_FONTS.includes(fontFamily) && fontFamily !== 'inherit') {
					WebFont.load({
						google: {
							families: [fontFamily]
						}
					})
				}

				this.loadedFonts.push(fontFamily)
			}

			return fontFamily
		},

		/**
		 * Render elements properties to stylesheet
		 * @param  {Object} elements
		 */
		renderCSS (elements) {
			let $root = this.$root, css = ''

			// Iterate elements
			_.each(elements, (element, id) => {
				// Get current element
				let doc = $root.getElement(id)

				// For every element that is not a wrapper element
				if (doc && !doc.$wrap) {
					// Filter as css object
					let cssObject = this.cssObject(element)

					// Turn js object into real css properties
					css += this.cssProperties(element, cssObject[this.screenSize])
				}
			})

			// Okie dogie, let's render
			this.css = css
		},


		/**
		 * CSS Object filter, turn preformated css properties of uno
		 * into CSS js-based Object
		 *
		 * @param  {Object} data
		 * @return {Object}
		 */
		cssObject (data) {
			let self = this, obj = {}

			_.each(data.props, function (properties, breakpoint) {
				let style = {
					position: properties.position.value,

					/* Display */
					display: properties.display.value,

					/* Margin */
					marginTop: self.autoUnit(properties.marginTop),
					marginRight: self.autoUnit(properties.marginRight),
					marginBottom: self.autoUnit(properties.marginBottom),
					marginLeft: self.autoUnit(properties.marginLeft),

					/* Padding */
					paddingTop: self.autoUnit(properties.paddingTop),
					paddingRight: self.autoUnit(properties.paddingRight),
					paddingBottom: self.autoUnit(properties.paddingBottom),
					paddingLeft: self.autoUnit(properties.paddingLeft),

					/* Border */
					borderTop: self.autoUnit(properties.borderTop, false) +' '+ properties.borderTop.borderStyle + ' ' + self.rgbaColor(properties.borderTop.color),
					borderRight: self.autoUnit(properties.borderRight, false) +' '+ properties.borderRight.borderStyle + ' ' + self.rgbaColor(properties.borderRight.color),
					borderBottom: self.autoUnit(properties.borderBottom, false) +' '+ properties.borderBottom.borderStyle + ' ' + self.rgbaColor(properties.borderBottom.color),
					borderLeft: self.autoUnit(properties.borderLeft, false) +' '+ properties.borderLeft.borderStyle + ' ' + self.rgbaColor(properties.borderLeft.color),
					borderTopLeftRadius: self.autoUnit(properties.borderRadiusTopLeft),
					borderTopRightRadius: self.autoUnit(properties.borderRadiusTopRight),
					borderBottomLeftRadius: self.autoUnit(properties.borderRadiusBottomLeft),
					borderBottomRightRadius: self.autoUnit(properties.borderRadiusBottomRight)
				}


				/**
				 * Text style including:
				 * font family, font color, font style, text-align,
				 * text-decoration, etc
				 */
				style.fontFamily = self.loadFont(properties.fontFamily)
				style.fontSize = self.autoUnit(properties.fontSize)
				style.fontStyle = properties.fontStyle.value
				style.textAlign = properties.textAlign.value
				style.textDecoration = properties.textDecoration.value
				style.lineHeight = self.autoUnit(properties.lineHeight)
				style.letterSpacing = self.autoUnit(properties.letterSpacing)
				style.color = self.rgbaColor(properties.fontColor)

				/**
				 * Background
				 */
				 if (properties.background.value === 'color') {
				 	style.backgroundColor = self.rgbaColor(properties.background.settings.color)
				 }

				// Dimension
				// Width
				if (! properties.width.disabled) style.width = self.autoUnit(properties.width)
				if (! properties.minWidth.disabled) style.minWidth = self.autoUnit(properties.minWidth, true)
				if (! properties.maxWidth.disabled) style.maxWidth = self.autoUnit(properties.maxWidth, true, 'inherit')

				// Height
				style.height = self.autoUnit(properties.height)
				if (properties.minHeight.value > 0) style.minHeight = self.autoUnit(properties.minHeight, true)
				if (properties.maxHeight.value > 0) style.maxHeight = self.autoUnit(properties.maxHeight, true, 'inherit')


				// Position
				if (properties.position.value === 'absolute' || properties.position.value === 'fixed') {
					style.top = self.autoUnit(properties.position.settings[properties.position.value].top)
					style.bottom = self.autoUnit(properties.position.settings[properties.position.value].bottom)
					style.right = self.autoUnit(properties.position.settings[properties.position.value].right)
					style.left = self.autoUnit(properties.position.settings[properties.position.value].left)
				}

				// Display Properties
				if (properties.display.value === 'flex') {
					// flex-direction
					let reverse = (properties.display.settings.flex.container.reverse)? '-reverse': ''
					style.flexDirection = properties.display.settings.flex.container.direction + reverse

					// flex-wrap
					let wrap = properties.display.settings.flex.container.wrap,
					reverseWrap = properties.display.settings.flex.container.reverseWrap,
					flexWrap = ''

					if (wrap) {
						flexWrap = 'wrap'
					} else {
						flexWrap = 'nowrap'
					}

					if (reverseWrap) {
						flexWrap += '-reverse'
					}

					style.flexWrap = flexWrap

					// align-items
					style.alignItems = properties.display.settings.flex.container.alignItems
					style.justifyContent = properties.display.settings.flex.container.justifyContent
					style.alignContent = properties.display.settings.flex.container.alignContent
				}

				// Flex align-self
				let parentProperties = properties.getParent()
				if (parentProperties && parentProperties.display.value === 'flex' && data.kind === 'column') {
					style.alignSelf = properties.display.settings.flex.item.alignSelf
				}

				// Style applied only for row
				if (data.kind === 'row') {
					if (parentProperties) {
						// Set Rows display properties like it's parent
						properties.display = parentProperties.display
					}

					// Always set width, height and flex-grow to fill with parent
					style.flexGrow = 1
					style.width = 'auto'
					style.height = '100%'

					// Delete position and other unnecesery style
					_.each(['position',
						'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
						'marginTop', 'marginLeft', 'marginRight', 'marginBottom',
						'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
						'borderTop', 'borderLeft', 'borderRight', 'borderBottom'], function (item) {
						delete style[item]
					})
				}

				if (data.kind === 'column' && style.display === 'flex') {
					style.flexGrow = 1
				}

				// Set style by breakpoint
				obj[breakpoint] = style
			})

			return obj
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
		 * Render css js-based object into real css properties
		 * @return {String}
		 */
		cssProperties (element, cssObject) {
			let $root = this.$root,
			selector = `[data-id="${element.id}"]`,
			selectorPrefix = '',
			cssArrChild = [],
			cssArr = [],
			css = ''

			/**
			 * Filter element style, since we're using uikit it's difficult to
			 * make a perfect layout, but there is solutions
			 * we're add child element to uikit element
			 */
			for (name in cssObject) {
				let val = cssObject[name],
				prop = this.prefixCSS(name)

				if (prop && val) {
					let isImportant = importantRE.test(val)? 'important': ''
					if (isImportant) {
						val = val.replace(importantRE, '').trim()
					}

					switch (element.$kind) {
						case 'section':
						case 'column':
							// Add type to element selector
							selectorPrefix = '.' + $root.klass(element.type)

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
	}
}
</script>
