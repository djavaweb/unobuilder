// Expose uno to window
require('expose?uno!expose?uno!uno')

/* Important Modules */
import Vue from 'vue'
import builder from './components/Builder.vue'
import utils from './utils.js'

/* Vue Config */
Vue.config.debug = true

/* Animation config */
Vue.transition('canvasAppear', {
	enterClass: 'canvas-block-open',
	leaveClass: 'canvas-block-close'
})

Vue.transition('slideLeftPanel', {
	enterClass: 'element-chooser-panel-open',
	leaveClass: 'element-chooser-panel-close'
})

Vue.transition('slidey', {
	enterClass: 'slideInDown',
	leaveClass: 'slideOutUp'
})

// Prepare uno builder
uno.on('prepare', element => {
	let builder = document.createElement('builder'),
	builderElement = document.querySelector(element)

	builderElement.insertBefore(builder, builderElement.firstChild)
	builder.outerHTML = '<builder v-ref:builder></builder>'
})

// When uno builder init element
uno.on('init', elements => {
	// Main app
	const App = new Vue({
		el: elements.builder,
		components: {builder},
		methods: {
			/**
			 * Get Builder reference
			 * @param str {String}
			 * @param el {String}
			 * @return
			 */
			ref (str, el) {
				return utils.ref(this.$refs.builder, str, el)
			},

			// Shortcut for canvas builder
			canvasBuilder (str, el) {
				return utils.ref(this.ref('centerPanel.canvasBuilder'), str, el)
			},

			// Shortcut for element selector
			elementSelector (str, el) {
				return utils.ref(this.canvasBuilder('elementSelector'), str, el)
			},

			// Close all panels
			closeAllPanels (panel = []) {
				if (panel.length === 0) {
					panel = ['context', 'block', 'leftpanel', 'popup']
				}

				// Hide context menu first
				if (panel.includes('context')) {
					this.canvasBuilder('contextMenu').hide()
				}

				// Hide block
				if (panel.includes('block')) {
					this.canvasBuilder('block').hide(true)
				}

				// Hide left panel
				if (panel.includes('leftpanel')) {
					this.ref('leftPanel').hide()
				}

				// Hide all popups
				if (panel.includes('popup')) {
					this.ref('rightPanel.properties.box').hidePopup()
				}
			}
		},

		ready () {
			this.$nextTick(() => {
				uno.emit('ready')
			})
		}
	})
})
