<template>
	<div class="screen-too-small" v-show="screenSize<951"></div>
	<div class="left-panel">
		<a @click="toggleElementPanel()" class="toggle-element-panel"><i class="uk-icon-plus"></i></a>
		<div class="blackout"></div>
		<div class="element-chooser-panel animated" v-show="showElementPanel" transition="slideleft">
			<div class="title">Add Elements <a class="uk-close" @click="toggleElementPanel()"></a></div>
			<div class="accordion-panel uk-accordion" data-uk-accordion>
				<accordion-item title="Grid">
					<element-item v-for="element in elements.grid" :data="element" :class="{'no-space-right': ($index + 1) % 3 === 0}"></element-item>
				</accordion-item>

				<accordion-item title="Component">
					<element-item v-for="element in elements.component" :data="element" :class="{'no-space-right': ($index + 1) % 3 === 0}"></element-item>
				</accordion-item>
			</div>
		</div>
	</div>

	<div class="center-panel">
		<div class="topbar-panel">
			<a @click="setScreenView('large')" :class="{active: isScreenView('large')}"><i class="uk-icon-laptop"></i></a>
			<a @click="setScreenView('medium')" :class="{active: isScreenView('medium')}"><i class="uk-icon-tablet"></i></a>
			<a @click="setScreenView('small')" :class="{active: isScreenView('small')}"><i class="uk-icon-mobile horizontal"></i></a>
			<a @click="setScreenView('mini')" :class="{active: isScreenView('mini')}"><i class="uk-icon-mobile"></i></a>
		</div>

		<div class="canvas-builder">
			<context-menu :menus="contextMenu.list" :position="contextMenu.position" :show="contextMenu.show"></context-menu>
			<div class="canvas-outline">
				<canvas class="canvas-all"></canvas>
				<canvas class="canvas-top"></canvas>
				<canvas class="canvas-right"></canvas>
				<canvas class="canvas-bottom"></canvas>
				<canvas class="canvas-left"></canvas>
			</div>
			<div class="tools" :style="layoutScroll" :class="breakPointClass">
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
									<a v-for="breadcrumb in outline.selected.breadcrumbs|limit 3"
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
			<iframe data-layout-viewer src="./viewer.html" :class="iframeClass"></iframe>
		</div>
	</div>

	<div class="right-panel" @mouseleave="clearCanvas()">
		<div class="right-panel-navbar">
			<a class="edit" @click="setRightBarView('edit')" :class="{active: isRightBarView('edit')}"></a><a @click="setRightBarView('settings')" class="settings" :class="{active: isRightBarView('settings')}"></a><a @click="setRightBarView('style')" class="style" :class="{active: isRightBarView('style')}"></a>
		</div>

		<div class="right-panel-container" v-show="isRightBarView('settings')" v-if="validProps()">
			<div class="pop-input-wrapper">
				<div class="pop-input-overlay" v-if="popInput.show" @click="hidePopInput()"></div>
				<div class="pop-input-inner">
					<div class="pop-input-up" v-if="popInput.show" :style="popInput.style" :class="[popInput.position]">
						<number :value.sync="popInputValue" :unit.sync="popInputUnit" :label="popInput.label" label-width="90px" :min="popInput.inputMin"></number>
						<div v-if="popInput.editBorder">
							<label>Border Style</label>
							<select v-model="popInputBorderStyle">
								<option value="solid">Solid</option>
								<option value="dotted">Dashed</option>
								<option value="dashed">Dashed</option>
							</select>

							<label>Border Color</label> <color-picker :colors.sync="popInputColor"></color-picker>
						</div>
						<button @click="hidePopInput()">OK</button>
					</div>
				</div>
			</div>

			<div class="accordion-panel uk-accordion" data-uk-accordion v-show="validProps()">
				<!-- properties.display -->
				<accordion-item title="Display" :with-switcher="false" switcher-label="Advanced">
					<accordion-item-view title="Display Settings">
						<div class="button-group">
							<rect-button
							:disabled="getProps('display.disabled')"
							:active="getProps('display.value', 'block')"
							@click="!getProps('display.disabled')? setProps('display.value', 'block'): null" 
							class="display-block"></rect-button>

							<rect-button 
							:disabled="getProps('display.disabled') || getProps('disableDisplayFlex')()"
							:active="getProps('display.value', 'flex')"
							@click="(!getProps('display.disabled') && !getProps('disableDisplayFlex')())? setProps('display.value', 'flex'): null"
							class="display-flex"></rect-button>

							<rect-button
							:disabled="getProps('display.disabled')"
							:active="getProps('display.value', 'none')"
							@click="!getProps('display.disabled')? setProps('display.value', 'none'): null"
							class="display-none"></rect-button>
						</div>
					</accordion-item-view>

					<accordion-expand-view v-show="getProps('display.value', 'flex') || getParentProps('display.value', 'flex')" v-if="validProps()">
						<accordion-item-view title="Flex Layout Settings" v-if="getProps('display.value', 'flex')">
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
								<label>
								<input type="checkbox"
								:true-value="'wrap'"
								:false-value="'nowrap'"
								v-model="layout.selected.properties[screenView].display.settings.flex.container.wrap"> Wrap Children
								</label>

								<label>
									<input type="checkbox"
									:true-value="true"
									:false-value="false"
									v-model="layout.selected.properties[screenView].display.settings.flex.container.reverse"> Reverse Layout
								</label>

								<label v-show="getProps('display.settings.flex.container.wrap', 'wrap')">
								<input type="checkbox"
								:true-value="true"
								:false-value="false"
								v-model="layout.selected.properties[screenView].display.settings.flex.container.reverseWrap"> Reverse Wrap
								</label>

								<div class="flex-wrap-buttons"
								v-show="getProps('display.settings.flex.container.wrap', 'wrap')"
								:class="{reverse: getProps('display.settings.flex.container.reverseWrap')}">

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

						<accordion-item-view title="Flex Child Settings" v-if="getParentProps('display.value', 'flex')" border="top" :border-if="getProps('display.value', 'flex')">
							<div class="flex-child-settings">
								<div class="label-group">
									<div>Sizing</div>
									<div>Align</div>
									<div>Order</div>
								</div>
								<div class="flex-child-buttons">
									<div class="flex">
										<rect-button class="shrink-if-needed"
										:active="getProps('display.settings.flex.item.sizing.value', 'flexShrink')"
										@click="setProps('display.settings.flex.item.sizing.value', 'flexShrink')"></rect-button>
										
										<rect-button class="fill-empty-space"
										:active="getProps('display.settings.flex.item.sizing.value', 'flexGrow')"
										@click="setProps('display.settings.flex.item.sizing.value', 'flexGrow')"></rect-button>
										
										<rect-button class="dont-shrink"
										:active="getProps('display.settings.flex.item.sizing.value', 'none')"
										@click="setProps('display.settings.flex.item.sizing.value', 'none')"></rect-button>

										<rect-button class="settings"
										:active="getProps('display.settings.flex.item.sizing.value', 'custom')"
										@click="setProps('display.settings.flex.item.sizing.value', 'custom')"></rect-button>
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
										:active="getProps('display.settings.flex.item.order.value', 'auto')"
										@click="setProps('display.settings.flex.item.order.value', 'auto')"></rect-button>

										<rect-button class="order-first"
										:active="getProps('display.settings.flex.item.order.value', 'first')"
										@click="setProps('display.settings.flex.item.order.value', 'first')"></rect-button>

										<rect-button class="order-last"
										:active="getProps('display.settings.flex.item.order.value', 'last')"
										@click="setProps('display.settings.flex.item.order.value', 'last')"></rect-button>

										<rect-button class="settings"
										:active="getProps('display.settings.flex.item.order.value', 'custom')"
										@click="setProps('display.settings.flex.item.order.value', 'custom')"></rect-button>
									</div>
								</div>
							</div>
						</accordion-item-view>
					</accordion-expand-view>
				</accordion-item>
				<!-- ./end of properties.display -->

				<!-- properties.position -->
				<accordion-item title="Position" :with-switcher="false" switcher-label="Advanced">
					<div class="prop-position-outline"
					@mouseover="propPositionOver($event)"
					@mouseleave="propPositionLeave($event)">
						<label>Position <a>{{getProps('position.value')}}</a></label>
						<dl>
							<dt class="top"
							@click="showPopInput($event, {
								position: 'bottom',
								label: 'Position Top',
								input: 'position.settings.' + getProps('position.value') + '.top',
								inputMin: -1000
							})">{{ unitValueOf('position.settings.' + getProps('position.value') + '.top') }}</dt>

							<dt class="right"
							@click="showPopInput($event, {
								position: 'bottom',
								label: 'Position Right',
								input: 'position.settings.' + getProps('position.value') + '.right',
								inputMin: -1000
							})">{{ unitValueOf('position.settings.' + getProps('position.value') + '.right', ' ') }}</dt>

							<dt class="bottom"
							@click="showPopInput($event, {
								position: 'bottom',
								label: 'Position Bottom',
								input: 'position.settings.' + getProps('position.value') + '.bottom',
								inputMin: -1000
							})">{{ unitValueOf('position.settings.' + getProps('position.value') + '.bottom') }}</dt>

							<dt class="left"
							@click="showPopInput($event, {
								position: 'bottom',
								label: 'Position Left',
								input: 'position.settings.' + getProps('position.value') + '.left',
								inputMin: -1000
							})">{{ unitValueOf('position.settings.' + getProps('position.value') + '.left', ' ') }}</dt>
						</dl>

						<div class="inner">
							<div class="prop-position-outline margin"
							@mouseover="propPositionOver($event)"
							@mouseleave="propPositionLeave($event)">
								<label>Margin</label>
								<dl>
									<dt class="top"
									@click="showPopInput($event, {
										position: 'top',
										label: 'Margin Top',
										input: 'marginTop',
										inputMin: -1000
									})">{{ unitValueOf('marginTop') }}</dt>

									<dt class="right"
									@click="showPopInput($event, {
										position: 'right',
										label: 'Margin Right',
										input: 'marginRight',
										inputMin: -1000
									})">{{ unitValueOf('marginRight', ' ') }}</dt>

									<dt class="bottom"
									@click="showPopInput($event, {
										position: 'bottom',
										label: 'Margin Bottom',
										input: 'marginBottom',
										inputMin: -1000
									})">{{ unitValueOf('marginBottom') }}</dt>

									<dt class="left"
									@click="showPopInput($event, {
										position: 'left',
										label: 'Margin Left',
										input: 'marginLeft',
										inputMin: -1000
									})">{{ unitValueOf('marginLeft', ' ') }}</dt>
								</dl>
								<div class="inner">
									<div class="prop-position-outline border"
									@mouseover="propPositionOver($event)"
									@mouseleave="propPositionLeave($event)">
										<label>Border</label>
										<dl>
											<dt class="top"
											@click="showPopInput($event, {
												position: 'top',
												label: 'Border Width',
												input: 'borderTop',
												editBorder: true,
												inputMin: 0
											})">{{ unitValueOf('borderTop') }}</dt>

											<dt class="right"
											@click="showPopInput($event, {
												position: 'right',
												label: 'Border Width',
												input: 'borderRight',
												editBorder: true,
												inputMin: 0
											})">{{ unitValueOf('borderRight', ' ') }}</dt>

											<dt class="bottom"
											@click="showPopInput($event, {
												position: 'bottom',
												label: 'Border Width',
												input: 'borderBottom',
												editBorder: true,
												inputMin: 0
											})">{{ unitValueOf('borderBottom') }}</dt>

											<dt class="left"
											@click="showPopInput($event, {
												position: 'left',
												label: 'Border Width',
												input: 'borderLeft',
												editBorder: true,
												inputMin: 0
											})">{{ unitValueOf('borderLeft', ' ') }}</dt>
										</dl>
										<div class="inner">
											<div class="prop-position-outline padding"
											@mouseover="propPositionOver($event)"
											@mouseleave="propPositionLeave($event)">
												<label>Padding</label>
												<dl>
													<dt class="top"
													@click="showPopInput($event, {
														position: 'top',
														label: 'Padding Top',
														input: 'paddingTop',
														inputMin: 0
													})">{{ unitValueOf('paddingTop') }}</dt>

													<dt class="right"
													@click="showPopInput($event, {
														position: 'top',
														label: 'Padding Right',
														input: 'paddingRight',
														inputMin: 0
													})">{{ unitValueOf('paddingRight', ' ') }}</dt>

													<dt class="bottom"
													@click="showPopInput($event, {
														position: 'top',
														label: 'Padding Bottom',
														input: 'paddingBottom',
														inputMin: 0
													})">{{ unitValueOf('paddingBottom') }}</dt>

													<dt class="left"
													@click="showPopInput($event, {
														position: 'top',
														label: 'Padding Left',
														input: 'paddingLeft',
														inputMin: 0
													})">{{ unitValueOf('paddingLeft', ' ') }}</dt>
												</dl>
											</div>
										</div>
									</div>
								</div>
							</div>							
						</div>
					</div>
				</accordion-item>
				<!-- ./end of properties.position -->

				<!-- properties.size -->
				<accordion-item title="Size" :with-switcher="true" :switcher.sync="tabAdvanced.size" switcher-label="Advanced">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-5-10">
							<number :value.sync="sizeWidth" :unit.sync="sizeWidthUnit" :disabled="properties.width.disabled" label="Width" :max="1000"></number>
							<number number :value.sync="sizeMinWidth" :unit.sync="sizeMinWidthUnit" :disabled="properties.minWidth.disabled" label="Min" v-show="tabAdvanced.size" transition="fade" :max="1000"></number>
							<number number :value.sync="sizeMaxWidth" :unit.sync="sizeMaxWidthUnit" :disabled="properties.maxWidth.disabled" label="Max" v-show="tabAdvanced.size" transition="fade" :max="1000"></number>
						</div>
						<div class="uk-width-5-10">
							<number :value.sync="sizeHeight" :unit.sync="sizeHeightUnit" label="Height" :max="1000"></number>
							<number number :value.sync="sizeMinHeight" :unit.sync="sizeMinHeightUnit" label="Min" v-show="tabAdvanced.size" transition="fade" :max="1000"></number>
							<number number :value.sync="sizeMaxHeight" :unit.sync="sizeMaxHeightUnit" label="Max" v-show="tabAdvanced.size" transition="fade" :max="1000"></number>
						</div>
					</div>
					<div style="padding-bottom: 100px"></div>
				</accordion-item>
				<!-- ./end of properties.size -->
			</div>
		</div>

		<div class="right-panel-container" v-show="isRightBarView('style')">
			<color-picker :colors.sync="colors"></color-picker>
		</div>
	</div>
</template>


<style lang="less">
@import '../../css/app.less';
</style>


<script>
// Modules
import dot from 'dot-object'
import _ from 'underscore'
import Mousetrap from '../../js/mousetrap.min.js'

// Import child components
import accordionItem from '../accordion/item.vue'
import accordionItemView from '../accordion/item-view.vue'
import accordionExpandView from '../accordion/expand-view.vue'

// Import misc component
import rectButton from '../misc/rect-button.vue'
import Number from '../misc/number.vue'
import contextMenu from '../misc/contextmenu.vue'

import colorPicker from '../colorpicker/colorpicker.vue'

// Import element Items
import elementItem from './element-item.vue'

export default {
	name: 'layout',

	/**
	 * Init Components
	 * @type {Object}
	 */
	components: {
		accordionItem, accordionItemView, accordionExpandView,
		elementItem, rectButton, Number, colorPicker, contextMenu
	},

	/**
	 * Custom Filters
	 * @type {Object}
	 */
	filters: {
		limit: function(arr, limit) {
			return arr.slice(0, limit)
		}
	},

	/**
	 * Unobuilder layout selector data
	 * @return {Object}
	 */
	data () {
		return {
			colors: {
				hex: '#194d33',
				hsl: {
					h: 150,
					s: 0.5,
					l: 0.2,
					a: 1
				},
				hsv: {
					h: 150,
					s: 0.66,
					v: 0.30,
					a: 1
				},
				rgba: {
					r: 25,
					g: 77,
					b: 51,
					a: 1
				},
				a: 1
			},

			layout: null,
			showElementPanel: false,
			screenView: 'large',
			screenSize: 0,
			rightBarView: 'settings',
			selectedProperties: null,
			tabAdvanced: {
				size: false
			},

			/* Elements Item */
			elements: {
				grid: [
					{label: '1 Columns', icon: 'column-1', type: 'grid', kind: 'column', size: 1, accept: 'section,container,column'},
					{label: '2 Columns', icon: 'column-2', type: 'grid', kind: 'column', size: 2, accept: 'section,container,column'},
					{label: '3 Columns', icon: 'column-3', type: 'grid', kind: 'column', size: 3, accept: 'section,container,column'},
					{label: '4 Columns', icon: 'column-4', type: 'grid', kind: 'column', size: 4, accept: 'section,container,column'},
					{label: '5 Columns', icon: 'column-5', type: 'grid', kind: 'column', size: 5, accept: 'section,container,column'},
					{label: '6 Columns', icon: 'column-6', type: 'grid', kind: 'column', size: 6, accept: 'section,container,column'}
				],

				component: _.extend(window.unocomponents, [])
			},

			/* Outline when element hovered / selected */
			outline: {
				hovered: {
					css: null,
					breadcrumbs: null
				},
				selected: {
					css: null,
					breadcrumbs: null,
					showBreadcrumbs: false,
					removeOver: false
				}
			},
			displayBlockPanel: false,
			layoutScroll: {},
			boundTop: 0,
			popInput: {
				show: false,
				position: 'top',
				label: '',
				value: 0,
				min: 0,
				unit: 'px'
			},

			/* Dragging Element Item */
			dragging: false,

			/* Context Menu */
			contextMenu: {
				list: [
					{label: 'Copy', shortcut: '&#8984;+c', click: this.contextFn('copy')},
					{label: 'Paste', shortcut: '&#8984;+v', click: this.contextFn('paste')},
					{label: 'Delete', shortcut: 'del', click: this.contextFn('delete'), over: this.contextFn('removeover', true), leave: this.contextFn('removeleave', true)},
					'-',
					{label: 'Copy Style', shortcut: '&#8984;+&#8679;+c', click: this.contextFn('copyStyle')},
					{label: 'Paste Style', shortcut: '&#8984;+&#8679;+c', click: this.contextFn('pasteStyle')},
					{label: 'Clear Style', shortcut: '&#8679;+del', click: this.contextFn('clearStyle')},
				],
				position: {},
				show: false
			},
		}
	},


	computed: {
		// Selected properties based on screen breakpoint
		properties: {
			get () {
				if (! this.validProps()) return
				return this.selectedProperties[this.screenView]
			}
		},

		// Outline class when hovered
		hoveredOutlineClass () {
			let cssClass = {}, outline = this.outline.hovered

			if (outline.breadcrumbs !== undefined) {
				cssClass.top = (outline.css.$top < 30)
				cssClass.body = (outline.breadcrumbs.length>0 && outline.breadcrumbs[0].label === 'body')
			}

			return cssClass
		},

		// Outline class when selected
		selectedOutlineClass () {
			let cssClass = {}, outline = this.outline.selected

			if (outline.breadcrumbs !== undefined) {
				cssClass.top = (outline.css.$top < 30)
				cssClass.body = (outline.breadcrumbs[0].label === 'body')
				cssClass.small = (outline.css.$width < 235)
				cssClass.view = outline.showBreadcrumbs
			}

			return cssClass
		},


		// When change breakpoints
		// Change the canvas class
		breakPointClass () {
			let cssClass = {}
			cssClass[this.screenView] = true
			return cssClass
		},


		// Iframe class
		iframeClass () {
			let cssClass = {'display-block-panel': this.displayBlockPanel, disable: this.dragging}
			cssClass[this.screenView] = true
			return cssClass
		},

		// Get outline canvas
		canvas () {
			let all = document.querySelector('.canvas-all'),
			top = document.querySelector('.canvas-top'),
			right = document.querySelector('.canvas-right'),
			bottom = document.querySelector('.canvas-bottom'),
			left = document.querySelector('.canvas-left')

			let canvas = {
				all: {element: all, context: all.getContext('2d')},
				top: {element: top, context: top.getContext('2d')},
				right: {element: right, context: right.getContext('2d')},
				bottom: {element: bottom, context: bottom.getContext('2d')},
				left: {element: left, context: left.getContext('2d')},
			}

			return canvas
		},

		// Unit value in popinput
		popInputValue: {
			get () {
				return this.getProps(`${this.popInput.input}.value`)
			},

			set (value) {
				value = parseInt(value)
				value = (isNaN(value))? '': value
				this.setProps(`${this.popInput.input}.value`, value)
			}
		},

		// Unit value in popinput
		popInputUnit: {
			get () {
				return this.getProps(`${this.popInput.input}.unit`)
			},

			set (value) {
				this.setProps(`${this.popInput.input}.unit`, value)
			}
		},

		// Color value in popinput
		popInputColor: {
			get () {
				return this.getProps(`${this.popInput.input}.color`)
			},

			set (value) {
				this.setProps(`${this.popInput.input}.color`, value)
			}
		},

		// Color value in popinput
		popInputBorderStyle: {
			get () {
				return this.getProps(`${this.popInput.input}.borderStyle`)
			},

			set (value) {
				this.setProps(`${this.popInput.input}.borderStyle`, value)
			}
		},


		/**
		 * Size (width/height) for sync properties value input number
		 */
		sizeWidth: {
			get () {
				return this.getProps(`width.value`)
			},

			set (value) {
				this.setProps(`width.value`, value)
			}
		},

		sizeWidthUnit: {
			get () {
				return this.getProps('width.unit')
			},

			set (value) {
				this.setProps('width.unit', value)
			}
		},

		sizeMinWidth: {
			get () {
				return this.getProps('minWidth.value')
			},

			set (value) {
				this.setProps('minWidth.value', value)
			}
		},

		sizeMinWidthUnit: {
			get () {
				return this.getProps('minWidth.unit')
			},

			set (value) {
				this.setProps('minWidth.unit', value)
			}
		},

		sizeMaxWidth: {
			get () {
				return this.getProps('maxWidth.value')
			},

			set (value) {
				this.setProps('maxWidth.value', value)
			}
		},

		sizeMaxWidthUnit: {
			get () {
				return this.getProps('maxWidth.unit')
			},

			set (value) {
				this.setProps('maxWidth.unit', value)
			}
		},

		sizeHeight: {
			get () {
				return this.getProps(`height.value`)
			},

			set (value) {
				this.setProps('height.value', value)
			}
		},

		sizeHeightUnit: {
			get () {
				return this.getProps('height.unit')
			},

			set (value) {
				this.setProps('height.unit', value)
			}
		},

		sizeMinHeight: {
			get () {
				return this.getProps('minHeight.value')
			},

			set (value) {
				this.setProps('minHeight.value', value)
			}
		},

		sizeMinHeightUnit: {
			get () {
				return this.getProps('minHeight.unit')
			},

			set (value) {
				this.setProps('minHeight.unit', value)
			}
		},

		sizeMaxHeight: {
			get () {
				return this.getProps('maxHeight.value')
			},

			set (value) {
				this.setProps('maxHeight.value', value)
			}
		},

		sizeMaxHeightUnit: {
			get () {
				return this.getProps('maxHeight.unit')
			},

			set (value) {
				this.setProps('maxHeight.unit', value)
			}
		},
	},


	methods: {
		/**
		 * Check is properties are ready or valid
		 * @return {Boolean}
		 */
		validProps () {
			return this.layout && this.layout.selected.properties
		},


		/**
		 * Get properties by dot notation
		 * @param  {String} dotNotation [dot notation]
		 * @param  {String} equals [comparison]
		 * @return {String|Number|Array|Object|Boolean}
		 */
		getProps (dotNotation, equals) {
			if (equals) return dot.pick(dotNotation, this.selectedProperties[this.screenView]) === equals
			return dot.pick(dotNotation, this.selectedProperties[this.screenView])
		},


		/**
		 * Get properties of parent by dot notation
		 * @param  {String} dotNotation [dot notation]
		 * @param  {String} equals [comparison]
		 * @return {String|Number|Array|Object|Boolean}
		 */
		getParentProps (dotNotation, equals) {
			if (this.selectedProperties[this.screenView].getParent) {
				if (equals) return dot.pick(dotNotation, this.selectedProperties[this.screenView].getParent()) === equals
				return dot.pick(dotNotation, this.selectedProperties[this.screenView].getParent())
			}
			
		},

		/**
		 * Set Properties to layout
		 * @param {String} prop  [description]
		 * @param {String|Number|Array|Object} value
		 */
		setProps (prop, value) {
			let self = this

			if (_.isArray(prop) && prop.length > 0) {
				// Change multiple data from array
				_.each(prop, function (item, index) {
					self.$nextTick(function () {
						dot.set(`${item.prop}`, item.value, self.layout.selected.properties[self.screenView])
					})
				})
			} else {
				// Single properties
				dot.set(`${prop}`, value, self.layout.selected.properties[self.screenView])
			}

			// Set selected properties after changed
			self.$nextTick(function () {
				self.$set('selectedProperties', self.layout.selected.properties)
			})
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
			this.layout.$emit('changeScreenView', breakpoint)
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
			this.hidePopInput()
			this.$emit('hideContextMenu')
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

			this.$emit('hideContextMenu')
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
		},


		/**
		 * Draw diagonal outline on canvas, with mask in center
		 * @param  {Object} canvas  Element and Context
		 * @param  {Object} mask Whether using mask or not
		 * @param  {Object|Boolean} position   Extends Position or Default position
		 * @return {void}
		 */
		drawDiagonalOutline (canvas, mask, position) {
			// Set style
			canvas.element.style.top = '0px'
			canvas.element.style.left = '0px'
			canvas.element.style.transform = `translate(${position.left}px, ${position.top}px)`
			canvas.element.style.width = `${position.width}px`
			canvas.element.style.height = `${position.height}px`

			// Set dimension
			canvas.element.width = position.width
			canvas.element.height = position.height

			// Clear canvas
			this.clearCanvas()

			// Sketching diagonal line
			canvas.context.strokeStyle = "#4a90e2"
			canvas.context.beginPath()
			for (var i = 1; i < position.width; i++) {
				canvas.context.moveTo(0, i * 5)
				canvas.context.lineTo(i * 5, 0)
			}

			// Draw!
			canvas.context.stroke();

			// Add mask
			if (mask) canvas.context.clearRect(mask.left, mask.top, mask.right, mask.bottom)
		},


		/**
		 * Clear canvas
		 * @return {void}
		 */
		clearCanvas () {
			// Clear all canvas
			_.each(this.canvas, function (item) {
				item.context.clearRect(0, 0, item.element.width, item.element.height)
			})
		},


		/**
		 * Draw diagonal outline for margin, padding, border, position
		 * @param  {String} type
		 * @return {void}
		 */
		drawDiagonalOutlineFor (type) {
			let self = this,
			canvasBuilder = document.querySelector('.canvas-builder').getBoundingClientRect(),
			layoutViewer = document.querySelector('[data-layout-viewer]').getBoundingClientRect(),
			canvas = self.canvas,
			css = self.outline.selected.css,
			position = {
				width: (! isNaN(css.$outerWidth))? css.$outerWidth: css.$width,
				height: (! isNaN(css.$outerHeight))? css.$outerHeight: css.$height,
				top: (! isNaN(css.$outerTop))? css.$outerTop: css.$top,
				left: (! isNaN(css.$outerLeft))? css.$outerLeft: css.$left
			}

			if (this.screenView !== 'large') {
				position.left += (canvasBuilder.width - layoutViewer.width) / 2
			}

			switch (type) {
				case 'padding':
					self.drawDiagonalOutline(canvas.all, {
						top: self.getProps('paddingTop.value'),
						right: css.$width - self.getProps('paddingRight.value') - self.getProps('paddingLeft.value') -  self.getProps('borderLeft.value') - self.getProps('borderRight.value'),
						bottom: css.$height - self.getProps('paddingBottom.value') - self.getProps('paddingTop.value') - self.getProps('borderTop.value') - self.getProps('borderBottom.value'),
						left: self.getProps('paddingLeft.value') + self.getProps('borderLeft.value')
					}, _.extend(position, {
						top: css.$top + self.boundTop + self.getProps('borderTop.value'),
						left: css.$left + ((canvasBuilder.width - layoutViewer.width) / 2),
						width: css.$width - self.getProps('borderLeft.value'),
						height: css.$height - self.getProps('borderTop.value') - self.getProps('borderBottom.value'),
					}))
					break;

				case 'margin':
					self.drawDiagonalOutline(canvas.all, {
						top: self.getProps('marginTop.value'),
						right: css.$width,
						bottom: css.$height,
						left: css.$left
					}, _.extend(position, {
						top: css.$outerTop + self.boundTop
					}))
					break;
			}
		},


		/**
		 * Position properties on mouse over
		 * @param  {Event} event
		 * @return {void}
		 */
		propPositionOver (event) {
			let target = event.target

			if (target.classList.contains('prop-position-outline')) {
				target.classList.add('over')
				target.parentElement.parentElement.classList.remove('over')

				if (target.classList.contains('padding')) {
					this.drawDiagonalOutlineFor('padding')
				} else if (target.classList.contains('margin')) {
					this.drawDiagonalOutlineFor('margin')
				} else {
					this.clearCanvas()
				}
			}
		},


		/**
		 * Position properties on mouse leave
		 * @param  {Event} event [description]
		 * @return {void}
		 */
		propPositionLeave (event) {
			let target = event.target
			if (target.classList.contains('prop-position-outline')) {
				target.classList.remove('over')
			}
		},


		/**
		 * Show unit value, like 10px, 1em, 100%
		 * 
		 * @param  {String} propName
		 * @param  {String} key
		 * @param  {String} delimiter
		 * @param  {Boolean} outputArray
		 * 
		 * @return {String|Object}
		 */
		unitValueOf (propName, delimiter, outputArray) {
			let prop = this.getProps(`${propName}`)
			if (!prop) return

			let value, unit
			delimiter = (!delimiter)? '': delimiter

			// Set output as array or object
			if (outputArray) return {value: prop.value, unit: prop.unit}
			return prop.value + delimiter + prop.unit
		},

		/**
		 * Show Pop Input
		 * @param  {Event} event
		 * @param  {Object} obj
		 * @return {void}
		 */
		showPopInput (event, obj) {
			let target = event.target,
			offset = $(target).offset(),
			input, style

			// Get position
			style = {top: `${offset.top-20}px`}

			// Show pop input
			this.$set('popInput', _.extend({
				show: true,
				style: style
			}, obj))
		},


		/**
		 * Hide pop input
		 * @return {void}
		 */
		hidePopInput () {
			this.$set('popInput.show', false)
		},


		/**
		 * Context function
		 * @param  {String} cmd
		 * @param  {Boolean} customEvent
		 * @return {void}
		 */
		contextFn (cmd, customEvent) {
			let self = this

			if (!customEvent) {
				return function () {
					self.layout.$emit('keyCapture', cmd)
					self.$set('contextMenu.show', false)
				}
			} else {
				switch (cmd) {
					case 'removeover':
						return function () {
							self.outlineRemoveOver()
						}
					break;

					case 'removeleave':
						return function () {
							self.outlineRemoveLeave()
						}
					break;
				}
			}
		}
	},

	ready () {
		let self = this

		/**
		 * Set viewer when layout viewer is ready
		 * 
		 * @param layout {Object}
		 * @return {void}
		 */
		self.$on('viewerReady', function (layout) {
			//self.$set('layout', layout)
			self.$set('layout', document.querySelector('[data-layout-viewer]').contentWindow.document.body.__vue__)
		})


		self.$on('selectedProperties', function (props) {
			self.$set('selectedProperties', props)
		})


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
			let canvasWidth = document.querySelector('.canvas-builder').getBoundingClientRect().width,
			layoutViewerWidth = document.querySelector('[data-layout-viewer]').getBoundingClientRect().width,
			gutter = canvasWidth - layoutViewerWidth
			self.layout.$emit('dragmove', coords, gutter)
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
		 * Hide popup input
		 * @return {void}
		 */
		self.$on('hidePopInput', function () {
			self.hidePopInput()
		})


		self.$on('drawDiagonalOutline', function (type) {
			self.drawDiagonalOutlineFor(type)
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
		 * @param  {Object} bodyRect  Scroll Value
		 * @return {void}
		 */
		self.$on('scroll', function (bodyRect) {
			self.$set('boundTop', bodyRect.top)
			self.$set('layoutScroll', {
				top: bodyRect.top + 'px'
			})
		})


		/**
		 * Clear Canvas
		 */
		self.$on('clearCanvas', self.clearCanvas)


		/**
		 * Window resize observer, since we can't using this app with screen < 950, warning will appear
		 * @return {void}
		 */
		const windowWidth = function () {
			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
		}

		self.$set('screenSize', windowWidth())
		window.addEventListener('resize', function () {
			self.$set('screenSize', windowWidth())
		}, true)



		/**
		 * Context Menu
		 */
		self.$on('showContextMenu', function (coords) {
			// Get gutter between canvas and iframe
			let canvasWidth = document.querySelector('.canvas-builder').getBoundingClientRect().width,
			layoutViewerWidth = document.querySelector('[data-layout-viewer]').getBoundingClientRect().width,
			gutter = canvasWidth - layoutViewerWidth

			// Get top and left position
			let left = coords.left + (gutter / 2),
			top = coords.top + self.boundTop

			// Set context menu position
			self.$set('contextMenu.position', {
				top: top + 'px',
				left: left + 'px'
			})

			// Show context menu
			self.$set('contextMenu.show', true)
		})

		// Hide context menu
		self.$on('hideContextMenu', function () {
			self.$set('contextMenu.show', false)
		})


		// Keyboard Event Binding using Mousetrap
		// Copy element
		Mousetrap.bind(['ctrl+c', 'command+c'], function () {
			self.layout.$emit('keyCapture', 'copy')
		})

		// Paste element
		Mousetrap.bind(['ctrl+v', 'command+v'], function () {
			self.layout.$emit('keyCapture', 'paste')
		})

		// Delete element
		Mousetrap.bind('del', function () {
			self.layout.$emit('keyCapture', 'delete')
		})

		// Copy element style
		Mousetrap.bind(['ctrl+shift+c', 'command+shift+c'], function () {
			self.layout.$emit('keyCapture', 'copyStyle')
		})

		// Paste element style
		Mousetrap.bind(['ctrl+shift+v', 'command+shift+v'], function () {
			self.layout.$emit('keyCapture', 'pasteStyle')
		})

		// Clear element style
		Mousetrap.bind(['ctrl+shift+del', 'command+shift+del'], function () {
			self.layout.$emit('keyCapture', 'clearStyle')
		})

		// Select using left and up
		Mousetrap.bind(['left', 'up'], function () {
			self.layout.$emit('keyCapture', 'selectUp')
		})

		// Select using right and down
		Mousetrap.bind(['right', 'down'], function () {
			self.layout.$emit('keyCapture', 'selectDown')
		})

		// Select childs using space
		Mousetrap.bind(['space', 'enter'], function () {
			self.layout.$emit('keyCapture', 'enter')
		})
	}
}
</script>