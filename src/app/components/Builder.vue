<template lang="pug">
#uno-builder
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
	}
}
</script>
