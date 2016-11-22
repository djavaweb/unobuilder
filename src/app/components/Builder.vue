<template lang="pug">
.uno-builder
	.uno-builder__container(:class="resizeCursor")
		screen-detector(v-ref:screen-detector)
		css-editor(v-ref:css-editor)

		left-panel(
		v-ref:left-panel,
		@mouseover="hoverStatus = 'leftPanel'"
		)

		center-panel(
		v-ref:center-panel,
		@mouseover="hoverStatus = 'centerPanel'"
		)

		right-panel(
		v-ref:right-panel,
		@mouseover="hoverStatus = 'rightPanel'"
		)
</template>

<style lang="sass">
@import "../../assets/scss/main.scss"
</style>

<script>
import jquery from 'jquery'
import uikit from 'uikit'
import UIKitCSS from 'UIKitCSS'
import config from '../config.js'
import utils from '../utils.js'
import screenDetector from './tools/screen/ScreenDetector.vue'
import cssEditor from './editor/CssEditor.vue'
import leftPanel from './panel/LeftPanel.vue'
import centerPanel from './panel/centerPanel.vue'
import rightPanel from './panel/rightPanel.vue'
export default {
	name: 'builder',
	components: {
		screenDetector,
		cssEditor,
		leftPanel,
		centerPanel,
		rightPanel
	},

	data () {
		return {
			hoverStatus: ''
		}
	},

	computed: {
		/**
		 * Set screen cursor by reading some conditional
		 * @return {void}
		 */
		resizeCursor () {
			let klass = [], dragClass = utils.klass('builder--dragging')

			// If we're dragging a component from left panel
			if (this.$root.ref('leftPanel').dragComponent) {
				klass.push(dragClass)
			}

			// When box properties resizing margin/border/padding properties
			let boxProps = this.$root.ref('rightPanel.properties.box')
			if (boxProps) {
				// Border radius
				if (boxProps.dragState.move || boxProps.dragRadiusState.move) {
					klass.push(dragClass)
				}

				if (['topleft', 'bottomright'].includes(boxProps.dragRadiusState.direction)) {
				  klass.push('resize-nwse')
				}

				if (['topright', 'bottomleft'].includes(boxProps.dragRadiusState.direction)) {
				  klass.push('resize-nesw')
				}

				// Resize value top and bottom
				// Top-Bottom
				if (['top', 'bottom'].includes(boxProps.dragState.direction)) {
				  klass.push('resize-updown')
				}

				// Left-Right
				if (['left', 'right'].includes(boxProps.dragState.direction)) {
				    klass.push('resize-leftright')
				}
			}

			return klass
		}
  },

	methods: {
		closeAllPanels () {
			// Hide context menu first
			this.$root.canvasBuilder('contextMenu').hide()

			// Hide block
			this.$root.canvasBuilder('block').hide(true)

			// Hide left panel
			this.$root.ref('leftPanel').hide()
		}
	}
}
</script>
