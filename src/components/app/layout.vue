<template>
	<div class="left-panel">
		<a @click="toggleElementPanel()" class="toggle-element-panel"><i class="uk-icon-plus"></i></a>
		<div class="blackout"></div>
		<div class="element-chooser-panel animated" v-show="showElementPanel" transition="slideleft">
			<div class="title">Add Elements <a class="uk-close" @click="toggleElementPanel()"></a></div>
			<div class="accordion-panel uk-accordion" data-uk-accordion>
				<accordion-item title="Grid">
					<element-item v-for="element in elements.grid" :data="element"></element-item>
				</accordion-item>

				<accordion-item title="Component">
					<element-item v-for="element in elements.component" :data="element"></element-item>
				</accordion-item>
			</div>
		</div>
	</div>

	<div class="center-panel">
		<div class="topbar-panel">
			<a @click="setScreenView('large')" :class="{active: isScreenView('large')}"><i class="uk-icon-laptop"></i></a>
			<a @click="setScreenView('medium')" :class="{active: isScreenView('medium')}"><i class="uk-icon-tablet"></i></a>
			<a @click="setScreenView('small')" :class="{active: isScreenView('small')}"><i class="uk-icon-mobile"></i></a>
			<a @click="setScreenView('mini')" :class="{active: isScreenView('mini')}"><i class="uk-icon-mobile"></i></a>
		</div>

		<div class="canvas-builder">
			<div class="tools" :style="layoutScroll">
				<div class="outline-wrapper">
					<div class="outline-tools hovered" :style="outline.hovered.css">
						<div class="breadcrumbs hover" v-if="outline.hovered.breadcrumbs" :class="hoveredOutlineClass">
							<div class="selector" v-if="outline.hovered.breadcrumbs.length!==0">
								<a>{{outline.hovered.breadcrumbs[0].label}}</a>
							</div>
						</div>
					</div>
					<div class="outline-tools selected" :style="outline.selected.css" :class="{remove: outline.selected.removeOver}">
						<div class="breadcrumbs" v-if="outline.selected.breadcrumbs" :class="selectedOutlineClass">
							<div class="edit-tools">
								<div class="selector">
									<a v-for="breadcrumb in outline.selected.breadcrumbs"
									track-by="$index"
									:class="{active: $index===0||outline.selected.showBreadcrumbs}"
									@mouseover="showHoveredBreadcrumbs(breadcrumb,$index,true)"
									@mouseleave="showHoveredBreadcrumbs(breadcrumb,$index,false)"
									@click="showBreadcrumbsTree(breadcrumb,$index)">{{breadcrumb.label}}</a>
								</div>
								<a class="copy uk-icon-copy" @click="copy()"></a>
							</div>

							<a class="remove uk-icon-remove"
							@mouseover="outlineRemoveOver()"
							@mouseleave="outlineRemoveLeave()"
							@click="remove()"></a>
						</div>
					</div>
				</div>
			</div>
			<iframe data-layout-viewer src="viewer.html" :class="{'display-block-panel': displayBlockPanel, disable: dragging}"></iframe>
		</div>
	</div>

	<div class="right-panel">
		<div class="right-panel-navbar">
			<a class="edit" @click="setRightBarView('edit')" :class="{active: isRightBarView('edit')}"></a><a @click="setRightBarView('settings')" class="settings" :class="{active: isRightBarView('settings')}"></a><a @click="setRightBarView('style')" class="style" :class="{active: isRightBarView('style')}"></a>
		</div>

		<div class="right-panel-container" v-if="isRightBarView('edit')" v-if="validProps()">
			<!-- properties.display -->
			<div class="accordion-panel uk-accordion" data-uk-accordion v-show="validProps()">
				<accordion-item title="Position" :with-switcher="true" :switcher="true" switcher-label="Advanced">
					<accordion-item-view title="Display Settings">
						<div class="button-group">
							<rect-button :active="getProps('display.value', 'block')" @click="setProps('display.value', 'block')" class="display-block"></rect-button>
							<rect-button :active="getProps('display.value', 'flex')" @click="setProps('display.value', 'flex')" class="display-flex"></rect-button>
							<rect-button :active="getProps('display.value', 'none')" @click="setProps('display.value', 'none')" class="display-none"></rect-button>
						</div>
					</accordion-item-view>

					<accordion-expand-view v-show="getProps('display.value', 'flex')" v-if="validProps()">
						<accordion-item-view title="Flex Layout Settings" border="bottom">
							<div class="flex-layout">
								<div class="row-column">
									<rect-button
										:active="getProps('display.settings.flex.container.direction', 'row')"
										@click="setProps('display.settings.flex.container.direction', 'row')" class="flexrow"></rect-button>

									<rect-button
										:active="getProps('display.settings.flex.container.direction', 'column')"
										@click="setProps('display.settings.flex.container.direction', 'column')" class="flexcolumn"></rect-button>
								</div>
								<div class="vline"></div>
								<div class="column-buttons">
									<rect-button
										class="col-alignstart"
										:active="getProps('display.settings.flex.container.alignItems', 'flex-start')"
										@click="setProps('display.settings.flex.container.alignItems', 'flex-start')"></rect-button>
									<rect-button
										class="col-aligncenter"
										:active="getProps('display.settings.flex.container.alignItems', 'center')"
										@click="setProps('display.settings.flex.container.alignItems', 'center')"></rect-button>
									<rect-button
										class="col-alignend"
										:active="getProps('display.settings.flex.container.alignItems', 'flex-end')"
										@click="setProps('display.settings.flex.container.alignItems', 'flex-end')"></rect-button>
									<rect-button
										class="col-alignstretch"
										:active="getProps('display.settings.flex.container.alignItems', 'stretch')"
										@click="setProps('display.settings.flex.container.alignItems', 'stretch')"></rect-button>
									<rect-button
										class="col-alignbaseline"
										:active="getProps('display.settings.flex.container.alignItems', 'baseline')"
										@click="setProps('display.settings.flex.container.alignItems', 'baseline')"></rect-button>

									<rect-button
										class="col-justifystart"
										:active="getProps('display.settings.flex.container.justifyContent', 'flex-start')"
										@click="setProps('display.settings.flex.container.justifyContent', 'flex-start')"></rect-button>
									<rect-button
										class="col-justifycenter"
										:active="getProps('display.settings.flex.container.justifyContent', 'center')"
										@click="setProps('display.settings.flex.container.justifyContent', 'center')"></rect-button>
									<rect-button
										class="col-justifyend"
										:active="getProps('display.settings.flex.container.justifyContent', 'flex-end')"
										@click="setProps('display.settings.flex.container.justifyContent', 'flex-end')"></rect-button>
									<rect-button
										class="col-justify-space-between"
										:active="getProps('display.settings.flex.container.justifyContent', 'space-between')"
										@click="setProps('display.settings.flex.container.justifyContent', 'space-between')"></rect-button>
									<rect-button
										class="col-justify-space-around"
										:active="getProps('display.settings.flex.container.justifyContent', 'space-around')"
										@click="setProps('display.settings.flex.container.justifyContent', 'space-around')"></rect-button>
								</div>
							</div>

							<div class="flex-wrap-layout">
								<label><input type="checkbox" :true-value="'wrap'" :false-value="'nowrap'" v-model="properties.display.settings.flex.container.wrap"> Wrap Children</label>
								<label><input type="checkbox" :true-value="true" :false-value="false" v-model="properties.display.settings.flex.container._reverse"> Reverse Layout</label>
								<label v-show="getProps('display.settings.flex.container.wrap', 'wrap')"><input type="checkbox" :true-value="true" :false-value="false" v-model="properties.display.settings.flex.container._reverseWrap"> Reverse Wrap</label>

								<div class="flex-wrap-buttons" v-show="getProps('display.settings.flex.container.wrap', 'wrap')" :class="{reverse: getProps('display.settings.flex.container._reverseWrap')}">
									<rect-button
										class="align-columns-start"
										:active="getProps('display.settings.flex.container.alignContent', 'flex-start')"
										@click="setProps('display.settings.flex.container.alignContent', 'flex-start')"></rect-button>

									<rect-button
										class="align-columns-center"
										:active="getProps('display.settings.flex.container.alignContent', 'center')"
										@click="setProps('display.settings.flex.container.alignContent', 'center')"></rect-button>

									<rect-button
										class="align-columns-end"
										:active="getProps('display.settings.flex.container.alignContent', 'flex-end')"
										@click="setProps('display.settings.flex.container.alignContent', 'flex-end')"></rect-button>

									<rect-button
										class="align-columns-stretch"
										:active="getProps('display.settings.flex.container.alignContent', 'stretch')"
										@click="setProps('display.settings.flex.container.alignContent', 'stretch')"></rect-button>

									<rect-button
										class="align-columns-space-between"
										:active="getProps('display.settings.flex.container.alignContent', 'space-between')"
										@click="setProps('display.settings.flex.container.alignContent', 'space-between')"></rect-button>

									<rect-button
										class="align-columns-space-around"
										:active="getProps('display.settings.flex.container.alignContent', 'space-around')"
										@click="setProps('display.settings.flex.container.alignContent', 'space-around')"></rect-button>
								</div>
							</div>
						</accordion-item-view>

						<accordion-item-view title="Flex Child Settings">
							<div class="flex-child-settings">
								<div class="label-group">
									<div>Sizing</div>
									<div>Align</div>
									<div>Order</div>
								</div>
								<div class="flex-child-buttons">
									<div class="flex">
										<rect-button class="shrink-if-needed"
										:active="getProps('display.settings.flex.item.$sizing.value', 'flexShrink')"
										@click="setProps('display.settings.flex.item.$sizing.value', 'flexShrink')"></rect-button>
										
										<rect-button class="fill-empty-space"
										:active="getProps('display.settings.flex.item.$sizing.value', 'flexGrow')"
										@click="setProps('display.settings.flex.item.$sizing.value', 'flexGrow')"></rect-button>
										
										<rect-button class="dont-shrink"
										:active="getProps('display.settings.flex.item.$sizing.value', 'none')"
										@click="setProps('display.settings.flex.item.$sizing.value', 'none')"></rect-button>

										<rect-button class="settings"
										:active="getProps('display.settings.flex.item.$sizing.value', 'custom')"
										@click="setProps('display.settings.flex.item.$sizing.value', 'custom')"></rect-button>
									</div>
									<div class="flex">
										<rect-button class="align-self-start"
										:active="getProps('display.settings.flex.item.alignSelf', 'flex-start')"
										@click="setProps('display.settings.flex.item.alignSelf', 'flex-start')"></rect-button>

										<rect-button class="align-self-center"
										:active="getProps('display.settings.flex.item.alignSelf', 'center')"
										@click="setProps('display.settings.flex.item.alignSelf', 'center')"></rect-button>

										<rect-button class="align-self-end"
										:active="getProps('display.settings.flex.item.alignSelf', 'flex-end')"
										@click="setProps('display.settings.flex.item.alignSelf', 'flex-end')"></rect-button>

										<rect-button class="align-self-stretch"
										:active="getProps('display.settings.flex.item.alignSelf', 'stretch')"
										@click="setProps('display.settings.flex.item.alignSelf', 'stretch')"></rect-button>

										<rect-button class="align-self-baseline"
										:active="getProps('display.settings.flex.item.alignSelf', 'baseline')"
										@click="setProps('display.settings.flex.item.alignSelf', 'baseline')"></rect-button>
									</div>
									<div class="flex">
										<rect-button class="auto"
										:active="getProps('display.settings.flex.item.$order.value', 'auto')"
										@click="setProps('display.settings.flex.item.$order.value', 'auto')"></rect-button>

										<rect-button class="order-first"
										:active="getProps('display.settings.flex.item.$order.value', 'first')"
										@click="setProps('display.settings.flex.item.$order.value', 'first')"></rect-button>

										<rect-button class="order-last"
										:active="getProps('display.settings.flex.item.$order.value', 'last')"
										@click="setProps('display.settings.flex.item.$order.value', 'last')"></rect-button>

										<rect-button class="settings"
										:active="getProps('display.settings.flex.item.$order.value', 'custom')"
										@click="setProps('display.settings.flex.item.$order.value', 'custom')"></rect-button>
									</div>
								</div>
							</div>
						</accordion-item-view>
					</accordion-expand-view>
				</accordion-item>
			</div>
			<!-- ./end of properties.display -->
		</div>
	</div>
</template>


<style lang="less">
@import '../../css/app.less';
</style>


<script>
// Modules
import dot from 'dot-object'

// Import child components
import accordionItem from '../accordion/item.vue'
import accordionItemView from '../accordion/item-view.vue'
import accordionExpandView from '../accordion/expand-view.vue'

// Import misc component
import rectButton from '../misc/rect-button.vue'

// Import element Items
import elementItem from './element-item.vue'

export default {
	name: 'layout',

	components: {
		accordionItem, accordionItemView, accordionExpandView,
		elementItem, rectButton
	},

	data () {
		return {
			layout: null,
			showElementPanel: false,
			screenView: 'large',
			rightBarView: 'edit',

			/* Elements Item */
			elements: {
				grid: [
					{label: '1 Columns', icon: 'column-1', type: 'grid', kind: 'column', width: '1-1'},
					{label: '2 Columns', icon: 'column-2', type: 'grid', kind: 'column', width: '1-2,1-2'},
					{label: '3 Columns', icon: 'column-3', type: 'grid', kind: 'column', width: '2-6,2-6,2-6'},
					{label: '4 Columns', icon: 'column-4', type: 'grid', kind: 'column', width: '1-4'},
					{label: '5 Columns', icon: 'column-5', type: 'grid', kind: 'column', width: '1-5,1-5,1-5,1-5,1-5'},
					{label: '6 Columns', icon: 'column-6', type: 'grid', kind: 'column', width: '1-6,1-6,1-6,1-6,1-6,1-6'}
				],

				component: []
			},

			/* Outline when element hovered / selected */
			outline: {
				hovered: {
					css: null,
					breadcrumbs: null,
					boundTop: 0
				},
				selected: {
					css: null,
					breadcrumbs: null,
					showBreadcrumbs: false,
					boundTop: 0,
					properties: null,
					removeOver: false
				}
			},
			displayBlockPanel: false,
			layoutScroll: {},

			/* Dragging Element Item */
			dragging: false
		}
	},


	computed: {
		// Selected properties based on screen breakpoint
		properties: {
			get () {
				if (!this.validProps()) return
				return this.outline.selected.properties[this.screenView]
			}
		},

		// Outline class when hovered
		hoveredOutlineClass () {
			let cssClass = {}, outline = this.outline.hovered

			if (outline.breadcrumbs !== undefined) {
				cssClass.top = (outline.boundTop < 30)
				cssClass.body = (outline.breadcrumbs.length>0 && outline.breadcrumbs[0].label === 'body')
			}

			return cssClass
		},

		// Outline class when selected
		selectedOutlineClass () {
			let cssClass = {}, outline = this.outline.selected

			if (outline.breadcrumbs !== undefined) {
				cssClass.top = (outline.boundTop < 30)
				cssClass.body = (outline.breadcrumbs[0].label === 'body')
				cssClass.small = (outline.boundWidth < 235)
			}

			return cssClass
		}
	},


	methods: {
		/**
		 * Check is properties are ready or valid
		 * @return {Boolean}
		 */
		validProps () {
			return this.outline.selected.properties && this.outline.selected.properties[this.screenView]
		},


		/**
		 * Get properties by dot notation
		 * @param  {String} dotNotation [dot notation]
		 * @return {String|Number|Array|Object}
		 */
		getProps (dotNotation, equals) {
			let obj = dot.pick(dotNotation, this.properties)

			if (equals) return obj === equals
			return obj
		},


		/**
		 * Set Properties to layout
		 * @param {String} prop  [description]
		 * @param {String|Number|Array|Object} value
		 */
		setProps (prop, value) {
			this.layout.$emit('setProperties', this.screenView, prop, value)
		},


		/**
		 * Force hide element panel
		 * @return {void}
		 */
		hideElementPanel () {
			this.$set('showElementPanel', false)
		},


		/**
		 * Toggle Element Panel on the left
		 * 
		 * @return {void}
		 */
		toggleElementPanel () {
			this.$set('showElementPanel', !this.showElementPanel)
		},


		/**
		 * Set screen device view
		 * @param {String} breakpoint [Device Breakpoint]
		 */
		setScreenView (breakpoint) {
			this.$set('screenView', breakpoint)
		},


		/**
		 * Check current screen Device
		 * 
		 * @param  {String}
		 * @return {Boolean}
		 */
		isScreenView (breakpoint) {
			return this.screenView === breakpoint
		},


		/**
		 * Set Rightbar view
		 * 
		 * @param {String} view
		 */
		setRightBarView (view) {
			this.$set('rightBarView', view)
		},


		/**
		 * Check right bar panel current view
		 * @param  {String}  view
		 * @return {Boolean}
		 */
		isRightBarView (view) {
			return this.rightBarView === view
		},


		/**
		 * Show breadcrumbs full hierarchy
		 *
		 * @param  {Object} breadcrumb [Breadcrumb Data]
		 * @param  {Number} index [Current selected index]
		 * @param  {Boolean} enter [Whether it's mouseover state or leave state]
		 * @return {void}
		 */
		showHoveredBreadcrumbs (breadcrumb, index, enter) {
			if (this.outline.selected && index === 0) return
			this.layout.$emit('elementHover', breadcrumb, enter)
		},


		/**
		 * Show breadcrumbs full hierarchy
		 *
		 * @param  {Object} breadcrumb [Breadcrumb Data]
		 * @param  {Number} index [Current selected index]
		 * @return {void}
		 */
		showBreadcrumbsTree (breadcrumb, index) {
			if (this.outline.selected && index === 0) {
				this.$set('outline.selected.showBreadcrumbs', !this.outline.selected.showBreadcrumbs)
			} else {
				this.layout.$emit('elementSelect', breadcrumb)
			}
		},


		/**
		 * Selected outline on hover
		 * @return {void}
		 */
		outlineRemoveOver () {
			this.$set('outline.selected.removeOver', true)
		},


		/**
		 * Selected outline on mouseleave
		 * @return {void}
		 */
		outlineRemoveLeave () {
			this.$set('outline.selected.removeOver', false)
		},


		/**
		 * Copy Element
		 * @return {void}
		 */
		copy () {
			this.layout.$emit('manipulate', {
				id: this.outline.selected.id,
				action: 'copy'
			})
		},


		/**
		 * Remove Element
		 * @return {void}
		 */
		remove () {
			this.layout.$emit('manipulate', {
				id: this.outline.selected.id,
				action: 'remove'
			})
		}
	},

	ready () {
		let self = this


		/**
		 * When element item dragging itself
		 * @param {Boolean} drag [Whether in drag state or not]
		 * @return {void}
		 */
		self.$on('dragstart', function (drag, element) {
			// Notify to viewer
			self.$set('dragging', drag)
			self.layout.$emit('dragstart', drag, element)

			// If in dragging state, close left panel element
			if (drag) {
				setTimeout(function () {
					self.$set('showElementPanel', false)
				}, 350)
			}
		})

		/**
		 * When element move, notify viewer to update latest coords
		 * @param  {Object} coords
		 * @return {void}
		 */
		self.$on('dragmove', function (coords) {
			self.layout.$emit('dragmove', coords)
		})


		/**
		 * When element drag is ended, notify viewer to add element
		 * @param  {Object} data  [type and kind]
		 * @return {void}
		 */
		self.$on('dragend', function (data) {
			// Notify to viewer
			self.$set('dragging', false)
			self.layout.$emit('dragend', data)
		})


		/**
		 * Set viewer when layout viewer is ready
		 * 
		 * @param  {Object}
		 * @return {void}
		 */
		self.$on('viewerReady', function (obj) {
			self.layout = obj.App
		})


		/**
		 * Hide add element panel
		 * @return {void}
		 */
		self.$on('hideParentPanel', function () {
			self.$set('showElementPanel', false)
		})


		/**
		 * Display element outline when mouseover
		 * 
		 * @param  {Object} obj
		 * @return {void}
		 */
		self.$on('elementHover', function (obj) {
			self.$set('outline.hovered', obj)
		})


		/**
		 * Display element outline when selected
		 * @param  {Object} obj
		 * @return {void}
		 */
		self.$on('elementSelect', function (obj) {
			self.$set('outline.selected', obj)
		})

		/**
		 * Set zIndex of iframe when blockpanel Added
		 * @param  {Boolean} display
		 * @return {void}
		 */
		self.$on('displayBlockPanel', function (display) {
			self.$set('displayBlockPanel', display)
		})


		/**
		 * On viewer scrolling
		 * @param  {Number} value  Scroll Value
		 * @return {void}
		 */
		self.$on('scroll', function (value) {
			self.$set('layoutScroll', {
				top: value + 'px'
			})
		})
	}
}
</script>