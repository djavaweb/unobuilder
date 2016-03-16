import Vue from "vue"
import Drag from "interact.js"

/* Polyfill */
import classList from "./js/classlist.js"

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
	data: {
		dropElement: null,
		elements: []
	},

	methods: {
		object: function (name) {
			return JSON.parse(JSON.stringify(App.$data[name]));
		}
	},

	/* Initialize when ready */
	ready: function () {
		let _this = this;

		let target = Drag('.dropable').dropzone({
			ondropactivate: function (event) {
				_this.dropElement = null;
				$('.dropable').removeClass('drop-enter');
			},
			ondragenter: function (event) {
				$('.dropable').removeClass('drop-enter');

				_this.dropElement = event.target;
				_this.dropElement.classList.add('drop-enter');
			},
			ondrop: function (event) {},
			ondropdeactivate: function (event) {
				if (_this.dropElement) {
					let source = event.relatedTarget, element = {
						name: 'element-' + Date.now(),
						containers: [],
						items: []
					};

					// Create Flex Element
					let columns = source.getAttribute('data-width').split('-').filter(n => parseInt(n, 10));

					// Get defined width
					if (columns[0] === columns[1] && columns[0] < 5) {
						element.containers.push('1-1');
					} else {
						for (let i in columns) {
							let column = columns[i];
							element.containers.push(column + '-10')
						}
					}


					let index = 0;
					$('.dropable').each(function (i, el) {
						if (el.getAttribute('id') === _this.dropElement.getAttribute('id')) {
							index = i;
						}
					});

					// Push to data
					let size = _this.elements.length;
					setTimeout(function () {
						if (size > 0) {
							let elements = _this.object('elements');
							if (elements.length === size) {
								elements.splice(index + 1, 0, element)
								_this.$set('elements', elements);
							}
						} else {
							_this.elements.$set(0, element)
						}
						
					}, 10);

					// Remove source element
					source.remove();
				}

				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
			},
			ondragleave: function (event) {
				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
				_this.dropElement.classList.add('drop-enter');
			}
		})

		let drag = Drag('.draggable').draggable({
			inertia: false,
			autoScroll: false,
			onmove: function (event) {
				var target = event.target,
				rect = target.getBoundingClientRect(),
				x = event.interaction.curCoords.page.x - event.target.offsetLeft,
				y = event.interaction.curCoords.page.y - event.target.offsetTop;

				/* Set cursor to center */
				x = x - (rect.width/2);
				y = y - (rect.height/2);

				target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);

				/* Hidden Scrollbar */
				document.body.classList.add('overflow-hidden');
			},
			onend: function (event) {
				var source = event.target;
				source.remove();
				document.body.classList.remove('overflow-hidden');
			}

		}).on('move', function (event) {
			var interaction = event.interaction;
			if (interaction && interaction.pointerIsDown && !interaction.interacting())
			{
				var original = event.currentTarget;
				var clone = original.cloneNode(true);
				original.parentElement.appendChild(clone);
				interaction.start({ name: 'drag' }, event.interactable, clone);
			}
		})
	}
})