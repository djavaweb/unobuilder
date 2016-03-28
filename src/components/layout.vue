<template>
<div id="menu" @mouseover="editProperties=true" @mouseleave="editProperties=false">
	<ul id="menu-tab" class="uk-tab uk-tab-grid" data-uk-switcher="{connect:'#tab'}" @click="viewing('tab')">
		<li class="uk-width-1-4" v-for="tab in tabs" track-by="$index" :class="{'uk-active': $index === 1}">
			<a><i class="uk-icon-{{tab.icon}}"></i> {{tab.label}}</a>
		</li>
	</ul>

	<ul id="tab" class="uk-switcher animated" v-show="isView('tab')">
		<li class="tab-content">
			<div class="source contents">
				<div class="uk-grid uk-grid-small" v-for="content in contents">
					<content-item v-for="element in content" width="1-3" :icon="element.icon">{{element.label}}</content-item>
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
		<ul class="row-tab uk-tab uk-tab-grid" data-tab-id="row" data-uk-switcher="{connect: '#properties'}" :class="[propTabs.row.class]">
			<li class="uk-disabled">{{propTabs.row.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.row.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.row.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="row-tab uk-tab uk-tab-grid" data-tab-id="responsive" data-uk-switcher="{connect: '#properties-blank'}" :class="[propTabs.row.class]" v-show="propTabs.row.current===3">
			<li class="uk-disabled">{{propTabs.responsive.label}} <info :text="propTabs.responsive.info"></info></li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsive.items" track-by="$index" data-breakpoint="{{tab.id}}" data-index="{{$index}}" :class="{'uk-active': tab.id === current.selected}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="row-tab uk-tab uk-tab-grid" data-tab-id="responsiveProps" data-uk-switcher="{connect: '#properties'}" :class="[propTabs.row.class]" v-show="propTabs.row.current===3">
			<li class="uk-disabled">{{propTabs.responsiveProps.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsiveProps.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.responsiveProps.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>

		<ul id="properties-blank" class="k-switcher"></ul>
		<ul id="properties" class="properties-wrapper uk-switcher">
			<li></li>
			<li class="tab-content">
				<div class="properties" v-for="(prop, value) in properties.layout">
					<div class="uk-grid uk-grid-small">
						<label class="uk-width-1-5 uk-text-right">{{value.label}}</label>

						<div class="uk-width-4-5" transition="fade">
							<div v-if="prop==='margin'">
								<label><input type="radio" name="margin-type" value="inherit" v-model="value._.type"> Inherited from <a href="#customizer">customizer</a></label>
								<label class="block br"><input type="radio" name="margin-type" value="custom" v-model="value._.type"> Custom</label>

								<label><input type="radio" name="margin-size" value="15" v-model="value._.allValue"> Standard:15px</label>
								<label><input type="radio" name="margin-size" value="25" v-model="value._.allValue"> Larger:25px</label>
								<label class="block br"><input type="radio" name="margin-size" value="10" v-model="value._.allValue"> Smaller:10px</label>

								<label class="block"><input type="checkbox" v-model="value._.all"> Margin top + bottom</label>
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
										<switch :value.sync="value._.all"></switch>
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
										<switch :value.sync="value._.all"></switch>
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
							<div v-if="prop==='width'">
								<label class="block"><input type="radio" name="width-type" value="bg" v-model="value._.type"> Background <a href="#" style="margin-left:15px">Goto Background Settings</a></label>
								<label><input type="radio" name="width-type" value="content" v-model="value._.type"> Content</label>
							</div>
						</div>
					</div>
				</div>
			</li>
			<li class="tab-content">
				<div class="properties attribute" v-for="(name, attr) in properties.attribute">
					<div class="uk-grid uk-grid-small">
						<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
						<div class="uk-width-4-5" transition="fade">
							<div v-if="name==='class'">
								<input v-model="attr.value" type="text">
							</div>
							<div v-if="name==='id'">
								<input v-model="attr.value" type="text">
							</div>
							<div v-if="name==='css'">
								<textarea v-model="attr.value" cols="40" rows="10"></textarea>
							</div>
						</div>
					</div>
				</div>
			</li>
			<li class="tab-content">
				<div v-for="(name, attr) in properties.background">
					<div class="properties attribute" v-if="name==='type'">
						<div class="uk-grid uk-grid-small">
							<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
							<div class="uk-width-4-5" transition="fade">
								<label><input type="radio" name="background-type" v-model="attr.value" value="img"> Image</label>
								<label><input type="radio" name="background-type" v-model="attr.value" value="color"> Color</label>
								<label><input type="radio" name="background-type" v-model="attr.value" value="video"> Video</label>
							</div>
						</div>
					</div>
					<div class="properties attribute" v-if="name==='image' && properties.background.type.value==='img'">
						<div class="uk-grid uk-grid-small">
							<label class="uk-width-1-5 uk-text-right">{{properties.background.image.label}}</label>
							<div class="uk-width-4-5" transition="fade">
								<a>Add Image</a>
							</div>
						</div>
					</div>
					<div class="properties attribute" v-if="name=='color' && properties.background.type.value==='color'">
						<div class="uk-grid uk-grid-small">
							<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
							<div class="uk-width-4-5" transition="fade">
								<color-picker :color.sync="attr.value" position="right" :show-hex="true"></color-picker>
							</div>
						</div>
					</div>
					<div class="properties attribute" v-if="name==='style' && properties.background.type.value==='img'">
						<div class="uk-grid uk-grid-small">
							<label class="uk-width-1-5 uk-text-right">{{properties.background.style.label}}</label>
							<div class="uk-width-4-5">
								<select v-model="attr.value">
									<option v-for="type in bgType" :value="type.value">{{type.label}}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>

<div id="layout-wrapper">
	<device :enable="device.enable" :style="device.style" :rotate="device.rotate">
		<div id="layout">
			<drop class="layout-dropable" position="relative"></drop>
			<div id="{{element.id}}" class="layout-item inspectable" v-for="element in elements" @click="setProperties(element)" @mouseenter.capture="inspect($event, true)" @mouseleave.capture="inspect($event, false)" :class="{'selected': element.id === current.element}" track-by="$index" data-uk-grid-match>
				<div class="layout-wrap">
					<div class="layout-row" :style="style(element)">
						<div class="layout-wrapper">
							<div class="layout-columns uk-grid uk-grid-small uk-grid-match">
								<div class="layout-column uk-width-{{container.width}} uk-grid-match" v-for="container in element.containers" track-by="$index" @click="setProperties(container)">
									<empty class="layout-column-item" v-if="empty(container.items)"></empty>
								</div>
							</div>
						</div>
					</div>
					<sortable-handler class="layout-sortable"></sortable-handler>
				</div>

				<div class="layout-tool">
					<a @click="remove(element)" class="layout delete uk-icon-trash"></a>
					<a @click="duplicate($index, element)"  class="layout copy uk-icon-copy"></a>
				</div>

				<div class="layout-label">{{element.label}}</div>
				<drop class="layout-dropable" v-if="!empty(element.containers)"></drop>
			</div>
		</div>
	</device>
</div>
</template>

<style lang="less">
@import "../css/balloon.min.css";
@import "../css/animate.css";
@import "../css/uikit.less";
@import "../css/vars.less";
@import "../css/main.less";
@import "../../node_modules/sweetalert/dist/sweetalert.css";
</style>

<script>
/* Dependencies */
import Drag from "interact.js"
import Sortable from "../js/sortable.min.js"
import _ from "underscore"
import MsgBox from "sweetalert"

/* Content */
import contentItem from "./content-item.vue"

/* Content */
import Structure from "./structure.vue"

/* Empty content */
import Empty from './empty.vue';

/* Dropable */
import Drop from './drop.vue';

/* Color Picker */
import Switch from './switch.vue';

/* Sortable Handler */
import sortableHandler from './sortable-handler.vue';

/* Border Style */
import borderStyle from './border-style.vue';

/* Color Picker */
import colorPicker from './color-picker.vue';

/* Info */
import Info from './info.vue';

/* Dropable */
import Number from './number.vue';

/* Device */
import Device from './device.vue';

/* JSON Data */
import Animation from '../data/animation.json';
import BackgroundType from '../data/bgtype.json';

export default {
	name: 'Layout',
	components: {contentItem, Structure, Empty, Drop, Switch, sortableHandler, Number, borderStyle, colorPicker, Info, Device},
	data() {
		let self = this

		return {
			dropElement: null,
			body: {},
			elements: [],
			structures: ['1-1', '5-5', '3-7', '7-3', '2-8', '8-2', '6-4', '4-6'],
			contents: [
				[{icon: 'font', label: 'Text'}, {icon: 'image', label: 'Image'}, {icon: 'hand-pointer-o', label: 'Button'}]
			],
			tabs: [
				{id: 'content', label: 'Content', icon: 'th'},
				{id: 'structure', label: 'Structure', icon: 'columns'},
				{id: 'body', label: 'Body', icon: 'wrench'},
				{id: 'css', label: 'Custom CSS', icon: 'code'}
			],
			propTabs: {
				row: {
					label: 'Row Properties',
					current: 0,
					class: '',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'},
						{id: 'Responsive', label: 'Responsive'}
					]
				},

				responsive: {
					label: 'Breakpoints',
					info: 'Breakpoints Help',
					current: 3,
					class: '',
					items: [
						{id: 'mini', label: 'Mini'},
						{id: 'small', label: 'Small'},
						{id: 'medium', label: 'Medium'},
						{id: 'large', label: 'Large'},
						{id: 'xlarge', label: 'XLarge'}
					]
				},

				responsiveProps: {
					label: 'Row Properties',
					current: 0,
					class: '',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'}
					]
				}
			},
			view: 'tab',
			current: {
				selected: 'large',
				properties: {responsive:{}},
				element: null
			},
			device: {
				enable: false,
				style: 'iphone6',
				rotate: ''
			},
			editProperties: false,
			bgType: BackgroundType,
			sortable: null
		}
	},
	computed: {
		properties: {
			get () {
				if (! this.validProperties()) return {}
				return this.current.properties.responsive[this.current.selected]
			}
		}
	},
	methods: {
		validProperties () {
			return this.current.selected && this.current.properties.responsive !== undefined && this.current.properties.responsive[this.current.selected]
		},

		object (name) {
			return JSON.parse(JSON.stringify(this[name]));
		},

		/* Show inspector when mouse over */
		inspect (e, hover) {
			let el = e.target
			if (el.classList.contains('layout-column-item') && !el.classList.contains('layout-column-item-child')) {
				if (hover) {
					el.classList.add('inspectable')
				} else {
					el.classList.remove('inspectable')
				}
			}
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
		setProperties (element) {
			this.$set('current.properties', element);

			if (element.type === 'row' && element.containers.length > 0) {
				this.$set('current.element', element.id);
				this.viewing('properties');
			}
			else if (element.type === 'column' && element.items.length > 0) {
				this.$set('current.element', element.id);
				this.viewing('properties');
			}

			$('#menu-tab').data().switcher.show(1);
		},

		/* Render Style */
		style (element) {
			/* Layout Styles */
			let styles = {}

			let breakpoint = this.current.selected || 'large'
			let properties = element.responsive[breakpoint]

			/* Apply CSS style if there is styles object */
			_.each(properties, function (element, index) {
				_.each(element, function (value, prop) {
					if (value.styles) {
						if (_.isArray(value.styles)) {
							styles[prop] = value.styles.map((style) => {
								let int = parseInt(style)
								return (! isNaN(int)) ? int + value._.unit: style
							}).join(' ')
						}
						else if (_.isObject(value.styles)) {
							let settings = value._,	styleName = prop;

							_.each(value.styles, function (value, prop) {

								if (_.isArray(value)) {
									styles[styleName + '-' + prop] = value.map((style) => {
										let int = parseInt(style)
										return (! isNaN(int)) ? int + settings.unit: style
									}).join(' ')
								} else {
									styles[prop] = value
								}
								
							})
						}
					}
				})
			})			

			//console.log(styles)
			delete styles['']
			return styles;
		},

		/* Check if item is empty */
		empty (item) {
			return item.length === 0
		},

		/* Delete and duplicate elements */
		remove (element) {
			let self = this

			MsgBox({
				title: "Are you sure?",
				text: "This action cannot be undone. We are working on an UNDO feature, but it is not available yet.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#c0392b",
				confirmButtonText: "Delete!",
				cancelButtonText: "Cancel",
				closeOnConfirm: false
			}, function (isConfirm) {
				if (isConfirm && self.elements.$remove(element)) {
					self.viewing('tab')
					MsgBox.close()
				}
			})
		},

		duplicate (index, element) {
			let newElement = $.extend(true, {}, element), newId = 'el-' + Date.now()
			newElement.id = newId
			_.map(newElement.responsive, function (breakpoint, index) {
				breakpoint.id = breakpoint.attribute.id.value = newId
				return breakpoint
			})
			this.elements.splice(index, 0, newElement)
		},

		/* Enable sortabe every breakpoints changes */
		enableSortable () {
			if (this.sortable) this.sortable.destroy()
			let self = this, sortable = new Sortable(document.querySelector('#layout'), {
				filter: '.dropable',
				handle: '.sortable-handler',
				ghostClass: 'sorting',
				chosenClass: 'sorting',
				onSort: function (e) {
					let newIndex = e.newIndex - 1,
					oldIndex = e.oldIndex - 1;

					if (self.elements) {
						let cache = self.elements[newIndex]
						self.elements.$set(newIndex, self.elements[oldIndex])
						self.elements.$set(oldIndex, cache)
					}
				}
			})
			this.$set('sortable', sortable)
		}
	},
	ready () {
		let self = this;

		/* Set menu height */
		/*$('#tab').css({
			height: $(window).height()
		});*/

		/* Row tab access item */
		$('[data-uk-switcher]').on('show.uk.switcher', function(event, el){
			let element = el[0],
			id = element.parentElement.getAttribute('data-tab-id'), 
			index = parseInt(element.getAttribute('data-index'));

			if (id) {
				/**
				* If user click on layout tab in main properties tab
				* Set current.properties into default, it's from cache
				*/
				if (id === 'row' && index !== 3) {
					// Set to default breakpoint
					self.$set('current.selected', 'large')
					self.$set('device.enable', false)

					// Set current tab
					self.propTabs[id].current = index
				}

				/**
				* If user click on responsive tab
				* Set current.properties from current breakpoint
				*
				* If user change breakpoint, change current.properties too
				*/
				else if ((id === 'row' && index === 3) || id === 'responsive') {
					let breakpoint;

					if (id === 'responsive') {
						breakpoint = el[0].getAttribute('data-breakpoint')
					} else {
						let responsiveEl = $('[data-tab-id="responsive"]')
						breakpoint = responsiveEl.children().eq(responsiveEl.data().switcher.index).attr('data-breakpoint')
					}

					if (breakpoint) {
						// Show layout tab
						if (id === 'responsive') {
							if (['mini', 'small', 'medium'].includes(breakpoint)) {
								let style = 'iphone6', rotate = ''

								if (breakpoint === 'medium') {
									style = 'ipad'
									rotate = 'landscape'
								}

								self.$set('device', {
									style: style,
									rotate: rotate,
									enable: true
								})

							} else {
								self.$set('device.enable', false)
							}

							self.$set('current.selected', breakpoint)
						} else {
							self.propTabs[id].current = index
							self.$set('current.selected', 'large')
							$('[data-tab-id="responsiveProps"]').data().switcher.show(1)
						}
					}
				}
			}
		});


		/* On device enable re enable sortable */
		self.$watch('device.enable', function () {
			self.enableSortable();
		})


		/* Hide selected layout when onclick outside */
		self.$on('click', function (params) {
			let el = params.el
			if (! el.className.includes('layout') && ! self.editProperties) {
				self.$set('device.enabled', false)
				self.viewing('tab')
			}
		})


		/* Watch cached */
		let oldVal = {
			margin: [],
			padding: [],
			border: [],
			background: [],
			css: []
		},
		breakpoints = {mini: {}, small: {}, medium: {}, large: {}, xlarge: {}};

		/* Watcher for margin $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				if (! self.validProperties()) return {}
				return _.map(element.responsive, function (responsive, breakpoint) {
					let margin = responsive.layout.margin
					return {
						index: index,
						breakpoint: breakpoint,
						topBottom: margin._.all,
						type: margin._.type,
						include: {t: margin.include.t, r: margin.include.r, b: margin.include.b, l: margin.include.l},
						value: parseInt(margin._.allValue)
					}
				})
			})
		}, function (val) {
			_.each(val, function (breakpoint, index) {
				_.each(breakpoint, function (prop, index) {
					// Cancel, if old margin has the same value with old value
					if (! oldVal.margin[prop.index]) oldVal.margin[prop.index] = $.extend(true, {}, breakpoints)
					if (_.isEqual(prop, oldVal.margin[prop.index][prop.breakpoint])) return

					// Get actual margin
					let margin = self.elements[prop.index].responsive[prop.breakpoint].layout.margin

					// Only set if mode is custom
					if (prop.type !== 'custom') {
						for (let i in margin.styles) {
							if (prop.topBottom) {
								prop.include.t = prop.include.b = true
								margin.include.t = margin.include.b = true
							}

							let index = parseInt(i), value

							switch (index) {
								case 0: value = (prop.include.t)? prop.value: 0; break;
								case 1: value = (prop.include.r)? prop.value: 0; break;
								case 2: value = (prop.include.b)? prop.value: 0; break;
								case 3: value = (prop.include.l)? prop.value: 0; break;
							}

							margin.styles.$set(index, value)
						}
					}

					// Caching oldValue, vuejs doesn't support this, so I added it manually
					oldVal.margin[prop.index][prop.breakpoint] = prop;
				})
			})
		}, {deep: true})


		/* Watcher for padding $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				if (!self.validProperties()) return {}
				return _.map(element.responsive, function (responsive, breakpoint) {
					let padding = responsive.layout.padding
					return {
						index: index,
						breakpoint: breakpoint,
						all: padding._.all,
						value: parseInt(padding._.allValue)
					}
				})
			})
		}, function (val) {
			_.each(val, function (breakpoint, index) {
				_.each(breakpoint, function (prop, index) {
					// Cancel, if old padding has the same value with old value
					if (! oldVal.padding[prop.index]) oldVal.padding[prop.index] = $.extend(true, {}, breakpoints)
					if (_.isEqual(prop, oldVal.padding[prop.index][prop.breakpoint])) return

					// Get actual padding
					let padding = self.elements[prop.index].responsive[prop.breakpoint].layout.padding

					if (prop.all) {
						for (let i in padding.styles) {
							padding.styles.$set(i, prop.value)
						}
					}

					// Caching
					oldVal.padding[prop.index][prop.breakpoint] = prop;
				})
			})
		}, {deep: true})

		/* Watcher for border $set all */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				if (! self.validProperties()) return {}
				return _.map(element.responsive, function (responsive, breakpoint) {
					let border = responsive.layout.border
					return {
						index: index,
						breakpoint: breakpoint,
						all: border._.all,
						style: border._.allValue.style,
						width: border._.allValue.width,
						color: border._.allValue.color
					}
				})
			})
		}, function (val) {
			_.each(val, function (breakpoint, index) {
				_.each(breakpoint, function (prop, index) {
					// Cancel, if old border has the same value with old value
					if (! oldVal.border[prop.index]) oldVal.border[prop.index] = $.extend(true, {}, breakpoints)
					if (_.isEqual(prop, oldVal.border[prop.index][prop.breakpoint])) return

					// Get actual margin
					let border = self.elements[prop.index].responsive[prop.breakpoint].layout.border

					if (prop.all) {
						_.each(border.styles, function (values, propName) {
							_.each(values, function (item, index) {
								border.styles[propName].$set(index, prop[propName])
							})
						})
					}

					// Caching
					oldVal.border[prop.index][prop.breakpoint] = prop;
				})
			})
		}, {deep: true})


		/* Watcher for attribute.css */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				if (! self.validProperties()) return {}
				return _.map(element.responsive, function (responsive, breakpoint) {
					return {
						index: index,
						breakpoint: breakpoint,
						css: responsive.attribute.css.value
					}
				})
			})
		}, function (val) {
			_.each(val, function (breakpoint, index) {
				_.each(breakpoint, function (prop, index) {
					// Get css attribute
					let cssAttr = self.elements[prop.index].responsive[prop.breakpoint].attribute.css

					// Parsing css
					let inlineCSS = {}, css = prop.css.replace(/(?:\r\n|\r|\n)/g, '').split(';').map((item) => item.split(':'))

					for (let i in css) {
						inlineCSS[css[i][0]] = css[i][1]
					}

					cssAttr.styles = inlineCSS
				})
			})
		})


		/** Background properties watcher */
		self.$watch(function () {
			return self.elements.map(function (element, index) {
				if (! self.validProperties()) return {}
				return _.map(element.responsive, function (responsive, breakpoint) {
					let background = responsive.background
					return {
						index: index,
						breakpoint: breakpoint,
						bgType: background.type.value,
						bgColor: background.color.value,
						bgImage: background.image.value,
						bgVideo: background.video.value,
						bgStyle: background.video.style
					}
				})
			})
		}, function (val) {
			_.each(val, function (breakpoint, index) {
				_.each(breakpoint, function (prop, index) {
					// Cancel, if old background has the same value with old value
					if (! oldVal.background[prop.index]) oldVal.background[prop.index] = $.extend(true, {}, breakpoints)
					if (_.isEqual(prop, oldVal.background[prop.index][prop.breakpoint])) return

					// Get background properties
					let styles = {}, background = self.elements[prop.index].responsive[prop.breakpoint].background

					switch (prop.bgType) {
						case 'img':

						break;

						case 'color':
							if (prop.bgColor) styles.backgroundColor = prop.bgColor
						break;
					}

					background.color.styles = styles

					// Caching
					oldVal.background[prop.index][prop.breakpoint] = prop;
				})
			})
		})





		/**
		 * Define properties for multiple purpose
		 * @type {Object}
		 */
		let defaultProps = {
			id: null,
			containers: [],
			type: 'row',
			layout: {
				margin: {
					label: 'Margin',
					_: {type: 'inherit', unit: 'px', all: true, allValue: 0},
					include: {t: true, b: true, l: true, r: true},
					styles: [0, 0, 0, 0]
				},
				padding: {
					label: 'Padding',
					_: {all: true, allValue: 10, unit: 'px'},
					styles: [10, 10, 10, 10]
				},
				border: {
					label: 'Border',
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
				width: {
					label: 'Full Width',
					_: {type: 'bg'}
				}
			},
			attribute: {
				class: {
					label: 'CSS Class',
					value: 'custom-class'
				},
				id: {
					label: 'ID',
					value: null
				},
				css: {
					label: 'Inline CSS',
					value: '',
					styles: {}
				}
			},
			background: {
				type: {
					label: 'Type',
					value: 'color'
				},
				image: {
					label: 'Image',
					value: ''
				},
				color: {
					label: 'Color',
					value: '#ffffff',
					styles: {}
				},
				video: {
					label: 'Video',
					value: ''
				},
				style: {
					label: 'Style',
					value: 'parallax'
				}
			},
			animation: {
				reveal: {
					label: 'Reveal',
					value: false
				},
				transition: {
					label: 'Type',
					value: 'fadeIn'
				},
				offset: {
					label: 'Top Offset',
					value: 0
				},
				delay: {
					label: 'Delay',
					value: 1000
				},
				repeat: {
					label: 'Repeat',
					value: true
				}
			}
		};

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
					elementId = 'el-' + Date.now(),

					/* Create Flex Element */
					columns = source.getAttribute('data-width').split('-').filter(n => parseInt(n, 10)),

					/* Container ID */
					id = 'container-' + Date.now(), 

					/* Dropable index */
					index = 0,

					/* Elements' Size */
					size = self.elements.length;


					// Set current element id
					let element = $.extend(true, {}, defaultProps)
					element.id = elementId
					element.attribute.id.value = elementId
					element.label = 'Structure'

					/**
					* Copy element properties into responsive
					*/
					let responsive = $.extend(true, {}, element)

					/* Delete unnecessary properties after cloned */
					let dumpProps = ['layout', 'background', 'attribute', 'animation']
					for (let i in dumpProps) delete dumpProps[i];

					/* Delete unnecessary cloned properties */
					dumpProps = ['id', 'containers', 'type']
					for (let i in dumpProps) delete dumpProps[i];

					// Define responsive breakpoints
					let defaultBreakpoint = $.extend(true, {}, responsive)
					element.layout = defaultBreakpoint.layout
					element.background = defaultBreakpoint.background
					element.attribute = defaultBreakpoint.attribute

					// Set breakpoints
					element.responsive = {
						mini: $.extend(true, {}, responsive),
						small: $.extend(true, {}, responsive),
						medium: $.extend(true, {}, responsive),
						large: defaultBreakpoint,
						xlarge: $.extend(true, {}, responsive)
					}

					/**
					* Make containers only 1 item if width is 1-1
					*/
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
								self.$set('elements', elements)
							}
						} else self.elements.$set(0, element)
					}, 10);

					// Finally, remove the source element
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

		/* Draggable */
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

		/* Sortable */
		this.enableSortable()
	}
}
</script>