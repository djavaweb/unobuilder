import Drag from "dragula"
import Vue from "vue"


/* Main Layout */
import Layout from "./components/layout.vue"
Vue.component('layout', Layout)

/* Content */
import Content from "./components/content.vue"
Vue.component('content', Content)

/* Content */
import Structure from "./components/structure.vue"
Vue.component('structure', Structure)

Vue.config.debug = true;
let App = new Vue({
	el: '#app',
	data: {},

	/* Initialize when ready */
	ready: function () {
		let containers = $('.source.structures, #target').toArray();

		/* Drag and Drop Layer */
		Drag(containers, {
			moves: function (el, src) {
				return $(el).hasClass('draggable');
			},
			copy: function (el, src) {
				return $(el).hasClass('draggable');
			}
		})
		.on('drag', function (el) {
			$(el).addClass('move');
		})
		.on('dragend', function (el) {
			$(el).removeClass('move')
		})
		.on('drop', function (el, target, source, sibling) {
			$(el).removeClass('draggable').removeClass('move')
			//$(target).html('Coming soon')
		})
	}
})