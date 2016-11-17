<template lang="pug">
style(type="text/css",v-el:css) {{{renderOutput}}}
</template>

<style lang="sass">
@import "../../assets/scss/canvas.scss"
</style>

<script>
import _each from 'lodash/each'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import config from '../config.js'
import utils from '../utils.js'

export default {
	name: 'cssRenderer',
	data () {
		return {
			renderOutput: '',
			loadedFonts: []
		}
	},

	methods: {
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
				if (! config.NATIVE_FONTS.includes(fontFamily) && fontFamily !== 'inherit') {
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
		updateStylesheet () {
			let parent = this.$root.ref(),
			screenSize = parent.screenSize,
			globalCSS = parent.global,
			elements = parent.elements,
			css = []

			// Generate global css
			// Render css based on breakpoints
			for (let elementKind in globalCSS) {
				if (globalCSS[elementKind]) {
					let breakpoints = globalCSS[elementKind]
					let availableProps = [
						{props: this.getAvailableProps(screenSize, breakpoints)},
						{props: this.getAvailableProps(screenSize, breakpoints, 'hover'), pseudo: ':hover'},
						{props: this.getAvailableProps(screenSize, breakpoints, 'active'), pseudo: ':active'},
						{props: this.getAvailableProps(screenSize, breakpoints, 'focus'), pseudo: ':focus'}
					]

					for (let i in availableProps) {
						let options = {
							global: true,
							props: availableProps[i].props,
							selector: '.' + utils.klass(`el-${elementKind}`),
							elementKind: elementKind,
						}

						if (availableProps[i].pseudo) {
							options.pseudo = availableProps[i].pseudo
						}

						let output = this.generateCssSelector(options)
						if (output) {
							css.push(this.renderCSS(output))
						}
					}
				}
			}

			// Generate css for each elements
			// Render css based on self-properties breakpoints
			for (let id in elements) {
				if (elements[id].props) {
					let breakpoints = elements[id].props.self
					let availableProps = [
						{props: this.getAvailableProps(screenSize, breakpoints)},
						{props: this.getAvailableProps(screenSize, breakpoints, 'hover'), pseudo: ':hover'},
						{props: this.getAvailableProps(screenSize, breakpoints, 'active'), pseudo: ':active'},
						{props: this.getAvailableProps(screenSize, breakpoints, 'focus'), pseudo: ':focus'}
					]

					for (let i in availableProps) {
						let options = {
							props: availableProps[i].props,
							selector: `[data-id="${id}"]`,
							elementKind: elements[id].kind
						}

						if (availableProps[i].pseudo) {
							options.pseudo = availableProps[i].pseudo
						}

						let output = this.generateCssSelector(options)
						if (output) {
							css.push(this.renderCSS(output))
						}
					}
				}
			}

			// Okie dogie, let's render
			let renderOutput = css.join('')
			renderOutput += this.$parent.customCSS
			this.renderOutput = renderOutput
		},

		getAvailableProps (screenSize, breakpoints, mouseState = '') {
			let availableProps = breakpoints[`large${mouseState}`]

			// Get the breakpoint size
			switch (screenSize) {
				// If medium was not found, get the large
				case 'medium':
					if (breakpoints[`medium${mouseState}`]) {
						availableProps = breakpoints[`medium${mouseState}`]
					}
				break

				// If small was not found, get the medium
				case 'small':
					if (breakpoints[`small${mouseState}`]) {
						availableProps = breakpoints[`small${mouseState}`]
					} else if (breakpoints[`medium${mouseState}`]) {
						availableProps = breakpoints[`medium${mouseState}`]
					}
				break

				// If mini was not found, get the small
				case 'mini':
					if (breakpoints[`mini${mouseState}`]) {
						availableProps = breakpoints[`mini${mouseState}`]
					} else if (breakpoints[`small${mouseState}`]) {
						availableProps = breakpoints[`small${mouseState}`]
					} else if (breakpoints[`medium${mouseState}`]) {
						availableProps = breakpoints[`medium${mouseState}`]
					}
				break
			}

			if (availableProps) {
				return availableProps
			}
		},

		generateCssSelector (options) {
			if (options.elementKind && options.props) {
				let pseudoSelector = options.pseudo || ''
				let cssObject = this.cssObject(options.elementKind, options.props)
				let cssSelector = {
					css: cssObject,
					selector: options.selector + pseudoSelector,
					elementKind: options.elementKind,
				}

				if (options.elementKind === 'container') {
					if (options.global) {
						options.selector = `.${utils.klass(`el-wrapper`)}`
					}
					cssSelector.parentSelector = `${options.selector}${pseudoSelector}`
				}

				if (options.elementKind === 'column') {
					if (options.global) {
						options.selector = `.${utils.klass(`el-column-wrapper`)}`
					}
					cssSelector.parentSelector = `${options.selector}${pseudoSelector}`
				}

				return cssSelector
			}
		},


		/**
		 * CSS Object filter, turn preformated css properties of uno
		 * into CSS js-based Object
		 *
		 * @param  {String} elementKind
		 * @param  {Object} properties
		 * @return {Object}
		 */
		cssObject (elementKind, properties) {
			let self = this, obj = {}

			let style = {
				position: properties.position.value,

				/* Display */
				display: properties.display.value,

				/* Margin */
				marginTop: utils.autoUnit(properties.marginTop),
				marginRight: utils.autoUnit(properties.marginRight),
				marginBottom: utils.autoUnit(properties.marginBottom),
				marginLeft: utils.autoUnit(properties.marginLeft),

				/* Padding */
				paddingTop: utils.autoUnit(properties.paddingTop),
				paddingRight: utils.autoUnit(properties.paddingRight),
				paddingBottom: utils.autoUnit(properties.paddingBottom),
				paddingLeft: utils.autoUnit(properties.paddingLeft),

				/* Border */
				borderTop: `${utils.autoUnit(properties.borderTop, false)} ${properties.borderTop.style} ${utils.rgbaColor(properties.borderTop.color)}`,
				borderRight: `${utils.autoUnit(properties.borderRight, false)} ${properties.borderRight.style} ${utils.rgbaColor(properties.borderRight.color)}`,
				borderBottom: `${utils.autoUnit(properties.borderBottom, false)} ${properties.borderBottom.style} ${utils.rgbaColor(properties.borderBottom.color)}`,
				borderLeft: `${utils.autoUnit(properties.borderLeft, false)} ${properties.borderLeft.style} ${utils.rgbaColor(properties.borderLeft.color)}`,

				/* Border Radius */
				borderTopLeftRadius: utils.autoUnit(properties.borderRadiusTopLeft),
				borderTopRightRadius: utils.autoUnit(properties.borderRadiusTopRight),
				borderBottomLeftRadius: utils.autoUnit(properties.borderRadiusBottomLeft),
				borderBottomRightRadius: utils.autoUnit(properties.borderRadiusBottomRight)
			}


			/**
			 * Text style including:
			 * font family, font color, font style, text-align,
			 * text-decoration, etc
			 */
			style.fontFamily = self.loadFont(properties.fontFamily)
			style.fontSize = utils.autoUnit(properties.fontSize)
			style.fontStyle = properties.fontStyle.value
			style.fontWeight = properties.fontWeight.value
			style.textAlign = properties.textAlign.value
			style.textDecoration = properties.textDecoration.value
			style.lineHeight = utils.autoUnit(properties.lineHeight)
			style.letterSpacing = utils.autoUnit(properties.letterSpacing)
			style.color = utils.rgbaColor(properties.fontColor)

			/**
			 * Background
			 */
			switch (properties.background.value) {
				 case 'color':
				 	style.backgroundColor = utils.rgbaColor(properties.background.settings.color)
				 break

				 case 'none':
				 	style.background = 'none'
				 break
			}

			// Dimension
			// Width
			if (! properties.width.disabled) style.width = utils.autoUnit(properties.width)
			if (! properties.minWidth.disabled) style.minWidth = utils.autoUnit(properties.minWidth, true)
			if (! properties.maxWidth.disabled) style.maxWidth = utils.autoUnit(properties.maxWidth, true, 'inherit')

			// Height
			style.height = utils.autoUnit(properties.height)
			if (properties.minHeight.value > 0) style.minHeight = utils.autoUnit(properties.minHeight, true)
			if (properties.maxHeight.value > 0) style.maxHeight = utils.autoUnit(properties.maxHeight, true, 'inherit')


			// Position
			if (properties.position.value === 'absolute' || properties.position.value === 'fixed') {
				style.top = utils.autoUnit(properties.position.settings[properties.position.value].top)
				style.bottom = utils.autoUnit(properties.position.settings[properties.position.value].bottom)
				style.right = utils.autoUnit(properties.position.settings[properties.position.value].right)
				style.left = utils.autoUnit(properties.position.settings[properties.position.value].left)
			}

			// Flex Properties
			if (properties.display.value === 'flex') {
				style.flexDirection = this.flexDirection(properties)
				style.flexWrap = this.flexWrap(properties)
				style.alignItems = properties.display.settings.flex.container.alignItems
				style.justifyContent = properties.display.settings.flex.container.justifyContent
				style.alignContent = properties.display.settings.flex.container.alignContent
			}

			// Flex align-self
			let parentProperties
			if (properties.getParent) {
				parentProperties = properties.getParent()
				if (parentProperties && parentProperties.display.value === 'flex' && elementKind === 'column') {
					style.alignSelf = properties.display.settings.flex.item.alignSelf
				}
			}

			// Row is invisible or unselectable
			// So it's duplicate parent properties
			// Style applied only for row
			if (elementKind === 'row') {
				// Always set width, height and flex-grow to fill with parent
				style.flexGrow = 1
				style.width = 'auto'
				style.height = '100%'

				if (parentProperties) {
					if (parentProperties.display.value === 'flex') {
						style.width = '100%'
						style.flexDirection = this.flexDirection(parentProperties)
						style.flexWrap = this.flexWrap(parentProperties)
						style.alignItems = parentProperties.display.settings.flex.container.alignItems
						style.justifyContent = parentProperties.display.settings.flex.container.justifyContent
						style.alignContent = parentProperties.display.settings.flex.container.alignContent
					}

					if (! parentProperties.minWidth.disabled) style.minWidth = utils.autoUnit(parentProperties.minWidth, true)
					style.height = utils.autoUnit(parentProperties.height)
					if (parentProperties.minHeight.value > 0) style.minHeight = utils.autoUnit(parentProperties.minHeight, true)
				}

				// Delete position and other unnecesery style
				_each(['position',
					'maxWidth', 'maxHeight',
					'marginTop', 'marginLeft', 'marginRight', 'marginBottom',
					'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
					'borderTop', 'borderLeft', 'borderRight', 'borderBottom'], function (item) {
					delete style[item]
				})
			}

			if (elementKind === 'column' && style.display === 'flex') {
				style.flexGrow = 1
			}

			return style
		},

		flexDirection (properties) {
			let reverse = (properties.display.settings.flex.container.reverse)? '-reverse': ''
			return properties.display.settings.flex.container.direction + reverse
		},

		flexWrap (properties) {
			let wrap = properties.display.settings.flex.container.wrap,
			reverseWrap = properties.display.settings.flex.container.reverseWrap,
			flexWrap = 'nowrap'

			if (wrap) {
				flexWrap = 'wrap'
			}

			if (reverseWrap) {
				flexWrap += '-reverse'
			}

			return flexWrap
		},

		/**
		 * Render css js-based object into real css properties
		 * @param {Object} object [kind, selector, parentSelector, css]
		 * @return {String}
		 */
		renderCSS (object) {
			let output = ''
			let cssArr = []
			let cssArrParent = []
			let cssArrChild = []
			let exclusion = {
				column: {
					parent: [
						'width',
						'margin-top',
						'margin-right',
						'margin-bottom',
						'margin-left'
					]
				},
				container: {
					parent: [
						'height'
					]
				},
				row: {
					parent: {
						display: {self: 'flex', parent: 'block'}
					}
				}
			}


			/**
			 * Filter element style, since we're using uikit it's difficult to
			 * make a perfect layout, but there is solutions
			 * we're add child element to uikit element
			 */
			for (let key in object.css) {
				let val = object.css[key],
				prop = utils.cssPrefixer(key)

				if (prop && val) {
					let cssProperty = `${prop.kebab}:${val}`

					// If properties are in exclusion list
					// Set parent properties as self properties
					if (exclusion.hasOwnProperty(object.elementKind)) {
						let parentExclusion = exclusion[object.elementKind].parent,
						childExclusion = exclusion[object.elementKind].child

						if (parentExclusion) {
							if (_isArray(parentExclusion)) {
								if (parentExclusion.includes(prop.kebab)) {
									cssArrParent.push(cssProperty)
								} else {
									cssArr.push(cssProperty)
								}
							} else if (_isObject(parentExclusion)) {
								_each(parentExclusion, (item, key) => {
									if (key === prop.kebab) {
										cssArr.push(`${prop.kebab}:${item.self}`)
										cssArrParent.push(`${prop.kebab}:${item.parent}`)
									} else {
										cssArr.push(cssProperty)
									}
								})
							}
						}
					} else {
						cssArr.push(cssProperty)
					}
				}
			}

			if (cssArr.length>0) {
				output += object.selector + `{${cssArr.join(';')}}`
			}

			if (cssArrParent.length>0 && object.parentSelector) {
				output += object.parentSelector + `{${cssArrParent.join(';')}}`
			}

			if (cssArrChild.length>0 && childSelector) {
				output += childSelector + `{${cssArrChild.join(';')}}`
			}

			return output
		},
	}
}
</script>
