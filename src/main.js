import Vue from "vue"

/* Polyfill of classList */
import classList from "./js/classlist.js"

/* Vue Config */
Vue.config.debug = true;

/* Animation config */
Vue.transition('appear', {
	enterClass: 'fadeInUp',
	leaveClass: 'fadeOutDown'
})

/* Main Layout */
import Layout from "./components/layout.vue"

/* Main app */
const App = new Vue({
	el: 'body',
	components: {Layout},
	methods: {
		generateId (prefix) {
			return prefix + '-' + Date.now() + Math.floor(Math.random() * (1000 - 10 + 1)) + 10
		}
	},
	ready () {
		let self = this
		document.addEventListener('click', function (e) {
			self.$broadcast('click', {
				el: e.target
			})
			self.$broadcast('clicked', {
				el: e.target
			})
		})
	}
})