<template>
<div id="menu" class="animated" @mouseover="editProperties=true" @mouseleave="editProperties=false" v-show="showPanel" transition="slidex">
	<ul id="menu-tab" class="uk-tab uk-tab-grid" data-uk-switcher="{connect:'#tab'}" @click="viewing('tab')">
		<li v-for="tab in tabs" track-by="$index" :class="tabClass($index, tab, tabs)">
			<a>{{tab.label}}</a>
		</li>
	</ul>

	<ul id="tab" class="uk-switcher animated" v-show="isView('tab')">
		<li class="tab-content">
			<div class="source structures">
				<structure v-for="structure in structures" :width="structure"></structure>
			</div>
		</li>

		<li class="tab-content">
			<div class="source contents">
				<div class="uk-grid uk-grid-small" v-for="content in contents">
					<content-item v-for="item in content" width="1-3" :icon="item.icon" :type="item.type">{{item.label}}</content-item>
				</div>
			</div>
		</li>

		<li class="tab-content">
			Body properties
		</li>
	</ul>

	<div id="properties-view" v-show="isView('properties')" class="animated" transition="appear">
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="row" data-uk-tab data-uk-switcher="{connect: '#properties'}" :class="[propTabs.row.class]">
			<li class="uk-disabled uk-width-5-10"><a href="">{{propTabs.row.label}}</a></li>
			<li v-for="tab in propTabs.row.items" track-by="$index" data-index="{{$index}}" :class="tabClass($index, tab, propTabs.row)">
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
				<properties-flex :props="properties.flex" name="row" label="Flex Container" info="Insert Info Here"></properties-flex>
				<properties-expand :props="properties.expand" name="row" label="Expand to Full Width?"></properties-expand>
				<properties-layout :props="properties.layout" name="row"></properties-layout>
				<properties-attribute :props="properties.attribute" name="row" label="Attributes"></properties-attribute>
				<properties-background :props="properties.background" name="row" label="Background"></properties-background>
			</li>
			<li class="tab-content">
				
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
		<ul class="prop-tab uk-tab uk-tab-grid third" data-tab-id="responsive" data-uk-switcher="{connect: '#properties-blank'}" v-show="propTabs.column.current===3&&current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.responsive.label}} <info :text="propTabs.responsive.info"></info></li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsive.items" track-by="$index" data-breakpoint="{{tab.id}}" data-index="{{$index}}" :class="{'uk-active': tab.id === current.selected}">
				<a>{{tab.label}}</a>
			</li>
		</ul>
		<ul class="prop-tab uk-tab uk-tab-grid" data-tab-id="responsiveColumnProps" data-uk-switcher="{connect: '#column-properties'}" :class="[propTabs.responsiveColumnProps.class]" v-show="propTabs.column.current===3&&current.selectedColumn!==-1">
			<li class="uk-disabled">{{propTabs.responsiveColumnProps.label}}</li>
			<li class="uk-width-1-6" v-for="tab in propTabs.responsiveColumnProps.items" track-by="$index" data-index="{{$index}}" :class="{'uk-active': $index === propTabs.responsiveColumnProps.current}">
				<a>{{tab.label}}</a>
			</li>
		</ul>

		<ul id="column-properties-blank" class="uk-switcher"></ul>
		<!--<ul id="column-properties" class="properties-wrapper uk-switcher second" :class="activeColumnTabClass" v-show="current.selectedColumn!==-1">
			<li></li>
			<li class="tab-content">
				<properties-layout :props="columnProperties.layout" name="column"></properties-layout>
				<div class="title">Item Attributes</div>
				<properties-attribute :props="columnProperties.attribute" name="column"></properties-attribute>
				<div class="title">Item Animation</div>
				<properties-animation :props="columnProperties.animation" name="column"></properties-animation>
			</li>
			<li class="tab-content">
				<properties-flex :props="columnProperties.flex" name="column"></properties-flex>
			</li>
			<li class="tab-content">
				<properties-background :props="columnProperties.background" name="column"></properties-background>
			</li>
		</ul>-->
	</div>

	<div class="panel-buttons">
		<div class="uk-button-group">
			<button class="panel-button uk-button uk-width-1-{{panelButtons.length}}" v-for="button in panelButtons" @click="button.click()"><i :class="button.icon"></i> {{button.label}}</button>
		</div>
	</div>
</div>

<button class="unhide panel-button" @click="togglePanel()" v-show="!showPanel"><i class="expand-reverse"></i><i class="expand"></i></button>

<div id="layout-wrapper">
	<device :enable="device.enable" :style="device.style" :rotate="device.rotate">
		<div id="layout" class="uk-flex uk-flex-column" :class="{'on-sort': sortableIsMove}">
			<drop class="layout-dropable" accept="structure" position="relative" index="-1" style="order: -99999"></drop>
			<empty class="layout-column-item" v-if="empty(rows)" text="No structure here. Drag new from 'Structure' panel" style="margin-top:10px;order: -99999"></empty>
			<drop class="layout-dropable" accept="structure" position="relative" index="-1" v-if="empty(rows)" style="order: -99999"></drop>

			<div id="{{row.id}}" data-index="{{row.index}}" class="layout-item inspectable" v-for="row in rows | orderBy 'flexOrder()'" track-by="$index" :class="{'selected': row.id === current.row}" data-uk-grid-match>
				<div class="layout-wrap">
					<div class="layout-row" :style="style(row)">

						<div class="layout-columns uk-flex uk-grid-small uk-grid-match">
							<div class="layout-column uk-grid-match" v-for="column in row.columns" id="{{column.id}}" :class="columnWidth(column)">
								<drop class="layout-dropable" accept="item" position="left" :index="$index"></drop>
								<drop class="layout-dropable" accept="item" position="right" :index="$index"></drop>
								<drop class="layout-dropable" accept="item" position="top" :index="$index"></drop>

								<empty class="layout-column-item" v-if="empty(column.items)" :selected="current.column === column.id" :styles="style(column)"></empty>
								<div class="layout-column-item-wrapper" v-for="element in column.items" track-by="$index">
									<text v-if="element.elementType==='text'" class="layout-column-item" :data.sync="element" :selected="current.column === column.id" :styles="style(column)" @click="setProperties(element)"></text>
								</div>

								<drop class="layout-dropable" accept="item" position="bottom" :index="$index"></drop>
							</div>
						</div>

					</div>
				</div>

				<div class="layout-tool">
					<a @click="remove(row)" class="layout delete uk-icon-trash"></a>
					<a @click="duplicate($index, row)"  class="layout copy uk-icon-copy"></a>
					<a @click="setProperties(row)" class="layout settings uk-icon-gear"></a>
				</div>

				<div class="layout-label">{{row.label}}</div>
				<sortable-handler class="layout-sortable"></sortable-handler>
				<drop class="layout-dropable" accept="structure" :index="$index"></drop>
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
import Items from '../data/items.json'

/* Elements */
import Empty from './elements/empty.vue'
import Text from './elements/text.vue'

/* Draggable Items */
import contentItem from "./content-item.vue"
import Structure from "./structure.vue"

/* Properties */
import propertiesLayout from './properties/layout.vue'
import propertiesAttribute from './properties/attribute.vue'
import propertiesBackground from './properties/background.vue'
import propertiesAnimation from './properties/animation.vue'
import propertiesFlex from './properties/flex.vue'
import propertiesExpand from './properties/expand.vue'


/**
* Additional Components
*/

/* Dropable */
import Drop from './drop.vue'

/* Sortable Handler */
import sortableHandler from './sortable-handler.vue'

/* Info */
import Info from './info.vue'

/* Device */
import Device from './device.vue'


/* Additional Underscores Mixins */
_.mixin({
	move (array, fromIndex, toIndex) {
		array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
		return array;
	},

	insertAt (array, item, at) {
		if (_.isArray(array)) return false;
		if (at >= array.length) at = array.length
		array.splice(at, 0, item);
		return array;
	}
});


export default {
	name: 'Layout',
	components: {
		/* Dependencies components */
		contentItem, Structure, Drop, sortableHandler, Info, Device,

		/* Properties */
		propertiesLayout, propertiesAttribute, propertiesBackground, propertiesAnimation, propertiesFlex,
		propertiesExpand,

		/* Elements */
		Empty, Text
	},
	data() {
		let self = this

		return {
			dropElement: null,
			resizeData: '',
			showPanel: true,
			showPanelItems: true,
			fileOpener: null,
			fileDownloader: null,
			editProperties: false,
			sortable: null,
			sortableIsMove: false,
			draggable: null,
			draggableMove: false,
			body: {},
			rows: [],
			view: 'tab',

			structures: [['1-2', '1-2'], ['1-3', '1-3', '1-3'], ['1-4', '1-4', '1-4', '1-4'], ['1-5', '1-5', '1-5', '1-5', '1-5'], ['1-6', '1-6', '1-6', '1-6', '1-6', '1-6']],
			contents: [
				[{icon: 'font', label: 'Text', type: 'text'}, {icon: 'image', label: 'Image'}, {icon: 'hand-pointer-o', label: 'Button'}]
			],
			tabs: [
				{id: 'structure', label: 'Structure', grid: '2-6'},
				{id: 'content', label: 'Content', grid: '3-10'},
				{id: 'body', label: 'Body', grid: '2-10'},
				{id: 'css', label: 'CSS', grid: '1-6'}
			],
			panelButtons: [
				{id: 'hide', label: 'Hide', icon: 'expand', click: self.togglePanel},
				{id: 'load', label: 'Load', icon: 'load', click: self.loadFile},
				{id: 'toggle', label: 'Toggle', icon: 'collapse', click: self.togglePanelItems},
				{id: 'preview', label: 'Screen', toggle: ['Mobile', 'Tablet'], icon: 'screen'},
				{id: 'save', label: 'Save', icon: 'save', click: self.saveFile}
			],
			activeTabClass: '',
			activeColumnTabClass: '',
			propTabs: {
				row: {
					label: 'Container Properties',
					current: 0,
					class: 'first',
					items: [
						{id: 'layout', label: 'Layout', grid: '2-10'},
						{id: 'responsive', label: 'Responsive', grid: '3-10'}
						/*
						{id: 'flex', label: 'Flex'}
						{id: 'attribute', label: 'Attributes'},*/
						/*{id: 'bg', label: 'Background'},
						{id: 'responsive', label: 'Responsive'}*/
					]
				},

				columns: {
					label: 'Select Items to Edit',
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
					label: 'Item Properties',
					current: 0,
					class: 'second',
					items: [
						{id: 'layout', label: 'Layout'},
						/*{id: 'attribute', label: 'Attributes'},*/
						{id: 'flex', label: 'Flex'},
						{id: 'bg', label: 'Background'},
						/*{id: 'animation', label: 'Animation'},*/
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
					label: 'Container Properties',
					current: 0,
					class: 'third',
					items: [
						{id: 'layout', label: 'Layout'},
						/*{id: 'attribute', label: 'Attributes'},*/
						{id: 'flex', label: 'Flex'},
						{id: 'bg', label: 'Background'}
					]
				},

				responsiveColumnProps: {
					label: 'Item Properties',
					current: 0,
					class: 'fourth',
					items: [
						{id: 'layout', label: 'Layout'},
						/*{id: 'attribute', label: 'Attributes'},*/
						{id: 'flex', label: 'Flex'},
						{id: 'bg', label: 'Background'}
						/*{id: 'animation', label: 'Animation'}*/
					]
				},
			},
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
			}
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
		/* Button Pannels Functions */
		togglePanel () {
			this.$set('showPanel', !this.showPanel)
		},

		togglePanelItems () {
			let self = this

			$('[data-uk-accordion]').each(function (i, el) {
				let accordion = $(el).data().accordion

				if (accordion) {
					let wrapper = accordion.toggle.data('wrapper')
					wrapper.data('toggle').removeClass('uk-active')
					if (self.showPanelItems) wrapper.data('toggle').addClass('uk-active')
					accordion.toggleItem(wrapper, false, true);
				}
			})

			self.$set('showPanelItems', !self.showPanelItems)
		},

		loadFile () {
			this.fileOpener.click()
		},

		saveFile () {
			let self = this,
			output = JSON.stringify({
				generator: 'unobuilder',
				data: self.rows
			})

			let blob = new Blob([output], {type: 'octet/stream'}),
			url = window.URL.createObjectURL(blob)

			self.fileDownloader.href = url
			self.fileDownloader.download = self.$root.generateId('unobuilder') + '.layout'
			self.fileDownloader.click()
			
			window.setTimeout(function () {
				window.URL.revokeObjectURL(url)
			}, 10);
		},


		validProperties (isColumn) {
			if (isColumn) return this.current.selected && this.current.columnProperties.responsive !== undefined && this.current.columnProperties.responsive[this.current.selected]
			return this.current.selected && this.current.properties.responsive !== undefined && this.current.properties.responsive[this.current.selected]
		},

		object (name) {
			return JSON.parse(JSON.stringify(this[name]));
		},

		/* Show inspector when mouse over */
		inspect (e, hover) {
			let el = e.target, excludeTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'i', 'b', 'em', 'strong']
			if (el.classList.contains('layout-column-item') && !el.classList.contains('layout-column-item-child') || excludeTags.includes[el.tagName.toLowerCase()]) {
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
				let index = 0, column = item.columns[index]
				this.$set('current.properties', item)
				this.$set('current.columnProperties', column)
				this.$set('current.selectedColumn', index)
				this.$set('current.column', column.id)
				this.$set('current.row', item.id)
				this.$set('current.columnsSize', item.columns.length)
				this.$set('propTabs.columns.current', index)
			}
			else if (item.type === 'column') {
				this.$set('current.properties', parent)
				this.$set('current.columnProperties', item)
				this.$set('current.selectedColumn', index)
				this.$set('current.column', item.id)
				this.$set('current.row', parent.id)
				this.$set('current.columnsSize', parent.columns.length)
				this.$set('propTabs.columns.current', index)
			}
			else if (item.type === 'element') {
				console.log(item)
			}

			// View properties content, hide structure content
			this.viewing('properties');

			// Set Main Tab to Structure
			$('#menu-tab').data().switcher.show(0);

			// If screen is mini, small, medium, set properties tab to responsive
			if (['mini', 'small', 'medium'].includes(this.current.selected)) {
				$('[data-tab-id="row"]').data().switcher.show(4)
				$('[data-tab-id="column"]').data().switcher.show(4)
			} else {
				$('[data-tab-id="row"]').data().switcher.show(1)
			}
		},

		/* Render column width */
		columnWidth (column) {
			let gridClass = {}, responsive = column.responsive[this.current.selected].layout.grid.value
			gridClass['uk-width-'.concat(responsive[0], '-', responsive[1])] = true
			
			return gridClass
		},

		tabClass (index, tab, parent) {
			let newClass = {'uk-active': index === parent.current}
			newClass['uk-width-' + tab.grid] = true
			return newClass;
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

										if (prop === 'color' && style.rgba) style = 'rgba('.concat(style.rgba.join(','), ')')

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
			let self = this, newrow = $.extend(true, {}, row), newId = self.$root.generateId('el')
			newrow.id = newId

			_.map(newrow.responsive, function (breakpoint, index) {
				breakpoint.id = breakpoint.attribute.id.value = newId
				return breakpoint
			})
			_.map(newrow.columns, function (column, columnIndex) {
				column.id = self.$root.generateId('column')
				return column
			})
			this.rows.splice(index, 0, newrow)
		},

		draggableInit () {
			if (this.draggable) {
				this.draggable.unset()
				this.$set('draggable', null)
			}

			let self = this
			self.$nextTick(function () {
				let draggable = Drag('.draggable').draggable({
					manualStart: true,
					onmove (event) {
						let target = event.target,
						rect = target.getBoundingClientRect(),
						x = event.interaction.curCoords.page.x - event.target.offsetLeft,
						y = event.interaction.curCoords.page.y - event.target.offsetTop

						/* Set cursor to center */
						x = x - (rect.width/2)
						y = y - (rect.height/2)

						target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);

						// Hide Scrollbar
						document.body.classList.add('overflow-hidden')
					},
					onend (event) {
						document.body.classList.remove('overflow-hidden');
						event.target.remove();
						self.$set('draggableMove', false)
					}

				})
				.on('down', function (event) {
					event.preventDefault()
					self.$set('draggableMove', true)
				})
				.on('move', function (event) {
					let interaction = event.interaction

					if (interaction.pointerIsDown && !interaction.interacting()) {
						let original = event.currentTarget, clone = original.cloneNode(true)

						if (interaction.start && event.interactable && self.draggableMove) {
							clone.classList.add('moving')
							document.body.appendChild(clone)
							interaction.start({ name: 'drag' }, event.interactable, clone);
						} else {
							event.stopImmediatePropagation()
							return false;
						}
					}
				})

				// Register to vue
				self.$set('draggable', draggable)
			})
		},

		/* Sortabe, when breakpoints changes */
		sortableInit () {
			if (this.sortable) {
				this.sortable.destroy()
				this.$set('sortable', null)
			}

			let self = this
			self.$nextTick(function () {
				let sortable = new Sortable(document.querySelector('#layout'), {
					filter: '.dropable',
					handle: '.sortable-handler',
					ghostClass: 'sorting',
					chosenClass: 'sorting',
					onMove (e) {
						self.$set('sortableIsMove', true)
					},
					onEnd (e) {
						self.$set('draggableMove', false)
						if (self.rows) {
							let layoutItem = document.querySelectorAll('.layout-item'), i = 0;
							for (let item in layoutItem) {
								if (layoutItem[item] && layoutItem[item].getAttribute) {
									let index = parseInt(layoutItem[item].getAttribute('data-index'))

									if (! isNaN(index)) {
										self.rows[index].responsive[self.current.selected].flex.order.value = i
										if (self.current.selected === 'large') self.rows[index].flex.order.value = i

										i++
									}
								}
							}
							self.$set('sortableIsMove', false)
						}
					}
				})

				// Register to vue
				self.$set('sortable', sortable)
			})
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
		},

		findColumn (id) {
			let column

			_.each(this.rows, function (row, rowIndex) {
				_.each(row.columns, function (_column, columnIndex) {
					if (_column.id === id) column = {
						column: _column,
						index: columnIndex,
						parent: row,
						parentIndex: rowIndex
					}
				})
			})

			return column
		}
	},
	ready () {
		let self = this;

		/**
		 * Define properties for multiple purpose
		 * @type {Object}
		 */
		let defaultProps = {
			id: null,
			columns: [],
			type: 'row',
			flexOrder: function () {
				return this.responsive[self.current.selected].flex.order.value
			},
			layout: {
				grid: {
					label: 'Column Width',
					help: 'Column width help',
					enable: true,
					value: []
				},

				margin: {
					label: 'Margin',
					_: {type: 'inherit', unit: 'px', tb: true, tbValue: 10, all: false, allValue: 10},
					include: {t: true, b: true, l: true, r: true},
					styles: [10, 0, 10, 0]
				},
				padding: {
					label: 'Padding',
					_: {all: false, allValue: 10, unit: 'px'},
					styles: [10, 10, 10, 10]
				},
				border: {
					label: 'Border',
					_: {
						all: false,
						allValue: {
							width: 0,
							color: {hex: '#cccccc', rgba: [204, 204, 204, 1]},
							style: 'solid'
						},
						unit: 'px'
					},
					styles: {
						width: [0, 0, 0, 0],
						color: [
							{hex: '#cccccc', rgba: [255, 204, 204, 1]},
							{hex: '#cccccc', rgba: [204, 204, 204, 1]},
							{hex: '#cccccc', rgba: [204, 204, 204, 1]}, 
							{hex: '#cccccc', rgba: [204, 204, 204, 1]}
						],
						style: ['solid', 'solid', 'solid', 'solid']
					}
				}
			},
			expand: {
				label: 'Expand',
				value: true
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
			flex: {
				/* Item */
				order: {
					label: 'Order',
					value: 0
				},
				align: {
					label: 'Alignment',
					value: 'uk-flex-top'
				},
				direction: {
					label: 'Direction',
					value: ''
				},
				wrap: {
					label: 'Wrap',
					value: 'uk-flex-nowrap'
				},
				override: {
					help: 'Disable Column Width in Layout Properties',
					label: 'Flex Items Property',
					value: false
				},
				grow: {
					label: 'flex-grow',
					value: 0
				},
				shrink: {
					label: 'flex-shrink',
					value: 1
				},
				basis: {
					label: 'flex-basis',
					unit: '%',
					value: 0
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
					value: {hex: '#ffffff', rgba: [255,255,255,1]},
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

		/* Create file opener */
		let fileOpener = document.createElement('input');
		fileOpener.type = 'file'
		fileOpener.style.display = 'none'

		self.$set('fileOpener', fileOpener)
		self.fileOpener.onchange = function (e) {
			let files = self.fileOpener.files, file = files[0],
			fileReader = new FileReader()
			fileReader.addEventListener('load', function(event) {
				let text = event.target.result

				try {

					let layout = JSON.parse(text)
					if (layout.generator === 'unobuilder') {
						_.each(layout.data, function (row, index) {
							row.flexOrder = defaultProps.flexOrder
						})
						self.$set('rows', layout.data)
					}

				} catch (e) {
					MsgBox("Error", "Probably not a JSON file: " + e, "error")
				}

			}.bind(this))
			fileReader.readAsText(file)
		};
		document.body.appendChild(self.fileOpener)


		/* Create file downloader */
		let fileDownloader = document.createElement('a')
		fileDownloader.style = 'display: none'
		self.fileDownloader = fileDownloader
		document.body.appendChild(self.fileDownloader)


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
				if ((id === 'row' && index !== 3) || (id === 'column' && index !== 3)) {
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
				else if (((id === 'row' && index === 3) || (id === 'column' && index === 3)) || id === 'responsive') {
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
				else if (id === 'columns') {
					if (self.validProperties()) {
						self.setProperties(self.current.properties.columns[index], self.current.properties, index)
					}
				}
			}
		});


		/* On device enable re enable sortable */
		self.$watch('device.enable', function () {
			self.sortableInit();
		})


		/* Hide selected layout when onclick outside */
		self.$on('click', function (params) {
			let el = params.el
			if (! el.className.includes('settings') && ! self.editProperties) {
				self.viewing('tab')
			}
		})


		/* Watch cached */
		let oldVal = {
			marginrow: [],
			margincolumn: [],
			paddingrow: [],
			paddingcolumn: [],
			borderrow: [],
			bordercolumn: [],
			grid: [],
			backgroundrow: [],
			backgroundcolumn: [],
			css: [],
			flexrow: [],
			flexcolumn: []
		},
		breakpoints = {mini: {}, small: {}, medium: {}, large: {}, xlarge: {}};

		/* Watcher for margin $set all */
		let marginWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						// Cancel, if old margin has the same value with old value
						if (! oldVal['margin' + prop.itemType][prop.id]) oldVal['margin' + prop.itemType][prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal['margin' + prop.itemType][prop.id][prop.breakpoint])) return

						// Get actual margin
						let margin = null

						if (prop.itemType === 'row') {
							let row = _.findWhere(self.rows, {id: prop.id})
							if (row) margin = row.responsive[prop.breakpoint].layout.margin
						} else {
							_.each(self.rows, function (row) {
								_.each(row.columns, function (column) {
									if (column.id === prop.id) margin = column.responsive[prop.breakpoint].layout.margin
								})
							})
						}

						if (margin) {
							if (isNaN(prop.value)) prop.value = 0
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
								if (!prop.all) {
									for (let i in margin.styles) {
										margin.styles.$set(i, prop.value)
									}
								}
							}

							// Caching oldValue, vuejs doesn't support this, so I added it manually
							oldVal['margin' + prop.itemType][prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if ((item.type === 'row' && ! self.validProperties()) || item.type === 'column' && ! self.validProperties(true)) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {
					let margin = responsive.layout.margin
					return {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						topBottom: margin._.tb,
						tbValue: parseInt(margin._.tbValue),
						type: margin._.type,
						include: {t: margin.include.t, r: margin.include.r, b: margin.include.b, l: margin.include.l},
						all: margin._.all,
						value: parseInt(margin._.allValue)
					}
				})
			}
		}

		// Rows and Columns Margin Watcher
		self.$watch(function () { return self.rows.map(marginWatcher.map) }, marginWatcher.watcher, {deep: true})
		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(marginWatcher.map)
		})}, function (val) {
			_.each(val, marginWatcher.watcher)
		}, {deep: true})


		/* Watcher for padding $set all */
		let paddingWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						// Cancel, if old padding has the same value with old value
						if (! oldVal['padding' + prop.itemType][prop.id]) oldVal['padding' + prop.itemType][prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal['padding' + prop.itemType][prop.id][prop.breakpoint])) return

						// Get actual padding
						let padding = null
						if (prop.itemType === 'row') {
							let row = _.findWhere(self.rows, {id: prop.id})
							if (row) padding = row.responsive[prop.breakpoint].layout.padding
						} else {
							_.each(self.rows, function (row) {
								_.each(row.columns, function (column) {
									if (column.id === prop.id) padding = column.responsive[prop.breakpoint].layout.padding
								})
							})
						}

						if (padding) {
							if (isNaN(prop.value)) prop.value = 0
							if (!prop.all) {
								for (let i in padding.styles) {
									padding.styles.$set(i, prop.value)
								}
							}

							// Caching
							oldVal['padding' + prop.itemType][prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if (!self.validProperties()) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {
					let padding = responsive.layout.padding
					return {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						all: padding._.all,
						value: parseInt(padding._.allValue)
					}
				})
			}
		}

		// Rows and Column Padding
		self.$watch(function () { return self.rows.map(paddingWatcher.map) }, paddingWatcher.watcher, {deep: true})
		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(paddingWatcher.map)
		})}, function (val) {
			_.each(val, paddingWatcher.watcher)
		}, {deep: true})


		/* Watcher for border $set all */
		let borderWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						// Cancel, if old border has the same value with old value
						if (! oldVal['border' + prop.itemType][prop.id]) oldVal['border' + prop.itemType][prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal['border' + prop.itemType][prop.id][prop.breakpoint])) return

						// Get actual margin
						let border = null
						if (prop.itemType === 'row') {
							let row = _.findWhere(self.rows, {id: prop.id})
							if (row) border = row.responsive[prop.breakpoint].layout.border
						} else {
							_.each(self.rows, function (row) {
								_.each(row.columns, function (column) {
									if (column.id === prop.id) border = column.responsive[prop.breakpoint].layout.border
								})
							})
						}

						if (border) {
							if (isNaN(prop.width)) prop.width = 0
							if (!prop.all) {
								_.each(border.styles, function (values, propName) {
									_.each(values, function (item, index) {
										if (propName.includes('color')) {
											border.styles[propName].$set(index, {
												hex: prop.colorHex,
												rgba: prop.colorRGBA
											})
										} else {
											border.styles[propName].$set(index, prop[propName])
										}
									})
								})
							}

							// Caching
							oldVal['border' + prop.itemType][prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if (! self.validProperties()) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {
					let border = responsive.layout.border
					return {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						all: border._.all,
						style: border._.allValue.style,
						width: border._.allValue.width,
						colorHex: border._.allValue.color.hex,
						colorRGBA: border._.allValue.color.rgba
					}
				})
			}
		}

		// Rows and Columns Border Watcher
		self.$watch(function () { return self.rows.map(borderWatcher.map) }, borderWatcher.watcher, {deep: true})
		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(borderWatcher.map)
		})}, function (val) {
			_.each(val, borderWatcher.watcher)
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
		let bgWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						// Cancel, if old background has the same value with old value
						if (! oldVal['background' + prop.itemType][prop.id]) oldVal['background' + prop.itemType][prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal['background' + prop.itemType][prop.id][prop.breakpoint])) return


						let background = null
						if (prop.itemType === 'row') {
							let row = _.findWhere(self.rows, {id: prop.id})
							if (row) background = row.responsive[prop.breakpoint].background
						} else {
							_.each(self.rows, function (row) {
								_.each(row.columns, function (column) {
									if (column.id === prop.id) background = column.responsive[prop.breakpoint].background
								})
							})
						}

						if (background) {
							
							let styles = {}

							switch (prop.bgType) {
								case 'img':
								break;

								case 'color':
									if (prop.bgColor) styles.background = 'rgba('.concat(prop.bgColor.join(','), ')')
								break;
							}

							background.color.styles = styles

							// Caching
							oldVal['background' + prop.itemType][prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if (! self.validProperties()) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {
					let background = responsive.background

					return {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						bgType: background.type.value,
						bgColor: background.color.value.rgba,
						bgImage: background.image.value,
						bgVideo: background.video.value,
						bgStyle: background.video.style
					}
				})
			}
		}

		self.$watch(function () { return self.rows.map(bgWatcher.map) }, bgWatcher.watcher, {deep: true})
		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(bgWatcher.map)
		})}, function (val) {
			_.each(val, bgWatcher.watcher)
		}, {deep: true})



		/* Grid watcher */
		let gridWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						if (! oldVal.grid[prop.id]) oldVal.grid[prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal.grid[prop.id][prop.breakpoint])) return

						// Get actual padding
						let grid = null
						_.each(self.rows, function (row) {
							let column = _.findWhere(row.columns, {id: prop.id})
							if (column) grid = column.responsive[prop.breakpoint].layout.grid
						})

						if (grid) {
							grid.value = prop.value

							// Caching
							oldVal.grid[prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if (! self.validProperties()) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {
					let grid = responsive.layout.grid
					return {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						value: grid.value.map((n) => parseInt(n))
					}
				})
			}
		}

		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(gridWatcher.map)
		})}, function (val) {
			_.each(val, gridWatcher.watcher)
		}, {deep: true})



		/**
		* Flex watcher
		*/
		let flexWatcher = {
			watcher (val) {
				_.each(val, function (breakpoint, index) {
					_.each(breakpoint, function (prop, index) {
						if (! oldVal['flex' + prop.itemType][prop.id]) oldVal['flex' + prop.itemType][prop.id] = $.extend(true, {}, breakpoints)
						if (_.isEqual(prop, oldVal['flex' + prop.itemType][prop.id][prop.breakpoint])) return

						let flex, layout

						if (prop.itemType === 'row') {
							let row = _.findWhere(self.rows, {id: prop.id})
							if (row) flex = row.responsive[prop.breakpoint].flex
						} else {
							_.each(self.rows, function (row) {
								_.each(row.columns, function (column) {
									if (column.id === prop.id) {
										layout = column.responsive[prop.breakpoint].layout
										flex = column.responsive[prop.breakpoint].flex
									}
								})
							})
						}

						if (flex) {
							
							if (prop.itemType === 'column') {
								layout.grid.enable = !prop.override
							}

							// Caching oldValue, vuejs doesn't support this, so I added it manually
							oldVal['flex' + prop.itemType][prop.id][prop.breakpoint] = prop;
						}
					})
				})
			},

			map (item, index) {
				if ((item.type === 'row' && ! self.validProperties()) || item.type === 'column' && ! self.validProperties(true)) return {}
				return _.map(item.responsive, function (responsive, breakpoint) {

					let flex = responsive.flex,
					obj = {
						id: item.id,
						itemType: item.type,
						breakpoint: breakpoint,
						order: flex.order.value,
						override: flex.override.value,
						grow: flex.grow.value,
						shrink: flex.shrink.value
					}

					if (item.type === 'row') {
						return $.extend(true, {
							align: flex.align.value,
							direction: flex.direction.value,
							wrap: flex.wrap.value
						}, obj)
					}
					else if (item.type === 'column') {
						return obj
					}
				})
			}
		}

		// Rows and Columns Flex Watcher
		self.$watch(function () { return self.rows.map(flexWatcher.map) }, flexWatcher.watcher, {deep: true})
		self.$watch(function () { return self.rows.map(function (item) {
			return item.columns.map(flexWatcher.map)
		})}, function (val) {
			_.each(val, flexWatcher.watcher)
		}, {deep: true})


		/* Drop handler */
		let dropzone = {
			ondropactivate (event) {
				self.dropElement = null;
				$('.dropable').removeClass('drop-enter');
			},

			ondragenter (event) {
				$('.dropable').removeClass('drop-enter');
				self.dropElement = event.target;
				self.dropElement.classList.add('drop-enter');
			},

			ondragleave (event) {
				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
				self.dropElement.classList.add('drop-enter');
				//self.dropElement = null
			},

			sdf (event) {
				$('.dropable').removeClass('drop-enter');
				this.ondrop(event)
				//console.log('testa')
				//self.dropElement = null
			},
			ondropdeactivate (event) {
				if (self.dropElement) {
					let accepting = self.dropElement.getAttribute('data-accept'),
					source = event.relatedTarget

					/**
					 * Drop row in the latest mouseenter action
					 */
					let index = parseInt(self.dropElement.getAttribute('data-index')) + 1
					/*$('.dropable[data-accept="structure"]').each(function (i, el) {
						if (el.getAttribute('id') === self.dropElement.getAttribute('id')) {
							index = i;
						}
					});*/

					/* Column */
					let column = $.extend(true, {}, defaultProps)
					column.type = 'column'
					column.label = "Column"
					column.layout.margin._.allValue = 10
					column.layout.margin.styles = [10, 0, 10, 0]
					column.items = []

					let dumpColumnProps = ['layout', 'background', 'attribute', 'animation', 'columns'],
					dumpColumnPropsResponsive = ['id', 'columns', 'type'],
					dumpColumnPropsFlex = ['align', 'direction', 'wrap']


					/* Column generator */
					let generateColumn = function (options, callback) {
						let copyColumn = $.extend(true, {}, column)

						// Copy row properties into responsive breakpoints
						let columnResponsive = $.extend(true, {}, copyColumn)

						// Delete unnecessary properties after cloned
						for (let i in dumpColumnProps) delete copyColumn[dumpColumnProps[i]];

						// Delete unnecessary responsive properties
						for (let i in dumpColumnPropsResponsive) delete columnResponsive[dumpColumnPropsResponsive[i]];

						// Delete unnecessary flex properties
						for (let i in dumpColumnPropsFlex) delete columnResponsive.flex[dumpColumnPropsFlex[i]];

						// Define responsive breakpoints
						let defaultColumnBreakpoint = $.extend(true, {}, columnResponsive)
						copyColumn.layout = defaultColumnBreakpoint.layout
						copyColumn.background = defaultColumnBreakpoint.background
						copyColumn.attribute = defaultColumnBreakpoint.attribute

						// Set breakpoints
						copyColumn.responsive = {
							mini: $.extend(true, {}, columnResponsive),
							small: $.extend(true, {}, columnResponsive),
							medium: $.extend(true, {}, columnResponsive),
							large: defaultColumnBreakpoint,
							xlarge: $.extend(true, {}, columnResponsive)
						}

						// Set column and attr ID
						copyColumn.id = copyColumn.attribute.id.value = self.$root.generateId('column')

						// Set grid column width
						if (options.grid) {
							copyColumn.layout.grid.value = options.grid
							_.each(copyColumn.responsive, function (item, breakpoint) {
								item.layout.grid.value = options.grid
							})
						}

						// Push to rows element
						if (options.parent) options.parent.columns.push(copyColumn)

						// Callback
						callback && callback(copyColumn)
					}

					
					/**
					* Structure dropable
					*/
					if (accepting === 'structure') {
						let rowId = self.$root.generateId('el'),

						// Create Flex Columns
						columns = source.getAttribute('data-width').split(','),

						// rows Size
						size = self.rows.length;

						// Set current row id
						let row = $.extend(true, {}, defaultProps)
						row.id = row.attribute.id.value = rowId
						row.label = 'Structure'
						row.flex.order.value = index
						row.index = index

						// Copy row properties into responsive breakpoints
						let responsive = $.extend(true, {}, row)
						delete responsive.layout.grid

						/* Delete unnecessary properties after cloned */
						let dumpProps = ['layout', 'background', 'attribute', 'animation']
						for (let i in dumpProps) delete row[dumpProps[i]];

						// Delete unnecessary cloned properties
						let dumpRowProps = ['id', 'columns', 'type', 'animation']
						for (let i in dumpRowProps) delete responsive[dumpRowProps[i]];

						// Define responsive breakpoints
						let defaultBreakpoint = $.extend(true, {}, responsive)
						delete defaultBreakpoint.layout.grid
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


						/**
						* Get columns width and push columns to rows based on columns structure
						*/
						for (let i in columns) {
							let grid = columns[i].split('-');
							generateColumn({
								grid: grid,
								parent: row
							})
						}

						// Insert to layout
						if (size > 0) self.rows.splice(index, 0, row)
						else self.rows.$set(0, row)

						/* Reorder flex index */
						_.each(self.rows, function (_row, _index) {
							if (_index !== index) {
								_row.index = _index
							}
						})
					}

					/**
					* Item dropable
					*/
					else {
						let item = _.findWhere(Items, {elementType: source.getAttribute('type') }),
						dropPos = self.dropElement.getAttribute('data-position'),
						columnId = self.dropElement.parentElement.getAttribute('id'),
						search = self.findColumn(columnId)

						switch (dropPos) {
							case 'left':
							case 'right':
								if (search.parent.columns.length < 6) {
									generateColumn({
										grid: search.column.layout.grid.value
									}, function (column) {
										let index = (dropPos === 'right')? search.index + 1: search.index;
										index = (index < 0)? 0: index
										column.items.push($.extend(true, {}, item))
										search.parent.columns.splice(index, 0, column)
									})
								}
							break;
							case 'top':
							case 'bottom':
								search.column.items.push($.extend(true, {}, item))
							break;
						}
					}

					// Finally, remove the source row
					source.remove();
				}

				// Remove Active Class
				$('.dropable').removeClass('drop-enter');
				self.dropElement = null
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
		/* Prevent Text selection in major browser */
		Drag(document).on('down', function (e) {
			if (e.interaction.pointerWasMoved) {
				e.preventDefault();
			}
		});

		/* Our draggable */
		this.draggableInit()

		/* Sortable */
		this.sortableInit()
	}
}
</script>