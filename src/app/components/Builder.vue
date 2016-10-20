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
        resizeCursor () {
            let klass = [], boxProps = this.$root.ref('rightPanel.properties.box')
            if (boxProps) {

				if (boxProps.dragState.move || boxProps.dragRadiusState.move) {
					klass.push('uno-builder--dragging')
				}

	            if (['top', 'bottom'].includes(boxProps.dragState.direction)) {
	                klass.push('resize-updown')
	            }

	            if (['left', 'right'].includes(boxProps.dragState.direction)) {
	                klass.push('resize-leftright')
	            }

	            if (['topleft', 'bottomright'].includes(boxProps.dragRadiusState.direction)) {
	                klass.push('resize-nwse')
	            }

	            if (['topright', 'bottomleft'].includes(boxProps.dragRadiusState.direction)) {
	                klass.push('resize-nesw')
	            }
			}

			return klass
        }
    },
}
</script>
