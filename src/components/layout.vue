<template>
<div id="menu">
	<ul id="menu-tab" class="uk-tab uk-tab-grid" data-uk-switcher="{connect:'#tab'}" @click="viewing('tab')">
		<li class="uk-width-1-4" v-for="tab in tabs" track-by="$index" :class="{'uk-active': $index === 1}">
			<a><i class="uk-icon-{{tab.icon}}"></i> {{tab.label}}</a>
		</li>
	</ul>

	<ul id="tab" class="uk-switcher animated" v-show="isView('tab')">
		<li class="tab-content">
			<div class="source contents">
				<div class="uk-grid uk-grid-small" v-for="content in contents">
					<content v-for="element in content" width="1-3" :label="element"></content>
				</div>
			</div>
		</li>

		<li class="tab-content">
			<div class="source structures">
				<structure v-for="structure in structures" :width="structure"></structure>
			</div>
		</li>

		<li class="tab-content">Body</li>
	</ul>

	<div id="properties-view" v-show="isView('properties')" class="animated" transition="appear">
		<ul id="row-tab" class="uk-tab uk-tab-grid" data-uk-switcher="{connect: '#row-properties'}">
			<li class="uk-width-1-6" v-for="tab in rowTabs" track-by="$index" :class="{'uk-active': $index === 0}">
				<a>{{tab.label}}</a>
			</li>
		</ul>

		<ul id="row-properties" class="uk-switcher">
			<li class="tab-content">
				<div class="properties" v-for="(prop, value) in current.properties.layout">
					<div class="uk-grid uk-grid-small">
						<label class="uk-width-1-5 uk-text-right">{{prop|capitalize}}</label>

						<div class="uk-width-4-5" transition="fade">
							<div v-if="prop==='margin'">
								<label><input type="radio" name="margin-mode" value="inherit" v-model="value._.mode"> Inherited from customizer</label>
								<label class="block br"><input type="radio" name="margin-mode" value="custom" v-model="value._.mode"> Custom</label>

								<label><input type="radio" name="margin-size" value="15" v-model="value._.allValue"> Standard:15px</label>
								<label><input type="radio" name="margin-size" value="25" v-model="value._.allValue"> Larger:25px</label>
								<label class="block br"><input type="radio" name="margin-size" value="10" v-model="value._.allValue"> Smaller:10px</label>

								<label class="block"><input type="checkbox" v-model="value._.all" :checked="value.include.t&&value.include.b" v-bind:on.checked> Margin top + bottom</label>
								<label class="block"><input type="checkbox" :disabled="value._.all" v-model="value.include.t"> Margin top</label>
								<label class="block"><input type="checkbox" :disabled="value._.all" v-model="value.include.b"> Margin bottom</label>
								<label class="block"><input type="checkbox" v-model="value.include.l"> Margin left</label>
								<label class="block"><input type="checkbox" v-model="value.include.r"> Margin right</label>
							</div>

							<div v-if="prop==='padding'">
								<div class="uk-grid">
									<div class="uk-width-3-5">
										<number :enable="value._.all" :value.sync="value._.allValue" label="All Sides"></number>
									</div>
									<div class="uk-width-2-5">
										<div class="switch">
											<input class="switch-input" id="padding-all-side" type="checkbox" v-model="value._.all">
											<label class="switch-paddle" for="padding-all-side">
											</label>
										</div>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="! value._.all" :value.sync="value.styles[0]" label="Top"></number>
									</div>
									<div class="uk-width-3-6">
										<number :enable="! value._.all" :value.sync="value.styles[1]" label="Right"></number>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="! value._.all" :value.sync="value.styles[3]" label="Left"></number>
									</div>
									<div class="uk-width-3-6">
										<number :enable="! value._.all" :value.sync="value.styles[2]" label="Bottom"></number>
									</div>
								</div>
							</div>

							<div v-if="prop==='border'">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="value._.all" :value.sync="value._.allValue.width" label="All Sides"></number>
									</div>
									<div class="uk-width-2-6">
										<border-style :enable="value._.all" :value.sync="value._.allValue.style"></border-style>
										<color-picker :enable="value._.all" :color.sync="value._.allValue.color"></color-picker>
									</div>
									<div class="uk-width-1-6">
										<div class="switch">
											<input class="switch-input" id="border-all-side" type="checkbox" v-model="value._.all">
											<label class="switch-paddle" for="border-all-side">
											</label>
										</div>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="!value._.all" :value.sync="value.styles.width[0]" label="Top"></number>
									</div>
									<div class="uk-width-3-6">
										<border-style :enable="!value._.all" :value.sync="value.styles.style[0]"></border-style>
										<color-picker :enable="!value._.all" :color.sync="value.styles.color[0]"></color-picker>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="!value._.all" :value.sync="value.styles.width[1]" label="Right"></number>
									</div>
									<div class="uk-width-3-6">
										<border-style :enable="!value._.all" :value.sync="value.styles.style[1]"></border-style>
										<color-picker :enable="!value._.all" :color.sync="value.styles.color[1]"></color-picker>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="!value._.all" :value.sync="value.styles.width[3]" label="Left"></number>
									</div>
									<div class="uk-width-3-6">
										<border-style :enable="!value._.all" :value.sync="value.styles.style[3]"></border-style>
										<color-picker :enable="!value._.all" :color.sync="value.styles.color[3]"></color-picker>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-6">
										<number :enable="!value._.all" :value.sync="value.styles.width[2]" label="Bottom"></number>
									</div>
									<div class="uk-width-3-6">
										<border-style :enable="!value._.all" :value.sync="value.styles.style[2]"></border-style>
										<color-picker :enable="!value._.all" :color.sync="value.styles.color[2]"></color-picker>
									</div>
								</div>
							</div>
						
						{{value|json}}
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>

<div id="layout-wrapper">
	<div id="layout">
		<drop position="relative"></drop>

		<div id="{{element.id}}" class="layout-item inspectable" v-for="element in elements" @click="properties(element)" :class="{'selected': element.id === current.element}" track-by="$index" data-uk-grid-match>
			<div class="layout-wrap">
				<div class="layout-row" :style="style(element)">
					<div class="layout-columns uk-grid-match uk-grid-small">
						<div
							v-for="container in element.containers" track-by="$index"
							@click="properties(container)"
							@mouseenter.self="inspect($event, true)"
							@mouseleave.self="inspect($event, false)"
							class="uk-width-{{container.width}} uk-grid-match">


							<empty v-if="empty(container.items)"></empty>
						</div>
					</div>
				</div>
				<sortable-handler></sortable-handler>
			</div>
			<drop v-if="!empty(element.containers)"></drop>
		</div>
	</div>
</div>
</template>

<style lang="less">
@import "../css/animate.css";
@import "../css/uikit.less";
@import "../css/vars.less";
@import "../css/main.less";
</style>

<script>
/* Dependencies */
import Drag from "interact.js"
import _ from "underscore"

/* Content */
import Content from "./content.vue"

/* Content */
import Structure from "./structure.vue"

/* Empty content */
import Empty from './empty.vue';

/* Dropable */
import Drop from './drop.vue';

/* Sortable Handler */
import sortableHandler from './sortable-handler.vue';

/* Border Style */
import borderStyle from './border-style.vue';

/* Color Picker */
import colorPicker from './color-picker.vue';

/* Dropable */
import Number from './number.vue';

export default {
	name: 'Layout',
	components: {Content, Structure, Empty, Drop, sortableHandler, Number, borderStyle, colorPicker},
	data() {
		return {
			dropElement: null,
			elements: [],
			structures: ['1-1', '5-5', '3-7', '7-3', '2-8', '8-2', '6-4', '4-6'],
			contents: [
				['Text', 'Image', 'Button']
			],
			tabs: [
				{id: 'content', label: 'Content', icon: 'th'},
				{id: 'structure', label: 'Structure', icon: 'columns'},
				{id: 'body', label: 'Body', icon: 'wrench'},
				{id: 'css', label: 'Custom CSS', icon: 'code'}
			],
			rowTabs: [
				{id: 'layout', label: 'Layout'},
				{id: 'attribute', label: 'Attribute'},
				{id: 'bg', label: 'Bakground'},
				{id: 'animation', label: 'Animation'},
				{id: 'Responsive', label: 'Responsive'}
			],
			view: 'tab',
			current: {
				properties: {},
				element: null
			}
		}
	},
	computed: {},
	methods: {
		object (name) {
			return JSON.parse(JSON.stringify(this[name]));
		},

		/* Show inspector when mouse over */
		inspect (e, hover) {
			/*let parent = e.target.parentElement;

			if (hover && parent.classList.contains('inspectable'))  {
				parent.classList.add('normal');
			} else {
				parent.classList.remove('normal');
			}*/
		},

		/* Check current view */
		isView (view) {
			return this.view === view;
		},

		/* Set current view */
		viewing (view) {
			if (view === 'tab') this.$set('current.element', null)
			this.$set('view', view)
		},

		/* Show properties selected */
		properties (element) {
			if (element.type === 'row' && element.containers.length > 0) {
				this.$set('current.element', element.id);
				this.viewing('properties');
			}
			else if (element.type === 'column' && element.items.length > 0) {
				this.$set('current.element', element.id);
				this.viewing('properties');
			}

			this.$set('current.properties', element);
		},

		/* Render Style */
		style (element) {
			/* Layout Styles */
			let styles = {}, layout = element.layout;
			
			/* Apply CSS style */
			_.each(layout, function (value, prop) {
				if (_.isArray(value.styles)) {
					styles[prop] = value.styles.map((style) => {
						let int = parseInt(style)
						return (! isNaN(int)) ? int + value._.unit: style
					}).join(' ')
				}
				else if (_.isObject(value.styles)) {
					let settings = value._, styleName = prop;

					_.each (value.styles, function (value, prop) {
						//console.log(value, prop);
						let css = null;

						if (_.isArray(value)) {
							css = value.map((style) => {
								let int = parseInt(style)
								return (! isNaN(int)) ? int + settings.unit: style
							}).join(' ')
						} else {
							css = value;
						}

						styles[styleName + '-' + prop] = css;
					})
				}
			})

			console.log(styles)

			return styles;
		},

		/* Check if item is empty */
		empty (item) {
			return item.length === 0
		}
	},
	ready () {
		let self = this;

		/* Set menu height */
		/*$('#tab').css({
			height: $(window).height()
		});*/


		/* Watch cached */
		let oldVal = {
			margin: null,
			padding: null
		};

		/* Watcher for margin $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				let margin =  element.layout.margin
				return {
					index: index,
					topBottom: margin._.all,
					mode: margin._.mode,
					include: margin.include,
					value: parseInt(margin._.allValue)
				}
			})
		}, function (val) {
			_.each(val, function (prop, index) {
				/* If same with old value */
				if (oldVal.margin && (_.isEqual(prop, oldVal.margin[index]))) return

				/* Get actual margin */
				let margin = self.elements[prop.index].layout.margin

				/* Only set if mode is custom */
				if (prop.mode !== 'custom') {
					for (let i in margin.styles) {
						let index = parseInt(i), value, top = 0, bottom = 0;

						/* If top & bottom checked, set top and bottom as true */
						if (!prop.topBottom) {
							if (prop.include.t) {
								prop.include.t = false
								top = prop.value
							}
							if (prop.include.b) {
								prop.include.b = false
								bottom = prop.value
							}
							console.log(prop.include.t, prop.topBottom);
						} else {
							prop.include.t = prop.include.b = prop.topBottom
							top = bottom = prop.value
						}

						/**
						 * Set position based CSS margin rule, clockwise
						 */
						switch (index) {
							case 0: value = top; break;
							case 1: value = (prop.include.r)? prop.value: 0; break;
							case 2: value = bottom; break;
							case 3: value = (prop.include.l)? prop.value: 0; break;
						}
						
						/* Set the margin styles */
						margin.styles.$set(index, value)
					}
				}
			})

			/* Caching oldValue, vuejs doesn't support this, so I added it manually */
			oldVal.margin = val;
		}, {deep: true})


		/* Watcher for padding $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				let padding =  element.layout.padding
				return {
					index: index,
					all: padding._.all,
					value: parseInt(padding._.allValue)
				}
			})
		}, function (val) {
			_.each(val, function (prop, index) {
				/* If same with old value */
				if (oldVal.padding && _.isEqual(prop, oldVal.padding[index])) return

				/* Get actual margin */
				let padding = self.elements[prop.index].layout.padding

				if (prop.all) {
					for (let i in padding.styles) {
						padding.styles.$set(i, prop.value)
					}
				}
			})

			oldVal.padding = val;
		}, {deep: true})

		/* Watcher for border $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				let border =  element.layout.border
				return {
					index: index,
					all: border._.all,
					style: border._.allValue.style,
					width: border._.allValue.width,
					color: border._.allValue.color
				}
			})
		}, function (val) {
			_.each(val, function (prop, index) {
				/* If same with old value */
				if (oldVal.border && _.isEqual(prop, oldVal.border[index])) return

				/* Get actual margin */
				let border = self.elements[prop.index].layout.border

				if (prop.all) {
					/*_.each(border.styles, function (values, propName) {
						for (let i in values) {
							console.log(`border.styles.${propName}.$set(${i}, ${values[i]})`)
						}
					})*/
					_.each(border.styles, function (values, propName) {
						_.each(values, function (item, index) {
							border.styles[propName].$set(index, prop[propName])
						})
					})
				}
			})

			oldVal.border = val;
		}, {deep: true})

		/* Drop handler */
		const target = Drag('.dropable').dropzone({
			ondropactivate (event) {
				self.dropElement = null;
				$('.dropable').removeClass('drop-enter');
			},

			ondragenter (event) {
				$('.dropable').removeClass('drop-enter');
				self.dropElement = event.target;
				self.dropElement.classList.add('drop-enter');
			},

			ondrop (event) {},
			ondropdeactivate (event) {
				if (self.dropElement) {
					let source = event.relatedTarget,

					/**
					 * Define element properties
					 * @type {Object}
					 */
					element = {
						id: 'el-' + Date.now(),
						containers: [],
						type: 'row',
						layout: {
							margin: {
								_: {mode: 'inherit', unit: 'px', all: true, allValue: 15},
								include: {t: true, b: true, l: true, r: true},
								styles: [15, 15, 15, 15]
							},
							padding: {
								_: {all: true, allValue: 10, unit: 'px'},
								styles: [10, 10, 10, 10]
							},
							border: {
								_: {
									all: true,
									allValue: {
										width: 0,
										color: '#cccccc',
										style: 'solid'
									},
									unit: 'px'
								},
								styles: {
									width: [0, 0, 0, 0],
									color: ['#cccccc', '#cccccc', '#cccccc', '#cccccc'],
									style: ['solid', 'solid', 'solid', 'solid']
								}
							},
							background: {
								_: {},
								styles: ['#ffffff']
							}
						}
					},

					/* Create Flex Element */
					columns = source.getAttribute('data-width').split('-').filter(n => parseInt(n, 10)),

					/* Container ID */
					id = 'container-' + Date.now(), 

					/* Dropable index */
					index = 0,

					/* Elements' Size */
					size = self.elements.length
					;
					
					if (columns[0] === columns[1] && columns[0] < 5) {
						element.containers.push({
							id: id,
							width: '1-1',
							type: 'column',
							items: [],
							styles: {}
						});
					} else {
						for (let i in columns) {
							let column = columns[i];
							element.containers.push({
								id: id,
								width: column + '-10',
								items: [],
								styles: {}
							});
						}
					}

					/**
					 * Drop element in the latest mouseenter action
					 */
					$('.dropable').each(function (i, el) {
						if (el.getAttribute('id') === self.dropElement.getAttribute('id')) {
							index = i;
						}
					});

					/**
					 * We need to set timeout to prevent duplicate by vuejs
					 */
					setTimeout(function () {
						if (size > 0) {
							let elements = self.object('elements');
							if (elements.length === size) {
								elements.splice(index, 0, element)
								self.$set('elements', elements);
							}
						} else self.elements.$set(0, element)
					}, 10);

					/* Finally, remove the source element */
					source.remove();
				}

				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
			},
			ondragleave (event) {
				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
				self.dropElement.classList.add('drop-enter');
			}
		})

		const drag = Drag('.draggable').draggable({
			inertia: false,
			autoScroll: false,
			onmove (event) {
				let target = event.target,
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
			onend (event) {
				document.body.classList.remove('overflow-hidden');
				event.target.remove();
			}

		})
		.on('move', function (event) {
			let interaction = event.interaction;
			if (interaction.pointerIsDown && !interaction.interacting())
			{
				let original = event.currentTarget;
				let clone = original.cloneNode(true);
				clone.classList.add('moving')
				document.querySelector('#layout').appendChild(clone);

				if (interaction.start && event.interactable) {
					interaction.start({ name: 'drag' }, event.interactable, clone);
				}
			}
		})
	}
}
</script>