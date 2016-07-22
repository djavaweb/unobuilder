/* Polyfill of classList */
import unibuilder from './uno.client.js'
import classList from '../lib/classlist.js'
import Vue from 'vue'

/* Vue Config */
Vue.config.debug = true;

/* Animation config */
Vue.transition('appear', {
	enterClass: 'fadeInDown',
	leaveClass: 'fadeOutUp'
})

Vue.transition('slideleft', {
	enterClass: 'slideInLeft',
	leaveClass: 'slideOutLeft'
})

Vue.transition('slidey', {
	enterClass: 'slideInDown',
	leaveClass: 'slideOutUp'
})


// Main Layout
import layout from '../../components/app/layout.vue'

/* Main app */
const App = new Vue({
	el: '#app',
	components: {layout},
	methods: {
		/**
		 * Generate Id with current time and random integer from 10 to 1000
		 *
		 * @param  {string} Id Prefix
		 * @return {string} Generated ID
		 */
		generateId (prefix) {
			prefix = prefix || ''
			return prefix + '-' + Date.now() + this.randomInt(10, 1000)
		},

		/**
		 * Generate Random Integer
		 *
		 * @param  {Number}
		 * @param  {Number}
		 * @return {Number}
		 */
		randomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		}
	}
})
