import Vue from "vue"

/* Polyfill */
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
	el: '#app',
	components: {Layout}
})