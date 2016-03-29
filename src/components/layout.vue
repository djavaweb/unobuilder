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
					<content-item v-for="row in content" width="1-3" :icon="row.icon">{{row.label}}</content-item>
				</div>
			</div>
		</li>

		<li class="tab-content">
			<div class="source structures">
				<structure v-for="structure in structures" :width="structure"></structure>
			</div>
		</li>

		<li class="tab-content">
			Body properties
		</li>
	</ul>

	<div id="properties-view" v-show="isView('properties')" class="animated" transition="appear">
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="row" data-uk-switcher="{connect: '#properties'}" :class="[propTabs.row.class]">
			<li class="uk-disabled">{{propTabs.row.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.row.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.row.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="responsive" data-uk-switcher="{connect: '#properties-blank'}" :class="[propTabs.responsive.class]" v-show="propTabs.row.current===3">
			<li class="uk-disabled">{{propTabs.responsive.label}} <info :text="propTabs.responsive.info"></info></li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsive.items" track-by="$index" data-breakpoint="{{tab.id}}" data-index="{{$index}}" :class="{'uk-active': tab.id === current.selected}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="responsiveProps" data-uk-switcher="{connect: '#properties'}" :class="[propTabs.responsiveProps.class]" v-show="propTabs.row.current===3">
			<li class="uk-disabled">{{propTabs.responsiveProps.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsiveProps.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.responsiveProps.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>

		<ul id="properties-blank" class="uk-switcher"></ul>
		<ul id="properties" class="properties-wrapper uk-switcher" :class="activeTabClass">
			<li></li>
			<li class="tab-content">
				<properties :props="properties.layout" type="layout" name="row"></properties>
			</li>
			<li class="tab-content">
				<properties :props="properties.attribute" type="attribute" name="row"></properties>
			</li>
			<li class="tab-content">
				<properties :props="properties.background" type="background" name="row"></properties>
			</li>
		</ul>

		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="columns" data-uk-switcher="{connect: '#column-properties-blank'}" :class="[propTabs.columns.class]" v-show="current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.columns.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.columns.items" track-by="$index" data-index="{{$index}}" v-show="$index<current.columnsSize" :class="{'uk-active': $index === propTabs.columns.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="column" data-uk-switcher="{connect: '#column-properties'}" :class="[propTabs.column.class]" v-show="current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.column.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.column.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.column.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid third" data-tab-id="responsive" data-uk-switcher="{connect: '#properties-blank'}" v-show="propTabs.column.current===4&&current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.responsive.label}} <info :text="propTabs.responsive.info"></info></li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsive.items" track-by="$index" data-breakpoint="{{tab.id}}" data-index="{{$index}}" :class="{'uk-active': tab.id === current.selected}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="responsiveColumnProps" data-uk-switcher="{connect: '#column-properties'}" :class="[propTabs.responsiveColumnProps.class]" v-show="propTabs.column.current===4&&current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.responsiveColumnProps.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsiveColumnProps.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.responsiveColumnProps.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>

		<ul id="column-properties-blank" class="uk-switcher"></ul>
		<ul id="column-properties" class="properties-wrapper uk-switcher second" :class="activeColumnTabClass" v-show="current.selectedColumn!==-1">
			<li></li>
			<li class="tab-content">
				<properties :props="columnProperties.layout" type="layout" name="column"></properties>
			</li>
			<li class="tab-content">
				<properties :props="columnProperties.attribute" type="attribute" name="column"></properties>
			</li>
			<li class="tab-content">
				<properties :props="columnProperties.background" type="background" name="column"></properties>
			</li>
			<li class="tab-content">
				<properties :props="columnProperties.animation" type="animation" name="column"></properties>
			</li>
		</ul>
	</div>
</div>

<div id="layout-wrapper">
	<device :enable="device.enable" :style="device.style" :rotate="device.rotate">
		<div id="layout">
			<drop class="layout-dropable" accept="structure" position="relative"></drop>
			<div id="{{row.id}}" class="layout-item inspectable" v-for="row in rows" @click.capture="setProperties(row)" @mouseenter.capture="inspect($event, true)" @mouseleave.capture="inspect($event, false)" :class="{'selected': row.id === current.row}" track-by="$index" data-uk-grid-match>
				<div class="layout-wrap">
					<div class="layout-row" :style="style(row)">
						<div class="layout-wrapper">
							<div class="layout-columns uk-grid uk-grid-small uk-grid-match">
								<div class="layout-column uk-grid-match uk-width-{{column.width[0]}}-{{column.width[1]}}" v-for="column in row.columns" id="{{column.id}}" track-by="$index" @click="setProperties(column, row, $index)">
									<drop class="layout-dropable" accept="item" position="left"></drop>
									<drop class="layout-dropable" accept="item" position="right"></drop>
									<drop class="layout-dropable" accept="item"></drop>
									<empty class="layout-column-item" v-if="empty(column.items)" :selected="current.column === column.id"></empty>
									<drop class="layout-dropable" accept="item"></drop>
								</div>
							</div>
						</div>
					</div>
					<sortable-handler class="layout-sortable"></sortable-handler>
				</div>

				<div class="layout-tool">
					<a @click="remove(row)" class="layout delete uk-icon-trash"></a>
					<a @click="duplicate($index, row)"  class="layout copy uk-icon-copy"></a>
				</div>

				<div class="layout-label">{{row.label}}</div>
				<drop class="layout-dropable" accept="structure" v-if="!empty(row.columns)"></drop>
			</div>
		</div>
	</device>

	<div id="responsive-switcher">
		<a data-balloon="Mini Screen on Small Mobile Phones" data-balloon-pos="up" @click="setDevice('mini')" class="mini" :class="{selected: current.selected === 'mini'}"><i class="uk-icon-mobile"></i></a>
		<a data-balloon="Small Screen on Mobile Phones" data-balloon-pos="up" @click="setDevice('small')" :class="{selected: current.selected === 'small'}"><i class="uk-icon-mobile"></i></a>
		<a data-balloon="Medium Screen on Tablets" @click="setDevice('medium')" :class="{selected: current.selected === 'medium'}"><i class="uk-icon-tablet"></i></a>
		<a data-balloon="Large Screen on Laptops / TV" @click="setDevice('large')" :class="{selected: current.selected === 'large' || current.selected === 'xlarge'}"><i class="uk-icon-laptop"></i></a>
	</div>
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

/* JSON Data */
import Animation from '../data/animation.json';
import BackgroundType from '../data/bgtype.json';

/* Content */
import contentItem from "./content-item.vue"

/* Content */
import Structure from "./structure.vue"

/* Properties */
import Properties from './properties.vue';

/* Empty content */
import Empty from './empty.vue';

/* Dropable */
import Drop from './drop.vue';

/* Sortable Handler */
import sortableHandler from './sortable-handler.vue';

/* Info */
import Info from './info.vue';

/* Device */
import Device from './device.vue';


export default {
	name: 'Layout',
	components: {contentItem, Structure, Properties, Empty, Drop, sortableHandler, Info, Device},
	data() {
		let self = this

		return {
			droprow: null,
			draggableMove: false,
			body: {},
			rows: [],
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
			activeTabClass: '',
			activeColumnTabClass: '',
			propTabs: {
				row: {
					label: 'Row Properties',
					current: 0,
					class: 'first',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'},
						{id: 'responsive', label: 'Responsive'}
					]
				},

				columns: {
					label: 'Select Column to Edit',
					current: 0,
					class: 'first',
					items: [
						{id: 'col-1', label: 'Col-1'},
						{id: 'col-2', label: 'Col-2'},
						{id: 'col-3', label: 'Col-3'},
						{id: 'col-4', label: 'Col-4'},
						{id: 'col-5', label: 'Col-5'},
						{id: 'col-6', label: 'Col-6'}
					]
				},

				column: {
					label: 'Cols Properties',
					current: 0,
					class: 'second',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'},
						{id: 'animation', label: 'Animation'},
						{id: 'responsive', label: 'Responsive'}
					]
				},

				responsive: {
					label: 'Breakpoints',
					info: 'Breakpoints Help',
					current: 3,
					class: 'second',
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
					class: 'third',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'}
					]
				},

				responsiveColumnProps: {
					label: 'Column Properties',
					current: 0,
					class: 'fourth',
					items: [
						{id: 'layout', label: 'Layout'},
						{id: 'attribute', label: 'Attributes'},
						{id: 'bg', label: 'Background'},
						{id: 'animation', label: 'Animation'}
					]
				},
			},
			view: 'tab',
			current: {
				selected: 'large',
				selectedColumn: 0,
				properties: {responsive:{}},
				columnProperties: {responsive: {}},
				columnsSize: 6,
				column: '',
				row: null
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
		},

		columnProperties: {
			get () {
				if (! this.validProperties(true)) return {}
				return this.current.columnProperties.responsive[this.current.selected]
			}
		}
	},
	methods: {
		validProperties (isColumn) {
			if (isColumn) return this.current.selected && this.current.columnProperties.responsive !== undefined && this.current.columnProperties.responsive[this.current.selected]
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
					if (!el.classList.contains('selected')) el.classList.remove('inspectable')
				}
			}
		},

		/* Check current view */
		isView (view) {
			return this.view === view;
		},

		/* Set current view */
		viewing (view) {
			if (view === 'tab') {
				this.$set('current.row', null)
				this.$set('current.column', null)
			}
			this.$set('view', view)
		},

		/* Show properties selected */
		setProperties (item, parent, index) {
			if (item.type === 'row' && item.columns.length > 0) {
				this.$set('current.properties', item)
				this.$set('current.selectedColumn', -1)
				this.$set('current.column', '')
				this.$set('current.row', item.id)
				this.$set('current.columnsSize', item.columns.length)
			}
			else if (item.type === 'column') {
				this.$set('current.properties', parent)
				this.$set('current.columnProperties', item)
				this.$set('current.selectedColumn', index)
				this.$set('current.column', item.id)
				this.$set('current.row', parent.id)
				this.$set('current.columnsSize', parent.columns.length)
			}

			this.viewing('properties');
			$('#menu-tab').data().switcher.show(1);
		},

		/* Render Style */
		style (row) {
			/* Layout Styles */
			let styles = {}

			let breakpoint = this.current.selected || 'large'
			let properties = row.responsive[breakpoint]

			/* Apply CSS style if there is styles object */
			_.each(properties, function (row, index) {
				_.each(row, function (value, prop) {
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

		/* Delete and duplicate rows */
		remove (row) {
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
				if (isConfirm && self.rows.$remove(row)) {
					self.viewing('tab')
					MsgBox.close()
				}
			})
		},

		duplicate (index, row) {
			let newrow = $.extend(true, {}, row), newId = 'el-' + Date.now()
			newrow.id = newId
			_.map(newrow.responsive, function (breakpoint, index) {
				breakpoint.id = breakpoint.attribute.id.value = newId
				return breakpoint
			})
			this.rows.splice(index, 0, newrow)
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

					if (self.rows) {
						let cache = self.rows[newIndex]
						self.rows.$set(newIndex, self.rows[oldIndex])
						self.rows.$set(oldIndex, cache)
					}
				}
			})
			this.$set('sortable', sortable)
		},

		setDevice (breakpoint) {
			let self = this

			switch (breakpoint) {
				case 'mini':
					self.$set('device', {
						enable: true,
						style: 'iphone4s',
						rotate: ''
					})
				break;
				case 'small':
					self.$set('device', {
						enable: true,
						style: 'iphone6',
						rotate: ''
					})
				break;

				case 'medium':
					self.$set('device', {
						enable: true,
						style: 'ipad',
						rotate: 'landscape'
					})
				break;

				case 'xlarge':
				case 'large':
					self.$set('device.enable', false)
				break;
			}

			self.$set('current.selected', breakpoint)
			self.$set('current.column', self.current.column)
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
			let row = el[0],
			id = row.parentElement.getAttribute('data-tab-id'), 
			index = parseInt(row.getAttribute('data-index'));

			if (id) {
				/**
				* If user click on layout tab in main properties tab
				* Set current.properties into default, it's from cache
				*/
				if ((id === 'row' && index !== 3) || (id === 'column' && index !== 4)) {
					// Set to default device
					self.setDevice('large')
					self.$set('activeTabClass', '')
					self.$set('activeColumnTabClass', '')

					// Set current tab
					self.$set('propTabs.'.concat(id, '.current'), index)
				}

				/**
				* If user click on responsive tab
				* Set current.properties from current breakpoint
				*
				* If user change breakpoint, change current.properties too
				*/
				else if (((id === 'row' && index === 3) || (id === 'column' && index === 4)) || id === 'responsive') {
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
							self.setDevice(breakpoint)							
						} else {
							self.$set('propTabs.'.concat(id, '.current'), index)
							if (id === 'row') {
								self.$set('activeTabClass', 'third')
								$('[data-tab-id="responsiveProps"]').data().switcher.show(1)
							} else if (id === 'column') {
								self.$set('activeColumnTabClass', 'fourth')
								$('[data-tab-id="responsiveColumnProps"]').data().switcher.show(1)
							}
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
			return self.rows.map(function (row, index) {
				if (! self.validProperties()) return {}
				return _.map(row.responsive, function (responsive, breakpoint) {
					let margin = responsive.layout.margin
					return {
						index: index,
						breakpoint: breakpoint,
						topBottom: margin._.tb,
						tbValue: parseInt(margin._.tbValue),
						type: margin._.type,
						include: {t: margin.include.t, r: margin.include.r, b: margin.include.b, l: margin.include.l},
						all: margin._.all,
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
					let margin = self.rows[prop.index].responsive[prop.breakpoint].layout.margin

					if (prop.type === 'inherit') {
						for (let i in margin.styles) {
							if (prop.topBottom) {
								prop.include.t = prop.include.b = margin.include.t = margin.include.b = true
								prop.include.l = prop.include .l = margin.include.l = margin.include.r = false
							}

							let index = parseInt(i), value

							switch (index) {
								case 0: value = (prop.include.t)? prop.tbValue: 0; break;
								case 1: value = (prop.include.r)? prop.tbValue: 0; break;
								case 2: value = (prop.include.b)? prop.tbValue: 0; break;
								case 3: value = (prop.include.l)? prop.tbValue: 0; break;
							}

							margin.styles.$set(index, value)
						}
					} else {
						if (prop.all) {
							for (let i in margin.styles) {
								margin.styles.$set(i, prop.value)
							}
						}
					}

					// Caching oldValue, vuejs doesn't support this, so I added it manually
					oldVal.margin[prop.index][prop.breakpoint] = prop;
				})
			})
		}, {deep: true})


		/* Watcher for padding $set all */
		self.$watch(function () {
			return self.rows.map(function (row, index) {
				if (!self.validProperties()) return {}
				return _.map(row.responsive, function (responsive, breakpoint) {
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
					let padding = self.rows[prop.index].responsive[prop.breakpoint].layout.padding

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
			return self.rows.map(function (row, index) {
				if (! self.validProperties()) return {}
				return _.map(row.responsive, function (responsive, breakpoint) {
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
					let border = self.rows[prop.index].responsive[prop.breakpoint].layout.border

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
			return self.rows.map(function (row, index) {
				if (! self.validProperties()) return {}
				return _.map(row.responsive, function (responsive, breakpoint) {
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
					let cssAttr = self.rows[prop.index].responsive[prop.breakpoint].attribute.css

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
			return self.rows.map(function (row, index) {
				if (! self.validProperties()) return {}
				return _.map(row.responsive, function (responsive, breakpoint) {
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
					let styles = {}, background = self.rows[prop.index].responsive[prop.breakpoint].background

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
			columns: [],
			type: 'row',
			layout: {
				margin: {
					label: 'Margin',
					_: {type: 'custom', unit: 'px', tb: false, tbValue: 10, all: true, allValue: 10},
					include: {t: true, b: true, l: true, r: true},
					styles: [10, 10, 10, 10]
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
		let dropzone = {
			ondropactivate (event) {
				self.droprow = null;
				$('.dropable').removeClass('drop-enter');
			},

			ondragenter (event) {
				$('.dropable').removeClass('drop-enter');
				self.droprow = event.target;
				self.droprow.classList.add('drop-enter');
			},

			ondrop (event) {},
			ondropdeactivate (event) {
				if (self.droprow) {
					let accepting = self.droprow.getAttribute('data-accept'),
					source = event.relatedTarget,
					randomInt = function () {
						return Math.floor(Math.random() * (1000 - 10 + 1)) + 10
					}
					

					/**
					* Structure dropable
					*/
					if (accepting === 'structure') {
						let rowId = 'el-' + Date.now() + randomInt(),

						// Create Flex Columns
						columns = source.getAttribute('data-width').split('-').filter(n => parseInt(n, 10)),

						// Dropable index
						index = 0,

						// rows Size
						size = self.rows.length;

						// Set current row id
						let row = $.extend(true, {}, defaultProps)
						row.id = row.attribute.id.value = rowId
						row.label = 'Structure'

						// Copy row properties into responsive breakpoints
						let responsive = $.extend(true, {}, row)

						/* Delete unnecessary properties after cloned */
						let dumpProps = ['layout', 'background', 'attribute', 'animation']
						for (let i in dumpProps) delete row[dumpProps[i]];

						// Delete unnecessary cloned properties
						let dumpRowProps = ['id', 'columns', 'type', 'animation']
						for (let i in dumpRowProps) delete responsive[dumpRowProps[i]];

						// Define responsive breakpoints
						let defaultBreakpoint = $.extend(true, {}, responsive)
						row.layout = defaultBreakpoint.layout
						row.background = defaultBreakpoint.background
						row.attribute = defaultBreakpoint.attribute

						// Set breakpoints
						row.responsive = {
							mini: $.extend(true, {}, responsive),
							small: $.extend(true, {}, responsive),
							medium: $.extend(true, {}, responsive),
							large: defaultBreakpoint,
							xlarge: $.extend(true, {}, responsive)
						}

						// Column properties
						let column = $.extend(true, {}, defaultProps)
						column.type = 'column'
						column.label = "Column"

						// Copy row properties into responsive breakpoints
						let columnResponsive = $.extend(true, {}, row)

						// Delete unnecessary properties after cloned 
						for (let i in dumpProps) delete column[dumpProps[i]];

						// Delete unnecessary cloned properties
						let dumpColumnProps = ['id', 'columns', 'type']
						for (let i in dumpRowProps) delete columnResponsive[dumpColumnProps[i]];

						// Define responsive breakpoints
						let defaultColumnBreakpoint = $.extend(true, {}, columnResponsive)
						column.layout = defaultColumnBreakpoint.layout
						column.background = defaultColumnBreakpoint.background
						column.attribute = defaultColumnBreakpoint.attribute

						// Set breakpoints
						column.responsive = {
							mini: $.extend(true, {}, columnResponsive),
							small: $.extend(true, {}, columnResponsive),
							medium: $.extend(true, {}, columnResponsive),
							large: defaultColumnBreakpoint,
							xlarge: $.extend(true, {}, columnResponsive)
						}


						/**
						* Make columns only 1 item if width is 1-1
						*/
						if (columns[0] === columns[1] && columns[0] < 5) {
							column.id = column.attribute.id.value = 'column-' + Date.now() + randomInt()
							row.columns.push($.extend(true, {
								width: [1, 1],
								items: []
							}, column))
						} else {
							for (let i in columns) {
								let columnIndex = columns[i];
								column.id = column.attribute.id.value = 'column-' + Date.now() + randomInt()
								row.columns.push($.extend(true, {
									width: [columnIndex, 10],
									items: []
								}, column))
							}
						}

						/**
						 * Drop row in the latest mouseenter action
						 */
						$('.dropable').each(function (i, el) {
							if (el.getAttribute('id') === self.droprow.getAttribute('id')) {
								index = i;
							}
						});

						/**
						 * We need to set timeout to prevent duplicate by vuejs
						 */
						setTimeout(function () {
							if (size > 0) {
								let rows = self.object('rows');
								if (rows.length === size) {
									rows.splice(index, 0, row)
									self.$set('rows', rows)
								}
							} else self.rows.$set(0, row)
						}, 10);
					}

					/**
					* Item dropable
					*/
					else {

					}

					// Finally, remove the source row
					source.remove();
				}

				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
			},
			ondragleave (event) {
				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
				self.droprow.classList.add('drop-enter');
			}
		};

		/* Structure Dropable */
		const structureDropable = Drag('[data-accept="structure"]').dropzone($.extend(true, {
			accept: '.draggable.structure'
		}, dropzone))

		/* Item Dropable */
		const itemDropable = Drag('[data-accept="item"]').dropzone($.extend(true, {
			accept: '.draggable.item'
		}, dropzone))

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
				self.$set('draggableMove', true)
			},
			onend (event) {
				document.body.classList.remove('overflow-hidden');
				event.target.remove();
				self.$set('draggableMove', false)
			}

		})
		.on('move', function (event) {
			let interaction = event.interaction;
			if (interaction.pointerIsDown && !interaction.interacting())
			{
				let original = event.currentTarget;
				let clone = original.cloneNode(true);
				clone.classList.add('moving')
				document.querySelector('#layout').appendChild(clone)

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