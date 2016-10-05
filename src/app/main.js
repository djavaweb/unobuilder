/* Our Applications */
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

/* Main app */
const App = new Vue({
	el: '#app',
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
	}
})
