<template>
	<div class="screen-too-small" v-show="screenSize<951"></div>
	<div class="left-panel">
		<div class="left-panel-buttons">
			<a @click="toggleElementPanel()" class="toggle-button" :class="{'active': !
			showCodeEditor}"><i class="uk-icon-plus"></i></a>
			<a @click="toggleCodeEditorPanel()" class="toggle-button" :class="{'active': showCodeEditor}"><i class="icon-code-editor"></i></a>
		</div>

		<div class="blackout"></div>
		<div class="element-chooser-panel animated" v-show="showElementPanel" transition="slideleft">
			<div class="title">Add Elements <a class="uk-close" @click="toggleElementPanel()"></a></div>
			<div class="search"><input type="text" v-model="searchElement" placeholder="Search Elements" class="input-text full"></div>
			<accordion-wrapper v-if="elements.component!==null">
				<accordion-item title="Grid">
					<element-item v-for="element in elements.grid|filterBy searchElement" :data="element" :class="{'no-space-right': ($index + 1) % 3 === 0}"></element-item>
				</accordion-item>

				<accordion-item :title="name" v-for="(name, components) in elements.component">
					<element-item v-for="element in components|filterBy searchElement" :data="element" :class="{'no-space-right': ($index + 1) % 3 === 0}"></element-item>
				</accordion-item>
			</accordion-wrapper>
		</div>
	</div>

	<div class="code-editor-panel" v-if="showCodeEditor">
		<div id="css-editor"></div>
	</div>

	<div class="center-panel">
		<div class="topbar-panel">
			<div>&nbsp;</div>
			<div class="screen-view">
				<a @click="setScreenView('large')" :class="{active: isScreenView('large')}"><i class="uk-icon-laptop"></i></a>
				<a @click="setScreenView('medium')" :class="{active: isScreenView('medium')}"><i class="uk-icon-tablet"></i></a>
				<a @click="setScreenView('small')" :class="{active: isScreenView('small')}"><i class="uk-icon-mobile horizontal"></i></a>
				<a @click="setScreenView('mini')" :class="{active: isScreenView('mini')}"><i class="uk-icon-mobile"></i></a>
			</div>
			<div class="save-view-rollback">
				<a class="button unre-do"><i class="uk-icon-mail-reply"></i></a>
				<a class="button unre-do"><i class="uk-icon-mail-forward"></i></a>
				<a class="button"><i class="uk-icon-eye"></i></a>
				<a class="button"><i class="uk-icon-save"></i> <span>Save</span></a>
			</div>
		</div>

		<div class="canvas-builder">
			<div class="canvas-outline">
				<canvas class="canvas-all"></canvas>
				<canvas class="canvas-top"></canvas>
				<canvas class="canvas-right"></canvas>
				<canvas class="canvas-bottom"></canvas>
				<canvas class="canvas-left"></canvas>
			</div>
			<div class="tools" :style="layoutScroll" :class="breakPointClass">
				<div class="outline-wrapper" v-if="!componentOnEdit">
					<div class="outline-tools hovered" :style="outline.hovered.css">
						<div class="breadcrumbs hover" v-if="outline.hovered.breadcrumbs" :class="hoveredOutlineClass">
							<div class="selector" v-if="outline.hovered.breadcrumbs.length!==0">
								<a>{{outline.hovered.breadcrumbs[0].label}}</a>
							</div>
						</div>
						<a class="add-block" @click="showBlockPanel()" v-if="outline.hovered.type === 'section'" :class="hoveredOutlineClass"></a>
					</div>
					<div class="outline-tools selected" :style="outline.selected.css" :class="{remove: outline.selected.removeOver}">
						<div class="breadcrumbs" v-if="outline.selected.breadcrumbs" :class="selectedOutlineClass">
							<div class="edit-tools">
								<div class="selector" @contextmenu="breadcrumbRightClick($event)">
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
						<a class="add-block" @click="showBlockPanel()"
						:class="selectedOutlineClass"  v-if="outline.selected.type === 'section' || (outline.selected.type === 'body' && outline.selected.childSize<1)"></a>
					</div>
				</div>

				<div class="canvas-block animated" v-if="block.panel" :style="block.css" transition="appear">
					<ul>
						<li v-for="block in block.items">
							<a @click="showBlock(block.id)" :class="{selected: isBlock(block.id)}">{{block.label}}</a>
						</li>
					</ul>

					<div class="block-items" v-for="block in block.items" v-show="isBlock(block.id)">
						<div v-for="blockItem in block.items" class="block-item only" :class="[blockItem.kind]" @click="addBlock(blockItem)"></div>
					</div>
				</div>

				<div class="canvas-contextmenu">
					<context-menu :menus="contextMenu.list" :position="contextMenu.position" :show="contextMenu.show"></context-menu>
				</div>

				<div class="canvas-editor">
					<editor :element.sync="editor.element" :window="editor.window" :style="editor.css" v-if="editor.element"></editor>
				</div>
			</div>
			<iframe data-layout-viewer src="./viewer.html" :class="iframeClass"></iframe>
		</div>
	</div>

	<div class="right-panel" @mouseleave="clearCanvas()">
		<div class="color-picker-popup" v-show="colorPickerShow">
			<color-picker :colors.sync="colorPickerValue" :popup="true" :ok="hideColorPicker"></color-picker>
		</div>

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

							<label>Border Color</label> <color-picker :colors.sync="popInputColor" :palette="false" :click="showColorPicker"></color-picker>
						</div>
						<button @click="hidePopInput()">OK</button>
					</div>
				</div>
			</div>

			<accordion-wrapper v-show="validProps()">
				<!-- properties.display -->
				<accordion-item title="Display" :with-switcher="true" switcher-label="Advanced" :switcher.sync="tabAdvanced.display">
					<accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<label class="uk-width-2-5 bold"><span>Select Type</span></label>
							<div class="uk-width-3-5">
								<div class="button-group right">
									<rect-button
									:disabled="getProps('display.disabled')"
									:active="getProps('display.value', 'block')"
									@click="!getProps('display.disabled')? setProps('display.value', 'block'): null"
									class="display-block"></rect-button>

									<rect-button
									:disabled="getProps('display.disabled') || getProps('disableDisplayFlex')()"
									:active="getProps('display.value', 'flex')"
									@click="(!getProps('display.disabled') && !getProps('disableDisplayFlex')())? setProps('display.value', 'flex'): null"
									v-show="tabAdvanced.display"
									class="display-flex"></rect-button>

									<rect-button
									:disabled="getProps('display.disabled')"
									:active="getProps('display.value', 'none')"
									@click="!getProps('display.disabled')? setProps('display.value', 'none'): null"
									class="display-none"></rect-button>
								</div>
							</div>
						</div>
					</accordion-item-view>

					<accordion-expand-view v-if="validProps() && ((getKind('section') || getKind('container') || getKind('column')) || (getProps('display.value', 'flex') || getParentProps('display.value', 'flex')))">

						<accordion-item-view  title="Flex Layout Settings" v-if="getProps('display.value', 'flex') && tabAdvanced.display">
							<div class="flex-layout">
								<div class="flex-row-column">
									<rect-button
										class="flex-row"
										:class="{'flex-row--reverse': getProps(
											'display.settings.flex.container.reverse')}"
										:active="getProps('display.settings.flex.container.direction', 'row')"
										@click="setProps('display.settings.flex.container.direction', 'row')"></rect-button>

									<rect-button
										class="flex-column"
										:class="{'flex-column--reverse': getProps(
											'display.settings.flex.container.reverse')}"
										:active="getProps('display.settings.flex.container.direction', 'column')"
										@click="setProps('display.settings.flex.container.direction', 'column')"></rect-button>
								</div>
								<div class="flex-buttons">
									<rect-button
										:class="flexBtnDirectionClass('justify', 'start')"
										:active="getProps('display.settings.flex.container.justifyContent', 'flex-start')"
										@click="setProps('display.settings.flex.container.justifyContent', 'flex-start')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('justify', 'center')"
										:active="getProps('display.settings.flex.container.justifyContent', 'center')"
										@click="setProps('display.settings.flex.container.justifyContent', 'center')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('justify', 'end')"
										:active="getProps('display.settings.flex.container.justifyContent', 'flex-end')"
										@click="setProps('display.settings.flex.container.justifyContent', 'flex-end')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('justify', 'space-between')"
										:active="getProps('display.settings.flex.container.justifyContent', 'space-between')"
										@click="setProps('display.settings.flex.container.justifyContent', 'space-between')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('justify', 'space-around')"
										:active="getProps('display.settings.flex.container.justifyContent', 'space-around')"
										@click="setProps('display.settings.flex.container.justifyContent', 'space-around')"></rect-button>

									<rect-button
										:class="flexBtnDirectionClass('align', 'start')"
										:active="getProps('display.settings.flex.container.alignItems', 'flex-start')"
										@click="setProps('display.settings.flex.container.alignItems', 'flex-start')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('align', 'center')"
										:active="getProps('display.settings.flex.container.alignItems', 'center')"
										@click="setProps('display.settings.flex.container.alignItems', 'center')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('align', 'end')"
										:active="getProps('display.settings.flex.container.alignItems', 'flex-end')"
										@click="setProps('display.settings.flex.container.alignItems', 'flex-end')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('align', 'stretch')"
										:active="getProps('display.settings.flex.container.alignItems', 'stretch')"
										@click="setProps('display.settings.flex.container.alignItems', 'stretch')"></rect-button>
									<rect-button
										:class="flexBtnDirectionClass('align', 'baseline')"
										:active="getProps('display.settings.flex.container.alignItems', 'baseline')"
										@click="setProps('display.settings.flex.container.alignItems', 'baseline')"></rect-button>
								</div>
								<div class="flex-reverse">
									<rect-button
										class="flex-reverse--row"
										v-if="getProps('display.settings.flex.container.direction', 'row')"
										:active="getProps('display.settings.flex.container.reverse')"
										@click="setProps(
											'display.settings.flex.container.reverse', !getProps('display.settings.flex.container.reverse')
										)"></rect-button>

									<rect-button
										class="flex-reverse--col"
										v-if="getProps('display.settings.flex.container.direction', 'column')"
										:active="getProps('display.settings.flex.container.reverse')"
										@click="setProps(
											'display.settings.flex.container.reverse', !getProps('display.settings.flex.container.reverse')
										)"></rect-button>
								</div>
							</div>

							<div class="flex-wrap-layout">
								<div class="flex-wrap">
									<rect-button
										class="flex-wrap"
										:class="flexBtnDirectionClass('wrap')"
										:active="getProps('display.settings.flex.container.wrap')"
										@click="setProps('display.settings.flex.container.wrap', !getProps('display.settings.flex.container.wrap'))"></rect-button>
								</div>

								<div class="flex-wrap-buttons" v-if="getProps('display.settings.flex.container.wrap')">
									<rect-button
										:class="flexBtnWrapClass('align', 'start')"
										:active="getProps('display.settings.flex.container.alignContent', 'flex-start')"
										@click="setProps('display.settings.flex.container.alignContent', 'flex-start')"></rect-button>

									<rect-button
										:class="flexBtnWrapClass('align', 'center')"
										:active="getProps('display.settings.flex.container.alignContent', 'center')"
										@click="setProps('display.settings.flex.container.alignContent', 'center')"></rect-button>

									<rect-button
										:class="flexBtnWrapClass('align', 'end')"
										:active="getProps('display.settings.flex.container.alignContent', 'flex-end')"
										@click="setProps('display.settings.flex.container.alignContent', 'flex-end')"></rect-button>

									<rect-button
										:class="flexBtnWrapClass('align', 'stretch')"
										:active="getProps('display.settings.flex.container.alignContent', 'stretch')"
										@click="setProps('display.settings.flex.container.alignContent', 'stretch')"></rect-button>

									<rect-button
										:class="flexBtnWrapClass('align', 'space-between')"
										:active="getProps('display.settings.flex.container.alignContent', 'space-between')"
										@click="setProps('display.settings.flex.container.alignContent', 'space-between')"></rect-button>

									<rect-button
										:class="flexBtnWrapClass('align', 'space-around')"
										:active="getProps('display.settings.flex.container.alignContent', 'space-around')"
										@click="setProps('display.settings.flex.container.alignContent', 'space-around')"></rect-button>
								</div>

								<div class="flex-reverse" v-if="getProps('display.settings.flex.container.wrap')">
									<rect-button
										class="flex-reverse--wrap-row"
										v-if="getProps('display.settings.flex.container.direction', 'row')"
										:active="getProps('display.settings.flex.container.reverseWrap')"
										@click="setProps(
											'display.settings.flex.container.reverseWrap', !getProps('display.settings.flex.container.reverseWrap')
										)"></rect-button>

									<rect-button
										class="flex-reverse--wrap-col"
										v-if="getProps('display.settings.flex.container.direction', 'column')"
										:active="getProps('display.settings.flex.container.reverseWrap')"
										@click="setProps(
											'display.settings.flex.container.reverseWrap', !getProps('display.settings.flex.container.reverseWrap')
										)"></rect-button>
								</div>
							</div>
						</accordion-item-view>

						<accordion-item-view title="Flex Child Settings" v-if="getParentProps('display.value', 'flex') && tabAdvanced.display" border="top" :border-if="getProps('display.value', 'flex')">
							<div class="flex-child-settings">
								<div class="label-group">
									<div>Sizing</div>
									<div>Align</div>
									<div>Order</div>
								</div>
								<div class="flex-child-buttons">
									<div class="flex">
										<rect-button class="flex-wrap"
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

						<accordion-item-view border="top" :border-if="getProps('display.value', 'flex')" v-if="getKind('section') || getKind('container') || getKind('column')">
							<label style="margin-right:5px">Grid gutter</label>
							<buttons :items="[{label: 'Large', active: getProps('gutter.value', 'large'), click: setGutter('large')},
								{label: 'Medium', active: getProps('gutter.value', 'medium'), click: setGutter('medium')},
								{label: 'Small', active: getProps('gutter.value', 'small'), click: setGutter('small')},
								{icon: 'close', active: getProps('gutter.value', 'collapse'), click: setGutter('collapse')}]"></buttons>
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
					<accordion-item-view>
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
					</accordion-item-view>
				</accordion-item>
				<!-- ./end of properties.size -->

				<!-- custom attributes and css -->
				<accordion-item title="Attributes">
					<accordion-item-view>
						<div class="uk-grid">
							<label class="uk-width-2-10">Class</label>
							<div class="uk-width-8-10">
								<input class="input-text uk-width-1-1" v-model="classValue" />
							</div>
						</div>

						<div class="uk-grid">
							<label class="uk-width-2-10">ID</label>
							<div class="uk-width-8-10">
								<input class="input-text uk-width-1-1" v-model="idValue" />
							</div>
						</div>
					</accordion-item-view>
				</accordion-item>
			</accordion-wrapper>
		</div>

		<div class="right-panel-container" v-show="isRightBarView('style')" v-if="validProps()">
			<accordion-wrapper>
				<accordion-item title="Typography" :with-switcher="true" switcher-label="Advanced" :switcher.sync="tabAdvanced.display">
					<accordion-item-view>
						<div class="uk-grid uk-grid-collapse">
							<div class="uk-width-1-10">
								<label class="icon"><i class="font-family"></i></label>
							</div>
							<div class="uk-width-9-10">
								<multiselect
								:multiple="false"
								:show-labels="false"
								:selected.sync="fontFamilyValue"
								:max-height="250"
								:options="fontFamilyList|orderBy 1"
								placeholder="Font Family"
								><span slot="noResult">No fonts have been found!</span></multiselect>
							</div>
						</div>
					</accordion-item-view>

					<accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon "><i class="font-weight"></i></label>
									</div>
									<div class="uk-width-7-10">
										<multiselect
										:multiple="false"
										:searchable="false"
										:show-labels="false"
										:selected.sync="layout.selected.properties[screenView].fontWeight.value"
										:max-height="250"
										:options="[100, 200, 300, 400, 500, 600, 700, 800]"
										placeholder="100"
										></multiselect>
									</div>
								</div>
							</div>

							<div class="uk-width-2-6">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="font-size"></i></label>
									</div>
									<div class="uk-width-7-10">
										<number :input-width="18" :value.sync="fontSize" :unit.sync="fontSizeUnit" :min="0" label=""></number>
									</div>
								</div>
							</div>
							<div class="uk-width-2-6">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="line-height"></i></label>
									</div>

									<div class="uk-width-7-10">
										<number :input-width="20" :value.sync="layout.selected.properties[screenView].lineHeight.value" :unit.sync="layout.selected.properties[screenView].lineHeight.unit" :min="0" label=""></number>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>

					<accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="font-color"></i></label>
									</div>
									<div class="uk-width-7-10">
										<color-picker :colors.sync="fontColor" :palette="false" :click="editFontColor"></color-picker>
									</div>
								</div>
							</div>


							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-small">
									<div class="uk-width-3-10">
										<label class="icon"><i class="font-style"></i></label>
									</div>
									<div class="uk-width-7-10">
										<buttons :items="[{icon: 'text-style-normal', active: getProps('fontStyle.value', 'normal'), click: setFontStyle('normal')}, {icon: 'text-style-italic', active: getProps('fontStyle.value', 'italic'), click: setFontStyle('italic')}]"></buttons>
									</div>
								</div>
							</div>

							<div class="uk-width-4-10">
								<div class="uk-grid uk-grid-small">
									<div class="uk-width-2-10">
										<label class="icon"><i class="text-decoration"></i></label>
									</div>
									<div class="uk-width-8-10">
										<buttons :items="[{icon: 'x', active: getProps('textDecoration.value', 'none'), click: setTextDecoration('none')}, {icon: 'text-decoration-underline', active: getProps('textDecoration.value', 'underline'), click: setTextDecoration('underline')}, {icon: 'text-decoration-strikethrough', active: getProps('textDecoration.value', 'line-through'), click: setTextDecoration('line-through')}]"></buttons>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>

					<accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-5-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-2-10">
										<label class="icon"><i class="text-align"></i></label>
									</div>
									<div class="uk-width-8-10">
										<buttons :items="[{icon: 'text-align-left', active: getProps('textAlign.value', 'left'), click: setTextAlign('left')}, {icon: 'text-align-center', active: getProps('textAlign.value', 'center'), click: setTextAlign('center')}, {icon: 'text-align-right', active: getProps('textAlign.value', 'right'), click: setTextAlign('right')}, {icon: 'text-align-justify', active: getProps('textAlign.value', 'justify'), click: setTextAlign('justify')}]"></buttons>
									</div>
								</div>
							</div>

							<div class="uk-width-4-10 uk-push-1-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="letter-spacing"></i></label>
									</div>
									<div class="uk-width-7-10">
										<number :input-width="20" :value.sync="layout.selected.properties[screenView].letterSpacing.value" :unit.sync="layout.selected.properties[screenView].letterSpacing.unit" :min="-100" label=""></number>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>
				</accordion-item>

				<accordion-item title="Background" :with-switcher="true" switcher-label="Advanced" :switcher.sync="tabAdvanced.display">
					<accordion-item-view>
						<div class="uk-grid uk-grid-collapse">
							<label class="uk-width-3-10 bold"><span>Select Type</span></label>
							<div class="uk-width-7-10 uk-flex">
								<div class="button-group right">
									<rect-button
									:disabled="getProps('background.disabled')"
									:active="getProps('background.value', 'none')"
									@click="!getProps('background.disabled')? setProps('background.value', 'none'): null"
									class="background-none"></rect-button>
									<rect-button
									:disabled="getProps('background.disabled')"
									:active="getProps('background.value', 'color')"
									@click="!getProps('background.disabled')? setProps('background.value', 'color'): null"
									class="background-color"></rect-button>
									<rect-button
									:disabled="getProps('background.disabled')"
									:active="getProps('background.value', 'image')"
									@click="!getProps('background.disabled')? setProps('background.value', 'image'): null"
									class="background-image"></rect-button>
									<rect-button
									:disabled="getProps('background.disabled')"
									:active="getProps('background.value', 'video')"
									@click="!getProps('background.disabled')? setProps('background.value', 'video'): null"
									class="background-video"></rect-button>
									<rect-button
									:disabled="getProps('background.disabled')"
									:active="getProps('background.value', 'gradient')"
									@click="!getProps('background.disabled')? setProps('background.value', 'gradient'): null"
									class="background-gradient"></rect-button>
								</div>
							</div>
						</div>
					</accordion-item-view>

					<accordion-expand-view v-if="!getProps('background.value', 'none')">
						<accordion-item-view v-if="getProps('background.value', 'color')">
							<color-picker :colors.sync="backgroundColorValue" :palette="true" :button="false"></color-picker>
						</accordion-item-view>
					</accordion-expand-view>
				</accordion-item>

				<accordion-item title="Animation" :with-switcher="true" switcher-label="Advanced" :switcher.sync="tabAdvanced.display">
				</accordion-item>
			</accordion-wrapper>
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
import Mousetrap from '../../js/lib/mousetrap.min.js'
import Multiselect from '../multiselect/index.js'
import helpers from '../../js/core/uno.helpers.js'

// Import child components
import accordionWrapper from '../accordion/wrapper.vue'
import accordionItem from '../accordion/item.vue'
import accordionItemView from '../accordion/item-view.vue'
import accordionExpandView from '../accordion/expand-view.vue'

// Import misc component
import rectButton from '../misc/rect-button.vue'
import buttons from '../misc/buttons.vue'
import Number from '../misc/number.vue'
import contextMenu from '../misc/contextmenu.vue'
import colorPicker from '../colorpicker/colorpicker.vue'
import editor from '../editor/editor.vue'

// Import element Items
import elementItem from './element-item.vue'

export default {
	name: 'layout',

	/**
	 * Init Components
	 * @type {Object}
	 */
	components: {
		accordionWrapper, accordionItem, accordionItemView, accordionExpandView,
		elementItem, rectButton, Number, colorPicker, contextMenu,
		Multiselect, buttons, editor
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
			layout: null,
			searchElement: '',
			editor: {
				css: null,
				element: null,
				window: null
			},
			showElementPanel: false,
			showCodeEditor: false,
			cssEditor: null,
			screenView: 'large',
			screenSize: 0,
			rightBarView: 'settings',
			selectedProperties: null,
			selectedElementKind: null,
			tabAdvanced: {
				display: true,
				size: false
			},

			/* Elements Item */
			components: _.extend(uno.component.list, []),
			componentOnEdit: false,
			elements: {
				grid: [
					{label: '1 Columns', class: 'column-1', type: 'grid', kind: 'column', size: 1, accept: 'section,container,column'},
					{label: '2 Columns', class: 'column-2', type: 'grid', kind: 'column', size: 2, accept: 'section,container,column'},
					{label: '3 Columns', class: 'column-3', type: 'grid', kind: 'column', size: 3, accept: 'section,container,column'},
					{label: '4 Columns', class: 'column-4', type: 'grid', kind: 'column', size: 4, accept: 'section,container,column'},
					{label: '5 Columns', class: 'column-5', type: 'grid', kind: 'column', size: 5, accept: 'section,container,column'},
					{label: '6 Columns', class: 'column-6', type: 'grid', kind: 'column', size: 6, accept: 'section,container,column'}
				],

				component: null
			},

			/* Blocks */
			block: {
				panel: false,
				latest: null,
				selected: 'structure',
				items: [
					{id: 'structure', label: 'Structure', items: [
						{type: 'section', kind: 'section', accept: 'body,section'},
						{type: 'section', kind: 'container', accept: 'section'}
					]},
					{id: 'headers', label: 'Headers'},
					{id: 'blog', label: 'Blog'},
					{id: 'features', label: 'Features'},
					{id: 'team', label: 'Team'},
					{id: 'gallery', label: 'Gallery'}
				]
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


			/**
			 * Color Picker Pop up
			 */
			colorPickerModel: null,
			colorPickerShow: false,

			/* Font family */
			fontFamilyList: helpers.NATIVE_FONTS
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

		idValue: {
			get () {
				return this.getProps('id')
			},
			set (value) {
				this.setProps('id', this.slugifyKlass(value))

				// Little hack to re select element
				if (this.layout) {
					setTimeout(() => this.layout.reselectElement(), 1)
				}
			}
		},

		classValue: {
			get () {
				return this.getProps('klass')
			},
			set (value) {
				this.setProps('klass', this.slugifyKlass(value))
				// Little hack to re select element
				if (this.layout) {
					setTimeout(() => this.layout.reselectElement(), 1)
				}
			}
		},

		colorPickerValue: {
			get () {
				return (this.colorPickerModel)? this.getProps(`${this.colorPickerModel}`): {
					hex: '#000000',
					hsl: {h: 0,	s: 0, l: 0,	a: 1},
					hsv: {h: 0,	s: 0, v: 0,	a: 1},
					rgba: {r: 0, g: 0, b: 0, a: 1},
					a: 1
				}
			},

			set (value) {
				if (this.colorPickerModel) this.setProps(`${this.colorPickerModel}`, value)
			}
		},

		// Font family
		fontFamilyValue: {
			get () {
				return this.getProps('fontFamily.value')
			},

			set (value) {
				this.setProps('fontFamily.value', value)
			}
		},

		// Color value in popinput
		fontColor: {
			get () {
				return this.getProps('fontColor')
			},

			set (value) {
				this.setProps('fontColor', value)
			}
		},

		fontSize: {
			get (value) {
				return this.getProps('fontSize.value')
			},

			set (value) {
				this.setProps('fontSize.value', value)
			}
		},

		fontSizeUnit: {
			get (value) {
				return this.getProps('fontSize.unit')
			},

			set (value) {
				this.setProps('fontSize.unit', value)
			}
		},

		backgroundColorValue: {
			get () {
				return this.getProps('background.settings.color')
			},

			set (value) {
				this.setProps('background.settings.color', value)
			}
		},
	},


	methods: {
		/**
		 * Get iframe viewer element
		 * @param {ElementNode} body
		 * @param {Boolean} doconly
		 * @return {ElementNode}
		 */
		getCanvasIframe (selector, doconly) {
			let iframe = document.querySelector('[data-layout-viewer]')
			if (selector) {
				let iframeDoc = iframe.contentWindow.document
				if (doconly) {
					return iframeDoc
				}

				return iframeDoc.querySelector(selector)
			}
			return iframe
		},


		/**
		 * Get canvas iframe properties
		 * @param  {String} property
		 * @return {String|Number|Object|Array}
		 */
		getCanvasSize (property) {
			let body = this.getCanvasIframe('body'),
			html = this.getCanvasIframe(null, true)

			switch (property) {
				case 'height':
					return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
				break

				case 'width':
					return this.getCanvasIframe().getBoundingClientRect().width
				break
			}
		},

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
		 * Get properties by dot notation
		 * @param  {String} equals [comparison]
		 * @return {String|Number|Array|Object|Boolean}
		 */
		getKind (equals) {
			if (equals) return this.selectedElementKind === equals
			return this.selectedElementKind
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
				self.$set('selectedElementKind', self.layout.selected.kind)
			})
		},

		/**
		 * Toggle Element Panel on the left
		 *
		 * @return {void}
		 */
		toggleElementPanel () {
			this.$set('showElementPanel', !this.showElementPanel)
			this.hideCodeEditorPanel()
		},

		/**
		 * Force hide element panel
		 * @return {void}
		 */
		hideElementPanel () {
			this.$set('showElementPanel', false)
		},

		/**
		 * Toggle code editor
		 */
		toggleCodeEditorPanel () {
			this.$set('showCodeEditor', !this.showCodeEditor)
			this.hideElementPanel()

			/**
			 * Setup editor
			 */
			if (this.showCodeEditor) {
				this.$nextTick(() => {
					let cssEditorElement = document.querySelector('#css-editor'),
					codeEditor = document.querySelector('.code-editor-panel')

					cssEditorElement.style.height = codeEditor.offsetHeight + 'px'

					if (this.cssEditor) {
						this.cssEditor.destroy()
					}
					ace.require('ace/ext/language_tools')
					this.cssEditor = ace.edit('css-editor')

					/**
					 * Save and get value
					 */
					if (this.layout) {
						this.cssEditor.setValue(this.layout.customCSS)
					}
					this.cssEditor.on('change', () => {
						let value = this.cssEditor.getValue()
						if (this.layout) {
							this.layout.$emit('saveCustomCSS', value)
						}
					})

					this.$blockScrolling = Infinity;
					this.cssEditor.session.setMode('ace/mode/css')
					this.cssEditor.setTheme('ace/theme/monokai')
					this.cssEditor.setOptions({
						enableBasicAutocompletion: true,
						enableSnippets: true,
						enableLiveAutocompletion: true,
						showPrintMargin: false
					})
				})
			} else {
				if (this.cssEditor) {
					this.cssEditor.destroy()
				}
			}
		},

		/**
		 * Force hide code editor
		 */
		hideCodeEditorPanel () {
			this.$set('showCodeEditor', false)
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


		breadcrumbRightClick (event) {
			event.preventDefault()

			let canvasWidth = document.querySelector('.canvas-builder').getBoundingClientRect().width,
			layoutViewerWidth = this.getCanvasIframe().getBoundingClientRect().width,
			gutter = canvasWidth - layoutViewerWidth

			// Get top and left position
			this.$emit('showContextMenu', {
				top: event.pageY - this.boundTop - 35,
				left: event.pageX - (gutter / 2) - 35
			})
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
			this.$emit('disableEditor')
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
			layoutViewer = self.getCanvasIframe().getBoundingClientRect(),
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

			// Set color model
			if (obj.editBorder) {
				this.$set('colorPickerModel', obj.input + '.color')
			}
		},


		/**
		 * Hide pop input
		 * @return {void}
		 */
		hidePopInput () {
			this.$set('popInput.show', false)
		},


		showColorPicker () {
			this.$set('colorPickerShow', true)
		},

		hideColorPicker () {
			this.$set('colorPickerShow', false)
		},

		editFontColor () {
			this.$set('colorPickerModel', 'fontColor')
			this.showColorPicker()
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
		},

		/**
		 * Get component data
		 * @param  {Object} component
		 * @return {Object}
		 */
		getComponentData (component) {
			let self = this,
			validSettings = (!_.isArray(component.data.settings) && _.isObject(component.data.settings))

			let data = {
				// Value getter
				get view () {
					return component.data.view
				},

				// Value setter
				set view (value) {
					component.data.view = value

					// Fire onchange component
					self.componentFire(component, 'onchange', 'data.value', value)
				},

				// Settings can't use setter & getter method
				// We define it as object with method get & set
				// So we can easily pick setings with dot notation
				settings: {
					get: function (key) {
						if (key.indexOf('.')<0) key += '.value'
						return dot.pick(key, component.data.settings)
					},

					set: function (key, value) {
						if (validSettings && key.indexOf('.')>-1) {
							dot.set(key, value, component.data.settings)
						}
					}
				},

				// Evaluate javascript
				// Inside component.js register
				get $eval () {
					return function (fn) {
						var params = uno.utils.getParams(fn)
						uno.viewer.$emit('evalFunction', component.id, component.uid, fn, params)
					}
				},

				// Prevent someone to set eval
				set $eval (value) {
					return
				}
			}

			return _.extend(data, component.events.data)
		},


		/**
		 * Fire component events
		 * @param  {Object} component
		 * @param  {String} eventType
		 * @param  {Array|Object|String|Number} args
		 * @return {void}
		 */
		componentFire () {
			let self = this,
			component = arguments[0],
			eventType = arguments[1],
			data = this.getComponentData(component)

			if (eventType === 'ready') {
				var model = arguments[2],
				dataView = model.data.view,
				settings = model.data.settings

				// Redefine getter and setter for template data binding with vuejs
				_.each(model.data.tpl_data, function (tpl_data, key) {
					let dataKey = model.data.tpl_data[key]
					Object.defineProperty(data, key, {
						set: function (value) {
							if (value !== dataKey) {
								// Change if new data isn't the same with old data
								model.$set('data.tpl_data.' + key, value)

								// Fire on change
								self.componentFire(component, 'onchange', key, value, dataKey)
							}
						},
						get: function (value) {
							return dataKey
						}
					})
				})

				// Redefine getter and setter for view binding with vuejs
				Object.defineProperty(data, 'view', {
					set: function (value) {
						if (value !== dataView) {
							// Change if new data isn't the same with old data
							model.$set('data.view', value)

							// Fire on change
							self.componentFire(component, 'onchange', 'view', value, dataView)
						}
					},

					get: function () {
						return dataView
					}
				})

				// Redefine settings bind with vuejs
				Object.defineProperty(data, 'settings', {
					value: {
						set: function (key, value) {
							if (key.indexOf('.')>-1) {
								dot.set(key, value, settings)
							}
						},

						get: function (key) {
							if (key.indexOf('.')<0) key += '.value'
							return dot.pick(key, settings)
						},
					}
				})
			}

			// Get arguments remain
			let args = []
			for (let i = 0; i < arguments.length; i++) {
				if (i>1) args.push(arguments[i])
			}

			// Fire event
			component.events[eventType] && component.events[eventType].apply(data, args)
		},


		/**
		 * Fire all events on component
		 * @param  {String} eventType
		 * @param  {Array|Object|String|Number} args
		 * @return {void}
		 */
		componentsFire (eventType, args) {
			let self = this
			_.each(this.components, function (component, index) {
				self.componentFire(component, eventType, args)
			})
		},


		/**
		 * Toggle block panel
		 * @return {void}
		 */
		showBlockPanel () {
			let hoveredBreadcrumb = _.first(this.outline.hovered.breadcrumbs)
			this.layout.$emit('elementSelect', hoveredBreadcrumb)
			this.$set('block.panel', !this.block.panel)
		},

		/**
		 * Select blok tab
		 * @param  {String} id
		 */
		showBlock (id) {
			this.$set('block.selected', id)
		},

		/**
		 * Check whether block is selected or not
		 * @param  {String}  id
		 * @return {Boolean}
		 */
		isBlock (id) {
			return this.block.selected === id
		},

		/**
		 * Add block element to viewer
		 * @param {Object} block
		 */
		addBlock (block) {
			if (this.layout) {
				this.layout.$emit('addBlock', _.extend(block, {
					to: 'body',
					child: false,
					breadcrumb: block.kind,
					index: this.outline.selected.index
				}))
			}
		},

		/**
		 * Set gutter for selected element (only for section, container, column)
		 * @param {String} size
		 */
		setGutter (size) {
			if (this.getKind('section') || this.getKind('container') || this.getKind('column')) {
				return () => this.setProps('gutter.value', size)
			}

			return
		},

		/**
		 * Set font-style properties in curry function
		 * @param {String} style
		 * @return {Function}
		 */
		setFontStyle (style) {
			return () => this.setProps('fontStyle.value', style)
		},

		/**
		 * Set text-align properties in curry function
		 * @param {String} style
		 * @return {Function}
		 */
		setTextAlign (align) {
			return () => this.setProps('textAlign.value', align)
		},

		/**
		 * Set text-align properties in curry function
		 * @param {String} style
		 * @return {Function}
		 */
		setTextDecoration (align) {
			return () => this.setProps('textDecoration.value', align)
		},

		/**
		 * Reposition block panel based on element position
		 * @param  {Object}
		 * @return {void}
		 */
		blockPanelReposition (obj) {
			let blockPosition = 0

			if (obj.type !== 'body') {
				let outerHeight = obj.css.$top + obj.css.$height,
				viewerHeight = this.getCanvasSize('height')

				// If element is in bottom, set position above element
				if (viewerHeight - outerHeight < 175) {
					blockPosition = outerHeight - (obj.css.$height + 175)
				} else {
					// If element is on top set position over element
					if (obj.css.$top > 20) {
						blockPosition = obj.css.$top
					} else {
						blockPosition = outerHeight
					}
				}
			}

			this.$set('block.css', {
				top: blockPosition + 'px'
			})
		},


		/**
		 * Generate flex buttons class for flex-direction
		 * @param  {String} prefix
		 * @param  {String} suffix
		 * @return {Object}
		 */
		flexBtnDirectionClass (prefix, suffix) {
			let direction = 'row', klass = {}
			if (!this.getProps('display.settings.flex.container.direction', 'row')) {
				direction = 'col'
			}

			if (suffix) {
				suffix = '--' + suffix
			} else {
				suffix = ''
			}

			if (this.getProps('display.settings.flex.container.reverse')) {
				suffix += '-reverse'
			}

			klass[direction + '-' + prefix + suffix] = true
			return klass
		},

		/**
		 * Generate flex buttons class for flex-wrap and align-items
		 * @param  {String} prefix
		 * @param  {String} suffix
		 * @return {Object}
		 */
		flexBtnWrapClass (prefix, suffix) {
			let klass = {},
			direction = this.getProps('display.settings.flex.container.direction')

			if (prefix) {
				prefix = '--' + prefix
			}

			if (suffix) {
				suffix = '-' + suffix
			} else {
				suffix = ''
			}

			if (this.getProps('display.settings.flex.container.reverseWrap')) {
				suffix += '-reverse'
			}

			klass['flex-wrap-' + direction + prefix + suffix] = true
			return klass;
		},

		/**
		 * Convert string into valid css class selector
		 * @param  {String} value
		 * @return {String}
		 */
		slugifyKlass (value) {
			return value.replace(/^[^-_a-zA-Z]+/, '')
			.replace(/^-(?:[-0-9]+)/, '-')
			.replace(/[^-_a-zA-Z0-9]+/g, '-')
		}
	},

	events: {
		/**
		 * Set viewer when layout viewer is ready
		 *
		 * @param layout {Object}
		 * @return {void}
		 */
		viewerReady () {
			let self = this,
			layout = self.getCanvasIframe('[data-id="body"]').__vue__

			// Set layout
			self.$set('layout', layout)
			uno.viewer = layout

			/**
			 * Parsing Components
			 */
			let syntaxData = /\$([a-zA-Z0-9_]+)/g,
			syntaxSettings = /\@([a-zA-Z0-9_\.]+)/g,
			group = {}

			// Add components to elements.component
			_.each(self.components, function (_component, index) {
				// Init component
				self.componentFire(_component, 'init')

				// Construct data for addElement
				let view = _component.data.view

				// Replace syntax on data
				.replace(syntaxData, "{{data.tpl_data.$1}}")

				// Replace
				.replace(syntaxSettings, function (match, $1) {
					if ($1.indexOf('.')<0) $1 += '.value'
					return '{{data.settings.'+ $1 +'}}'
				})

				// Change all class and id to el-{{name}}-classname
				$('span', $(view)).each(function (el) {
					console.log(el)
				})

				// Reconstruct our component
				let component = {
					type: 'component',
					class: 'no-border',
					data: _component.data,
					events: _component.events,
					kind: _component.data.id,
					label: _component.data.label,
					iconSrc: _component.path.icon + _component.data.icon,
					accept: _component.data.accept || 'section,container,column',
					editable: _component.data.editable,
					display: _component.data.display,
					settings: _component.data.settings,
					view: view
				}

				// Add external stylesheet
				if (_component.data.css) {
					_.each(_component.data.css, function (css, index) {
						let csspath = (css.includes(['http://', 'https://', '://']))? css: _component.path.css + css
						self.layout.$emit('addCSS', csspath)
					})
					delete _component.data.css
				}

				// Add external javascript
				if (_component.data.js) {
					/*_.each(_.component.data.js, function (js, index) {

					})*/
					delete _component.data.js
				}

				// Add to component list
				if (!group[_component.data.group]) {
					group[_component.data.group] = []
				}

				group[_component.data.group].push(component)
			})

			self.$set('elements.component', group)
		},

		/**
		 * On component element ready
		 * @param {Object} data
		 * @return {void}
		 */
		elementReady (data) {
			this.componentsFire('ready', data)
		},

		/**
		 * Display element outline when mouseover
		 *
		 * @param  {Object} obj
		 * @return {void}
		 */
		elementHover (obj) {
			this.$set('outline.hovered', obj)
		},

		/**
		 * Display element outline when selected
		 * @param  {Object} obj
		 * @return {void}
		 */
		elementSelect (obj) {
			// Select element
			this.$set('outline.selected', obj)

			// Toggle block panel
			this.$set('block.panel', false)
			this.blockPanelReposition(obj)

			// Editor handler
			if (this.editor.element) {
				let elementHeight = obj.css.$top + $(this.editor.element).outerHeight(true)

				this.$set('editor.css', {
					top: 0,
					left: 0,
					transform: `translate(${obj.css.$left}px, ${elementHeight}px)`
				})

				if (obj.id !== this.editor.element.getAttribute('data-id')) {
					// Disable content editor
					this.$emit('disableEditor')
				}
			}
		},


		/**
		 * Get selected properties
		 * @param  {Object} props
		 * @return {void}
		 */
		selectedProperties (props) {
			this.$set('selectedProperties', props)
		},

		/**
		 * Get selected kind
		 * @param  {Object} props
		 * @return {void}
		 */
		selectedElementKind (props) {
			this.$set('selectedElementKind', props)
		},

		/**
		 * Catch if  component editable on focus / blur
		 * @param  {Boolean} edit
		 * @return {void}
		 */
		onEditable (edit) {
			this.$set('componentOnEdit', edit)
		},

		/**
		 * When element item dragging itself
		 * @param {Boolean} drag [Whether in drag state or not]
		 * @return {void}
		 */
		dragstart (drag, element) {
			// Notify to viewer
			this.$set('dragging', drag)
			this.componentsFire('dragstart')
			this.layout.$emit('dragstart', drag, element)

			// If in dragging state, close left panel element
			if (drag) {
				setTimeout(() => this.$set('showElementPanel', false), 350)
			}
		},

		/**
		 * When element move, notify viewer to update latest coords
		 * @param  {Object} coords
		 * @return {void}
		 */
		dragmove (coords) {
			let canvasWidth = document.querySelector('.canvas-builder').getBoundingClientRect().width,
			layoutViewerWidth = this.getCanvasIframe().getBoundingClientRect().width,
			gutter = canvasWidth - layoutViewerWidth

			this.componentsFire('dragmove', coords)
			this.layout.$emit('dragmove', coords, gutter)
		},

		/**
		 * When element drag is ended, notify viewer to add element
		 * @param  {Object} data  [type and kind]
		 * @return {void}
		 */
		dragend (data) {
			this.$set('dragging', false)
			this.componentsFire('dragend')
			this.layout.$emit('dragend', data)
		},

		/**
		 * Hide add element panel
		 * @return {void}
		 */
		hideParentPanel () {
			this.$set('showElementPanel', false)
		},

		/**
		 * Hide popup input
		 * @return {void}
		 */
		hidePopInput () {
			this.hidePopInput()
		},

		/**
		 * Draw diagonal line for margin/padding
		 * @param  {String} type
		 * @return {void}
		 */
		drawDiagonalOutline (type) {
			this.drawDiagonalOutlineFor(type)
		},

		/**
		 * Set zIndex of iframe when blockpanel Added
		 * @param  {Boolean} display
		 * @return {void}
		 */
		displayBlockPanel (display) {
			this.$set('displayBlockPanel', display)
		},

		/**
		 * On viewer scrolling
		 * @param  {Object} bodyRect  Scroll Value
		 * @return {void}
		 */
		scroll (bodyRect) {
			this.$set('boundTop', bodyRect.top)
			this.$set('layoutScroll', {
				top: bodyRect.top + 'px'
			})
		},

		/**
		 * Reactivate Iframe it's will resize iframe after dragged components
		 * @return {void}
		 */
		reactivateIframe () {
			let iframe = this.getCanvasIframe(), width

			switch (this.screenView) {
				case 'large':
					width = '99%'
				break;

				case 'medium':
					width = '727px'
				break;

				case 'small':
					width = '599px'
				break;

				default:
					width = '479px'
				break;
			}

			iframe.style.flexGrow = 0
			iframe.style.width = width
			setTimeout(() => iframe.removeAttribute('style'), 1)
		},

		/**
		 * Clear Canvas
		 */
		clearCanvas () {
			this.clearCanvas()
		},

		/**
		 * Show Context Menu
		 */
		showContextMenu (coords) {
			// Get gutter between canvas and iframe
			let viewerWidth = this.getCanvasSize('width'),
			viewerHeight = this.getCanvasSize('height'),
			gutter = document.querySelector('.canvas-builder').getBoundingClientRect().width - viewerWidth

			// Get top and left position
			let leftOrRight, topOrBottom, contextPosition = {},
			contextMenuHeight = $('._cm').outerHeight(true),
			x = coords.left + (gutter / 2),
			y = coords.top

			// Set x position
			if (viewerWidth - coords.left < 200) {
				contextPosition.right = viewerWidth - x + 'px'
			} else {
				contextPosition.left = x + 'px'
			}

			// Set y position
			if (viewerHeight - coords.top < contextMenuHeight) {
				contextPosition.top = y - contextMenuHeight + 'px'
			} else {
				contextPosition.top = y + 'px'
			}

			// Set context menu position
			this.$set('contextMenu.position', contextPosition)

			// Show context menu
			this.$set('contextMenu.show', true)
		},

		// Hide context menu
		hideContextMenu () {
			this.$set('contextMenu.show', false)
		},

		/**
		 * Set editor element
		 */
		setEditorElement (element, window) {
			this.$set('editor.element', element)
			this.$set('editor.window', window)
		},

		/**
		 * Disable editor immediately
		 * @return {void}
		 */
		disableEditor () {
			if (this.layout) {
				this.layout.$broadcast('disableEditor')
			}
		}
	},

	ready () {

		let self = this

		// Google fonts family api key
		$.getJSON(helpers.GOOGLE.endpointUrl + helpers.GOOGLE.apiKey, function (response) {
			let fontFamilyList = self.fontFamilyList

			// Push item to list
			if (response.items && response.items.length > 0) {
				_.each(response.items, function (item) {
					fontFamilyList.push(item.family)
				})
			}

			// Avoid duplicate font
			self.$set('fontFamilyList', _.unique(fontFamilyList))
		})

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
