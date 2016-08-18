<template>
    <div class="screen-too-small" v-show="windowSize<951"></div>

    <!-- Left panel -->
	<div class="left-panel" :class="resizeCursor" @mouseover="this.setUI('hoverStatus', 'leftPanel')">
        <!-- Panel buttons -->
		<div class="left-panel-buttons">
			<a class="toggle-button"
            @click="toggleUI('componentPanel')"
            :class="{'active': !isUI('cssEditor')}">
                <i class="uk-icon-plus"></i>
            </a>
			<a class="toggle-button"
            @click="toggleCssEditor()"
            :class="{'active': isUI('cssEditor')}">
                <i class="icon-code-editor"></i>
            </a>
		</div>
        <!-- End of panel buttons -->

		<div class="blackout"></div>

        <!-- Components Panel -->
		<div class="element-chooser-panel animated" v-show="isUI('componentPanel')" transition="slideleft">
            <!-- Close component panels -->
			<div class="title">
                Add Elements <a class="uk-close" @click="toggleUI('componentPanel')"></a>
            </div>
            <!-- End of close component panels -->

            <!-- Search components -->
			<div class="search">
                <input type="text" v-model="filter.searchComponent" placeholder="Search Elements" class="input-text full">
            </div>
            <!-- End of search components -->

            <!-- Component collections -->
			<accordion-wrapper v-if="componentSize>0">
				<accordion-item :title="name" v-for="(name, elements) in components">
					<component-item v-for="element in elements|filterBy filter.searchComponent" :data="element" :class="{'no-space-right': ($index + 1) % 3 === 0}"></component-item>
				</accordion-item>
			</accordion-wrapper>
            <!-- End of collections -->
		</div>
        <!-- End of components panel -->
	</div>
    <!-- End of left panel -->

    <!-- CSS editor -->
    <div class="code-editor-panel" v-if="isUI('cssEditor')">
		<div id="css-editor"></div>
	</div>
    <!-- End of CSS editor -->

    <!-- Center panel -->
    <div class="center-panel" :class="resizeCursor" @mouseover="this.setUI('hoverStatus', 'centerPanel')">
        <!-- Topbar panel -->
		<div class="topbar-panel">
			<div>&nbsp;</div>

            <!-- Screen size button -->
			<div class="screen-view">
				<a @click="setScreen('large')" :class="{active: isScreen('large')}">
                    <i class="uk-icon-laptop"></i>
                </a>
				<a @click="setScreen('medium')" :class="{active: isScreen('medium')}">
                    <i class="uk-icon-tablet"></i>
                </a>
				<a @click="setScreen('small')" :class="{active: isScreen('small')}">
                    <i class="uk-icon-mobile horizontal"></i>
                </a>
				<a @click="setScreen('mini')" :class="{active: isScreen('mini')}">
                    <i class="uk-icon-mobile"></i>
                </a>
			</div>
            <!-- End of screen size button -->

            <!-- Save view buttons -->
			<div class="save-view-rollback">
				<a class="button unre-do"><i class="uk-icon-mail-reply"></i></a>
				<a class="button unre-do"><i class="uk-icon-mail-forward"></i></a>
				<a class="button"><i class="uk-icon-eye"></i></a>
				<a class="button"><i class="uk-icon-save"></i> <span>Save</span></a>
			</div>
            <!-- End of save view buttons -->
		</div>
        <!-- End of topbar panel -->

        <!-- Canvas -->
        <div class="canvas-builder">
            <!-- Canvas Tools -->
            <div class="tools" :style="scrollValue" :class="screenSize">
                <!-- Outline Wrapper -->
                <div class="outline-wrapper" v-if="!isUI('editingContent')">
                    <!-- Hover outline selector -->
                    <div class="outline-tools hovered" :style="outline.hover.css" v-if="outline.hover.id!==outline.select.id">
                        <div class="breadcrumbs hover" :class="outlineHoverClass" v-if="outline.hover.breadcrumbs">
                            <div class="selector" v-if="outline.hover.breadcrumbs.length>0">
                                <a>{{outline.hover.breadcrumbs[0].label}}</a>
                            </div>
                        </div>

                        <a class="add-block"
                        :class="outlineHoverClass"
                        @click="showUI('blockPanel')"
                        v-if="outline.hover.type === 'section'"></a>
                    </div>
                    <!-- End of hover outline selector -->

                    <!-- Select outline -->
                    <div class="outline-tools selected" :style="outline.select.css" :class="{remove: outline.select.removeOver}">
						<div class="breadcrumbs" :class="outlineSelectClass"
                        v-if="outline.select.breadcrumbs">
							<div class="edit-tools">
								<div class="selector"
                                @contextmenu="activateContextMenu('breadcrumb', $event)">
									<a v-for="breadcrumb in outline.select.breadcrumbs|limit 3" track-by="$index"
									:class="{active: $index===0||outline.select.showBreadcrumbs}"
									@mouseover="displayOutline(breadcrumb,$index,true)"
									@mouseleave="displayOutline(breadcrumb,$index,false)"
									@click="displayBreadcrumbs(breadcrumb,$index)">{{breadcrumb.label}}</a>
								</div>
								<a class="copy uk-icon-copy" @click="copyElement()"></a>
							</div>

							<a class="remove uk-icon-remove"
							@mouseover="outlineRemoveOver()"
							@mouseleave="outlineRemoveLeave()"
							@click="removeElement()"></a>
						</div>
						<a class="add-block"
                        :class="outlineSelectClass"
                        @click="showUI('blockPanel')"
                        v-if="outline.select.type === 'section'||(outline.select.type === 'body' && outline.select.childSize<1)"></a>
					</div>
                    <!-- end of select outline -->
                </div>
                <!-- End of outline wrapper -->

                <!-- Blocks -->
                <div class="canvas-block animated" v-if="isUI('blockPanel')" :style="block.css" transition="appear">
					<ul>
						<li v-for="block in block.items">
							<a @click="showBlock(block.id)" :class="{selected: isBlock(block.id)}">{{block.label}}</a>
						</li>
					</ul>

					<div class="block-items" v-for="block in block.items" v-show="isBlock(block.id)">
						<div v-for="blockItem in block.items" class="block-item only" :class="[blockItem.kind]" @click="addBlock(blockItem)"></div>
					</div>
				</div>
                <!-- End of blocks -->

                <!-- Context Menu -->
                <div class="canvas-contextmenu">
					<context-menu v-show="isUI('contextMenu')" :menus="contextMenu.list" :position="contextMenu.position"></context-menu>
				</div>
                <!-- end of menu -->
            </div>
            <!-- End of canvas tools -->

            <iframe data-layout-viewer src="./viewer.html" :class="iframeClass"></iframe>
        </div>
        <!-- End of canvas -->
    </div>
    <!-- End of center panel -->


    <!-- Right panel -->
    <div class="right-panel" :class="resizeCursor" @mouseover="this.setUI('hoverStatus', 'rightPanel')">
        <!-- Right panel navigation bar -->
        <div class="right-panel-navbar">
			<a class="edit"
            @click="setUI('rightPanel', 'edit')"
            :class="{active: isUI('rightPanel', 'edit')}"></a>

            <a class="settings"
            @click="setUI('rightPanel', 'settings')"
            :class="{active: isUI('rightPanel', 'settings')}"></a>

            <a class="style"
            @click="setUI('rightPanel', 'style')"
            :class="{active: isUI('rightPanel', 'style')}"></a>
		</div>
        <!-- End of right panel navigation bar -->

        <!-- Popup -->
        <div class="right-panel-overlay" v-if="isUI('rightPanelPopup')" @click="closePopup(true)"></div>

        <!-- Close popup -->
        <div class="right-panel-popup" v-if="isUI('rightPanelPopup', 'color')">
            <color-picker :colors.sync="popupColorValue" :palette="true" :only-button="false" :ok="closePopup()" v-if="isUI('colorPickerPopup', 'global')"></color-picker>
            <color-picker :colors.sync="popupColorValue" :palette="true" :only-button="false" :ok="positionPopup(popupModel.position.type, popupModel.position.pos)" v-if="isUI('colorPickerPopup', 'border')"></color-picker>
            <color-picker :colors.sync="popupAllColorValue" :palette="true" :only-button="false" :ok="allPopup('border')" v-if="isUI('colorPickerPopup', 'border-all')"></color-picker>
        </div>
        <!-- End of popup -->

        <!-- Position popup -->
        <div class="right-panel-popup" v-if="isUI('rightPanelPopup', 'position') || isUI('rightPanelPopup', 'all')">
            <popup :title="`All ${this.popupModel.all} Properties`"  v-if="isUI('rightPanelPopup', 'all')" v-if="isUI('rightPanelPopup', 'all')" :close="closePopup()">
                <!-- All argin, padding, border radius properties -->
                <div class="uk-grid uk-grid-small" v-if="!isPopupAll('border')">
                    <div class="uk-width-4-10">
                        <number :value.sync="popupAllValue" :unit.sync="popupAllUnit" :max="1000" label="" :input-width="30"></number>
                    </div>
                </div>
                <!-- End of margin, padding, border radius properties -->

                <!-- All border properties -->
                <div v-if="isPopupAll('border')">
                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Width</label>
                        </div>
                        <div class="uk-width-4-10">
                            <number :value.sync="popupAllValue" :unit.sync="popupAllUnit" :max="1000" label="" :input-width="30"></number>
                        </div>
                    </div>

                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Type</label>
                        </div>
                        <div class="uk-width-4-10">
                            <multiselect
                            :multiple="false"
                            :show-labels="false"
                            :selected.sync="popupAllBorderStyle"
                            :max-height="250"
                            :options="['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outside']|orderBy 1"
                            placeholder="Style"
                            ><span slot="noResult">No border style have been found!</span></multiselect>
                        </div>
                    </div>

                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Radius</label>
                        </div>
                        <div class="uk-width-4-10">
                            <number :value.sync="popupAllBorderRadiusValue" :unit.sync="popupAllBorderRadiusUnit" :max="1000" label="" :input-width="30"></number>
                        </div>
                    </div>

                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Color</label>
                        </div>
                        <div class="uk-width-4-10">
                            <color-picker :colors.sync="popupAllBorderColor" :palette="false" :only-button="true" :click="colorPopup('', 'border-all')"></color-picker>
                        </div>
                    </div>
                </div>
                <!-- End of all border properties -->

                <button @click="closeAllPopup(true)">OK</button>
            </popup>

            <popup :title="humanize(`${this.popupModel.position.type} ${this.popupModel.position.pos}`)" v-if="isUI('rightPanelPopup', 'position')" :close="closePopup()">
                <!-- Margin, padding, border radius properties -->
                <div class="uk-grid uk-grid-small" v-if="!isPopupPosition('border')">
                    <div class="uk-width-6-10">
                        <label v-html="`${this.popupModel.position.type} Value`" v-if="isPopupPosition('margin')||isPopupPosition('padding')||isPopupPosition('position')"></label>
                        <label v-else>Radius Width</label>
                    </div>
                    <div class="uk-width-4-10">
                        <number :value.sync="popupPositionValue" :unit.sync="popupPositionUnit" :max="1000" label="" :input-width="30"></number>
                    </div>
                </div>
                <!-- End of margin, padding, border radius properties -->

                <!-- Border properties -->
                <div v-if="isPopupPosition('border')">
                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Width</label>
                        </div>
                        <div class="uk-width-4-10">
                            <number :value.sync="popupPositionValue" :unit.sync="popupPositionUnit" :max="1000" label="" :input-width="30"></number>
                        </div>
                    </div>
                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Type</label>
                        </div>
                        <div class="uk-width-4-10">
                            <multiselect
                            :multiple="false"
                            :show-labels="false"
                            :selected.sync="popupBorderStyle"
                            :max-height="250"
                            :options="['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outside']|orderBy 1"
                            placeholder="Style"
                            ><span slot="noResult">No border style have been found!</span></multiselect>
                        </div>
                    </div>
                    <div class="uk-grid uk-grid-small">
                        <div class="uk-width-6-10">
                            <label>Border Color</label>
                        </div>
                        <div class="uk-width-4-10">
                            <color-picker :colors.sync="popupBorderColor" :palette="false" :only-button="true" :click="colorPopup(popupBorderColorKey, popupModel.position.type)"></color-picker>
                        </div>
                    </div>
                </div>
                <!-- End of border properties -->

                <button @click="closePopup(true)">OK</button>
            </popup>
        </div>
        <!-- End of position popup -->
        <!-- End of popup -->

        <!-- Settings panel -->
        <div class="right-panel-container" v-if="hasProps() && isUI('rightPanel', 'settings')">
            <accordion-wrapper>
                <!-- Display properties -->
                <accordion-item title="Display" :switcher="advanced.display" switcher-label="Advanced">
                    <!-- Basic display -->
                    <accordion-item-view>
                        <div class="uk-grid uk-grid-small">
                            <div class="uk-width-2-5">
                                <label class="bold">Select Type</label>
                            </div>
                            <div class="uk-width-3-5">
                                <div class="button-group right">
                                    <rect-button class="display-block"
                                    :disabled="getProps('display.disabled')"
                                    :active="isProps('display.value', 'block')&&!getProps('display.disabled')"
                                    @click="!getProps('display.disabled')? setProps('display.value', 'block'): null">
                                    </rect-button>

                                    <rect-button class="display-flex"
                                    :disabled="getProps('display.disabled')"
                                    :active="isProps('display.value', 'flex')&&!getProps('display.disabled')"
                                    @click="(!getProps('display.disabled'))? setProps('display.value', 'flex'): null"
                                    v-show="advanced.display"></rect-button>

                                    <rect-button class="display-none"
                                    :disabled="getProps('display.disabled')"
                                    :active="isProps('display.value', 'none')&&!getProps('display.disabled')"
                                    @click="!getProps('display.disabled')? setProps('display.value', 'none'): null">
                                    </rect-button>
                                </div>
                            </div>
                        </div>
                    </accordion-item-view>
                    <!-- End of basic display -->

                    <!-- Expand view display -->
                    <accordion-expand-view v-if="hasProps() && ((isKind('section') || isKind('container') || isKind('column')) || (isProps('display.value', 'flex') || isParentProps('display.value', 'flex')))">
                        <!-- Flex Layout -->
                        <accordion-item-view title="Flex Layout Settings"
                        v-if="isProps('display.value', 'flex') && advanced.display">
                            <div class="flex-layout">
                                <div class="flex-row-column">
                                    <rect-button
                                        class="flex-row"
                                        :class="{'flex-row--reverse': getProps(
                                            'display.settings.flex.container.reverse')}"
                                        :active="isProps('display.settings.flex.container.direction', 'row')"
                                        @click="setProps('display.settings.flex.container.direction', 'row')"></rect-button>

                                    <rect-button
                                        class="flex-column"
                                        :class="{'flex-column--reverse': getProps(
                                            'display.settings.flex.container.reverse')}"
                                        :active="isProps('display.settings.flex.container.direction', 'column')"
                                        @click="setProps('display.settings.flex.container.direction', 'column')"></rect-button>
                                </div>
                                <div class="flex-buttons">
                                    <rect-button
                                        :class="flexBtnDirectionClass('justify', 'start')"
                                        :active="isProps('display.settings.flex.container.justifyContent', 'flex-start')"
                                        @click="setProps('display.settings.flex.container.justifyContent', 'flex-start')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('justify', 'center')"
                                        :active="isProps('display.settings.flex.container.justifyContent', 'center')"
                                        @click="setProps('display.settings.flex.container.justifyContent', 'center')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('justify', 'end')"
                                        :active="isProps('display.settings.flex.container.justifyContent', 'flex-end')"
                                        @click="setProps('display.settings.flex.container.justifyContent', 'flex-end')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('justify', 'space-between')"
                                        :active="isProps('display.settings.flex.container.justifyContent', 'space-between')"
                                        @click="setProps('display.settings.flex.container.justifyContent', 'space-between')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('justify', 'space-around')"
                                        :active="isProps('display.settings.flex.container.justifyContent', 'space-around')"
                                        @click="setProps('display.settings.flex.container.justifyContent', 'space-around')"></rect-button>

                                    <rect-button
                                        :class="flexBtnDirectionClass('align', 'start')"
                                        :active="isProps('display.settings.flex.container.alignItems', 'flex-start')"
                                        @click="setProps('display.settings.flex.container.alignItems', 'flex-start')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('align', 'center')"
                                        :active="isProps('display.settings.flex.container.alignItems', 'center')"
                                        @click="setProps('display.settings.flex.container.alignItems', 'center')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('align', 'end')"
                                        :active="isProps('display.settings.flex.container.alignItems', 'flex-end')"
                                        @click="setProps('display.settings.flex.container.alignItems', 'flex-end')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('align', 'stretch')"
                                        :active="isProps('display.settings.flex.container.alignItems', 'stretch')"
                                        @click="setProps('display.settings.flex.container.alignItems', 'stretch')"></rect-button>
                                    <rect-button
                                        :class="flexBtnDirectionClass('align', 'baseline')"
                                        :active="isProps('display.settings.flex.container.alignItems', 'baseline')"
                                        @click="setProps('display.settings.flex.container.alignItems', 'baseline')"></rect-button>
                                </div>
                                <div class="flex-reverse">
                                    <rect-button
                                        class="flex-reverse--row"
                                        v-if="isProps('display.settings.flex.container.direction', 'row')"
                                        :active="isProps('display.settings.flex.container.reverse')"
                                        @click="setProps('display.settings.flex.container.reverse', !getProps('display.settings.flex.container.reverse')
                                        )"></rect-button>

                                    <rect-button
                                        class="flex-reverse--col"
                                        v-if="isProps('display.settings.flex.container.direction', 'column')"
                                        :active="isProps('display.settings.flex.container.reverse')"
                                        @click="setProps( 'display.settings.flex.container.reverse', !getProps('display.settings.flex.container.reverse')
                                        )"></rect-button>
                                </div>
                            </div>
                        </accordion-item-view>
                        <!-- End of flex layout -->

                        <!-- If flex child settings -->
                        <accordion-item-view title="Flex Child Settings" v-if="isParentProps('display.value', 'flex') && advanced.display" border="top" :border-if="isProps('display.value', 'flex')">
                            <div class="flex-child-settings">
                                <div class="label-group">
                                    <div>Sizing</div>
                                    <div>Align</div>
                                    <div>Order</div>
                                </div>
                                <div class="flex-child-buttons">
                                    <div class="flex">
                                        <rect-button class="flex-wrap"
                                        :active="isProps('display.settings.flex.item.sizing.value', 'flexShrink')"
                                        @click="setProps('display.settings.flex.item.sizing.value', 'flexShrink')"></rect-button>

                                        <rect-button class="fill-empty-space"
                                        :active="isProps('display.settings.flex.item.sizing.value', 'flexGrow')"
                                        @click="setProps('display.settings.flex.item.sizing.value', 'flexGrow')"></rect-button>

                                        <rect-button class="dont-shrink"
                                        :active="isProps('display.settings.flex.item.sizing.value', 'none')"
                                        @click="setProps('display.settings.flex.item.sizing.value', 'none')"></rect-button>

                                        <rect-button class="settings"
                                        :active="isProps('display.settings.flex.item.sizing.value', 'custom')"
                                        @click="setProps('display.settings.flex.item.sizing.value', 'custom')"></rect-button>
                                    </div>
                                    <div class="flex">
                                        <rect-button class="align-self-start"
                                        :active="isProps('display.settings.flex.item.alignSelf', 'flex-start')"
                                        @click="setProps('display.settings.flex.item.alignSelf', 'flex-start')"></rect-button>

                                        <rect-button class="align-self-center"
                                        :active="isProps('display.settings.flex.item.alignSelf', 'center')"
                                        @click="setProps('display.settings.flex.item.alignSelf', 'center')"></rect-button>

                                        <rect-button class="align-self-end"
                                        :active="isProps('display.settings.flex.item.alignSelf', 'flex-end')"
                                        @click="setProps('display.settings.flex.item.alignSelf', 'flex-end')"></rect-button>

                                        <rect-button class="align-self-stretch"
                                        :active="isProps('display.settings.flex.item.alignSelf', 'stretch')"
                                        @click="setProps('display.settings.flex.item.alignSelf', 'stretch')"></rect-button>

                                        <rect-button class="align-self-baseline"
                                        :active="isProps('display.settings.flex.item.alignSelf', 'baseline')"
                                        @click="setProps('display.settings.flex.item.alignSelf', 'baseline')"></rect-button>
                                    </div>
                                    <div class="flex">
                                        <rect-button class="auto"
                                        :active="isProps('display.settings.flex.item.order.value', 'auto')"
                                        @click="setProps('display.settings.flex.item.order.value', 'auto')"></rect-button>

                                        <rect-button class="order-first"
                                        :active="isProps('display.settings.flex.item.order.value', 'first')"
                                        @click="setProps('display.settings.flex.item.order.value', 'first')"></rect-button>

                                        <rect-button class="order-last"
                                        :active="isProps('display.settings.flex.item.order.value', 'last')"
                                        @click="setProps('display.settings.flex.item.order.value', 'last')"></rect-button>

                                        <rect-button class="settings"
                                        :active="isProps('display.settings.flex.item.order.value', 'custom')"
                                        @click="setProps('display.settings.flex.item.order.value', 'custom')"></rect-button>
                                    </div>
                                </div>
                            </div>
                        </accordion-item-view>
                        <!-- End of flex child settings -->

                        <!-- Gutter -->
                        <accordion-item-view border="top" v-if="isKind('section') || isKind('container') || isKind('column')" :border-if="isProps('display.value', 'flex')">
							<label style="margin-right:5px">Grid gutter</label>
							<buttons :items="[{label: 'Large', active: isProps('gutter.value', 'large'), click: setGutter('large')},
								{label: 'Medium', active: isProps('gutter.value', 'medium'), click: setGutter('medium')},
								{label: 'Small', active: isProps('gutter.value', 'small'), click: setGutter('small')},
								{icon: 'close', active: isProps('gutter.value', 'collapse'), click: setGutter('collapse')}]"></buttons>
						</accordion-item-view>
                        <!-- End of gutter -->
                    </accordion-expand-view>
                    <!-- End of expand view display -->
                </accordion-item>
                <!-- End of display properties -->

                <!-- Position properties -->
				<accordion-item title="Position">
					<div class="prop-position-outline"
                    :class="[positionPosClass, {over: positionOver.position}]"
					@mouseover.self="propPositionOver('position')"
					@mouseleave="propPositionLeave('position')">
						<label>Position <a v-html="getProps('position.value')" @click="switchPosition()"></a></label>
						<dl>
                            <dt class="top-resize" @mousedown="dragPositionStart($event, 'position', 'top')" @mouseover.self="propPositionOver('position', 'top')" v-if="!isProps('position.value', 'relative')"></dt>
							<dt class="top" v-html="positionValue('top')"  @mousedown="dragPositionStart($event, 'position', 'top')" v-if="!isProps('position.value', 'relative')"></dt>

                            <dt class="right-resize" @mousedown="dragPositionStart($event, 'position', 'right')" @mouseover.self="propPositionOver('position', 'right')" v-if="!isProps('position.value', 'relative')"></dt>
							<dt class="right" v-html="positionValue('right')"  @mousedown="dragPositionStart($event, 'position', 'right')" v-if="!isProps('position.value', 'relative')"></dt>

                            <dt class="bottom-resize" @mousedown="dragPositionStart($event, 'position', 'bottom')" @mouseover.self="propPositionOver('position', 'bottom')" v-if="!isProps('position.value', 'relative')"></dt>
							<dt class="bottom" v-html="positionValue('bottom')" @mousedown="dragPositionStart($event, 'position', 'bottom')" v-if="!isProps('position.value', 'relative')"></dt>

                            <dt class="left-resize" @mousedown="dragPositionStart($event, 'position', 'left')" @mouseover.self="propPositionOver('position', 'left')" v-if="!isProps('position.value', 'relative')"></dt>
							<dt class="left" v-html="positionValue('left')" @mousedown="dragPositionStart($event, 'position', 'left')" v-if="!isProps('position.value', 'relative')"></dt>
						</dl>

						<div class="inner">
							<div class="prop-position-outline margin"
                            :class="[positionMarginClass, {over: positionOver.margin}]"
							@mouseover.self="propPositionOver('margin')">
								<label><a @click="allPopup('margin', true)">Margin</a></label>
								<dl>
                                    <dt class="top-resize" @mousedown="dragPositionStart($event, 'margin', 'top')" @mouseover.self="propPositionOver('margin', 'top')"></dt>
									<dt class="top" v-html="marginValue('top')" @mousedown="dragPositionStart($event, 'margin', 'top')"></dt>

                                    <dt class="right-resize" @mousedown="dragPositionStart($event, 'margin', 'right')" @mouseover.self="propPositionOver('margin', 'right')"></dt>
									<dt class="right" v-html="marginValue('right')" @mousedown="dragPositionStart($event, 'margin', 'right')"></dt>

                                    <dt class="bottom-resize" @mousedown="dragPositionStart($event, 'margin', 'bottom')" @mouseover.self="propPositionOver('margin', 'bottom')"></dt>
									<dt class="bottom" v-html="marginValue('bottom')" @click="positionPopup('margin', 'bottom', true)" @mousedown="dragPositionStart($event, 'margin', 'bottom')"></dt>

                                    <dt class="left-resize" @mousedown="dragPositionStart($event, 'margin', 'left')" @mouseover.self="propPositionOver('margin', 'left')"></dt>
									<dt class="left" v-html="marginValue('left')" @mousedown="dragPositionStart($event, 'margin', 'left')"></dt>
								</dl>
								<div class="inner">
									<div class="prop-position-outline border"
                                    :class="[positionBorderClass, {over: positionOver.border}]"
									@mouseover.self="propPositionOver('border')">
										<label><a @click="allPopup('border', true)">Border</a></label>

                                        <a class="radius top left" @mousedown="dragRadiusStart($event, 'top', 'left')"></a>
                                        <a class="radius top right" @mousedown="dragRadiusStart($event, 'top', 'right')"></a>
                                        <a class="radius bottom left" @mousedown="dragRadiusStart($event, 'bottom', 'left')"></a>
                                        <a class="radius bottom right" @mousedown="dragRadiusStart($event, 'bottom', 'right')"></a>

										<dl>
                                            <dt class="top-resize" @mousedown="dragPositionStart($event, 'border', 'top')" @mouseover.self="propPositionOver('border', 'top')"></dt>
											<dt class="top"
                                            v-html="borderValue('top')" @mousedown="dragPositionStart($event, 'border', 'top')"></dt>

                                            <dt class="right-resize border" @mousedown="dragPositionStart($event, 'border', 'right')" @mouseover.self="propPositionOver('border', 'right')"></dt>
											<dt class="right"
                                            v-html="borderValue('right')" @mousedown="dragPositionStart($event, 'border', 'right')"></dt>

                                            <dt class="bottom-resize" @mousedown="dragPositionStart($event, 'border', 'bottom')" @mouseover.self="propPositionOver('border', 'bottom')"></dt>
											<dt class="bottom"
                                            v-html="borderValue('bottom')" @mousedown="dragPositionStart($event, 'border', 'bottom')"></dt>

                                            <dt class="left-resize border" @mousedown="dragPositionStart($event, 'border', 'left')" @mouseover.self="propPositionOver('border', 'left')"></dt>
											<dt class="left"
                                            v-html="borderValue('left')" @mousedown="dragPositionStart($event, 'border', 'left')"></dt>
										</dl>
										<div class="inner">
											<div class="prop-position-outline padding"
                                            :class="[positionPaddingClass,{over: positionOver.padding}]"
											@mouseover.self="propPositionOver('padding')">
												<label><a @click="allPopup('padding', true)">Padding</a></label>
												<dl>
                                                    <dt class="top-resize padding"
                                                    @mousedown="dragPositionStart($event, 'padding', 'top')" @mouseover.self="propPositionOver('padding', 'top')"></dt>
													<dt class="top"
                                                    v-html="paddingValue('top', true)" @mousedown="dragPositionStart($event, 'padding', 'top')"></dt>

                                                    <dt class="right-resize padding" @mousedown="dragPositionStart($event, 'padding', 'right')" @mouseover.self="propPositionOver('padding', 'right')"></dt>
													<dt class="right"
                                                    v-html="paddingValue('right')" @mousedown="dragPositionStart($event, 'padding', 'right')"></dt>

                                                    <dt class="bottom-resize padding" @mousedown="dragPositionStart($event, 'padding', 'bottom')" @mouseover.self="propPositionOver('padding', 'bottom')"></dt>
													<dt class="bottom"
                                                    v-html="paddingValue('bottom')" @mousedown="dragPositionStart($event, 'padding', 'bottom')"></dt>

                                                    <dt class="left-resize padding" @mousedown="dragPositionStart($event, 'padding', 'left')" @mouseover.self="propPositionOver('padding', 'left')"></dt>
													<dt class="left"
                                                    v-html="paddingValue('left')" @mousedown="dragPositionStart($event, 'padding', 'left')"></dt>
												</dl>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</accordion-item>
				<!-- End of position -->

                <!-- Size -->
				<accordion-item title="Size" :switcher.sync="advanced.size" switcher-label="Advanced">
					<accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-5-10">
								<number :value.sync="propWidthValue" :unit.sync="propWidthUnit" :disabled="this.isProps('width.disabled')" label="Width" :max="1000"></number>
								<number :value.sync="propMinWidthValue" :unit.sync="propMinWidthUnit" :disabled="this.isProps('minWidth.disabled')" label="Min" v-show="advanced.size" transition="fade" :max="1000"></number>
								<number :value.sync="propMaxWidthValue" :unit.sync="propMaxWidthUnit" :disabled="this.isProps('maxWidth.disabled')" label="Max" v-show="advanced.size" transition="fade" :max="1000"></number>
							</div>
                            <div class="uk-width-5-10">
								<number :value.sync="propHeightValue" :unit.sync="propHeightUnit" label="Height" :max="1000"></number>
								<number :value.sync="propMinHeightValue" :unit.sync="propMinHeightUnit" label="Min" v-show="advanced.size" transition="fade" :max="1000"></number>
								<number :value.sync="propMaxHeightValue" :unit.sync="propMaxHeightUnit" label="Max" v-show="advanced.size" transition="fade" :max="1000"></number>
							</div>
						</div>
					</accordion-item-view>
				</accordion-item>
				<!-- End of size -->

                <!-- Custom Attributes -->
				<accordion-item title="Attributes">
					<accordion-item-view>
						<div class="uk-grid">
							<label class="uk-width-2-10">Class</label>
							<div class="uk-width-8-10">
								<input class="input-text uk-width-1-1" v-model="propClass" />
							</div>
						</div>

						<div class="uk-grid">
							<label class="uk-width-2-10">ID</label>
							<div class="uk-width-8-10">
								<input class="input-text uk-width-1-1" v-model="propId" />
							</div>
						</div>
					</accordion-item-view>
				</accordion-item>
                <!-- End of custom attributes -->
            </accordion-wrapper>
        </div>
        <!-- End of settings panel -->

        <!-- Style panel -->
        <div class="right-panel-container" v-if="hasProps() && isUI('rightPanel', 'style')">
            <accordion-wrapper>
                <!-- Typography -->
                <accordion-item title="Typography" switcher-label="Advanced" :switcher.sync="advanced.typography">
                    <!-- Font family -->
                    <accordion-item-view>
						<div class="uk-grid uk-grid-collapse">
							<div class="uk-width-1-10">
								<label class="icon"><i class="font-family"></i></label>
							</div>
							<div class="uk-width-9-10">
								<multiselect
								:multiple="false"
								:show-labels="false"
								:selected.sync="propFontFamily"
								:max-height="250"
								:options="fontFamilyList|orderBy 1"
								placeholder="Font Family"
								><span slot="noResult">No fonts have been found!</span></multiselect>
							</div>
						</div>
					</accordion-item-view>
                    <!-- End of font family -->

                    <!-- Font size -->
                    <accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon "><i class="font-weight"></i></label>
									</div>
									<div class="uk-width-7-10" style="padding-left:5px">
										<multiselect
										:multiple="false"
										:searchable="false"
										:show-labels="false"
										:selected.sync="propFontWeight"
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
										<number :input-width="18" :value.sync="propFontSizeValue" :unit.sync="propFontSizeUnit" :min="0" label=""></number>
									</div>
								</div>
							</div>
							<div class="uk-width-2-6">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="line-height"></i></label>
									</div>

									<div class="uk-width-7-10">
										<number :input-width="20" :value.sync="propLineHeightValue" :unit.sync="propLineHeightUnit" :min="0" label=""></number>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>
                    <!-- End of font size -->

                    <!-- Font style -->
                    <accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="font-color"></i></label>
									</div>
									<div class="uk-width-7-10" style="padding-left:5px">
										<color-picker :colors.sync="propFontColor" :palette="false" :only-button="true" :click="colorPopup('fontColor')" :ok="closePopup()"></color-picker>
									</div>
								</div>
							</div>


							<div class="uk-width-3-10">
								<div class="uk-grid uk-grid-small">
									<div class="uk-width-3-10">
										<label class="icon"><i class="font-style"></i></label>
									</div>
									<div class="uk-width-7-10">
										<buttons :items="[{icon: 'text-style-normal', active: isProps('fontStyle.value', 'normal'), click: setFontStyle('normal')}, {icon: 'text-style-italic', active: isProps('fontStyle.value', 'italic'), click: setFontStyle('italic')}]"></buttons>
									</div>
								</div>
							</div>

							<div class="uk-width-4-10">
								<div class="uk-grid uk-grid-small">
									<div class="uk-width-2-10">
										<label class="icon"><i class="text-decoration"></i></label>
									</div>
									<div class="uk-width-8-10">
										<buttons :items="[{icon: 'x', active: isProps('textDecoration.value', 'none'), click: setTextDecoration('none')}, {icon: 'text-decoration-underline', active: isProps('textDecoration.value', 'underline'), click: setTextDecoration('underline')}, {icon: 'text-decoration-strikethrough', active: isProps('textDecoration.value', 'line-through'), click: setTextDecoration('line-through')}]"></buttons>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>
                    <!-- End of font style -->

                    <!-- Font Align -->
                    <accordion-item-view>
						<div class="uk-grid uk-grid-small">
							<div class="uk-width-5-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-2-10">
										<label class="icon"><i class="text-align"></i></label>
									</div>
									<div class="uk-width-8-10">
										<buttons :items="[{icon: 'text-align-left', active: isProps('textAlign.value', 'left'), click: setTextAlign('left')}, {icon: 'text-align-center', active: isProps('textAlign.value', 'center'), click: setTextAlign('center')}, {icon: 'text-align-right', active: isProps('textAlign.value', 'right'), click: setTextAlign('right')}, {icon: 'text-align-justify', active: isProps('textAlign.value', 'justify'), click: setTextAlign('justify')}]"></buttons>
									</div>
								</div>
							</div>

							<div class="uk-width-4-10 uk-push-1-10">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-3-10">
										<label class="icon"><i class="letter-spacing"></i></label>
									</div>
									<div class="uk-width-7-10">
										<number :input-width="20" :value.sync="propLetterSpacingValue" :unit.sync="propLetterSpacingUnit" :min="-100" label=""></number>
									</div>
								</div>
							</div>
						</div>
					</accordion-item-view>
                    <!-- End of font align -->
                </accordion-item>
                <!-- End of typography -->

                <!-- Background -->
                <accordion-item title="Background" switcher-label="Advanced" :switcher.sync="advanced.background">
                    <!-- Background Buttons -->
                    <accordion-item-view>
						<div class="uk-grid uk-grid-collapse">
							<label class="uk-width-3-10 bold"><span>Select Type</span></label>
							<div class="uk-width-7-10 uk-flex">
								<div class="button-group right">
									<rect-button
									:disabled="isProps('background.disabled')"
									:active="isProps('background.value', 'none')"
									@click="!isProps('background.disabled')? setProps('background.value', 'none'): null"
									class="background-none"></rect-button>
									<rect-button
									:disabled="isProps('background.disabled')"
									:active="isProps('background.value', 'color')"
									@click="!isProps('background.disabled')? setProps('background.value', 'color'): null"
									class="background-color"></rect-button>
									<rect-button
									:disabled="isProps('background.disabled')"
									:active="isProps('background.value', 'image')"
									@click="!isProps('background.disabled')? setProps('background.value', 'image'): null"
									class="background-image"></rect-button>
									<rect-button
									:disabled="isProps('background.disabled')"
									:active="isProps('background.value', 'video')"
									@click="!isProps('background.disabled')? setProps('background.value', 'video'): null"
									class="background-video"></rect-button>
									<rect-button
									:disabled="isProps('background.disabled')"
									:active="isProps('background.value', 'gradient')"
									@click="!isProps('background.disabled')? setProps('background.value', 'gradient'): null"
									class="background-gradient"></rect-button>
								</div>
							</div>
						</div>
					</accordion-item-view>
                    <!-- End of background buttons -->

                    <!-- Background Value Panel -->
                    <accordion-expand-view v-if="!isProps('background.value', 'none')">
						<accordion-item-view v-if="isProps('background.value', 'color')">
							<color-picker :colors.sync="propBackgroundColor" :palette="true" :only-button="false" :ok-button="false"></color-picker>
						</accordion-item-view>
					</accordion-expand-view>
                    <!-- End of background value panel -->
                </accordion-item>
                <!-- End of background -->
            </accordion-wrapper>
        </div>
        <!-- End of style panel -->
    </div>
    <!-- End of right panel -->
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
import constant from '../../js/core/uno.constant.js'

// Import child components
import accordionWrapper from '../accordion/wrapper.vue'
import accordionItem from '../accordion/item.vue'
import accordionItemView from '../accordion/item-view.vue'
import accordionExpandView from '../accordion/expand-view.vue'

// Misc
import contextMenu from '../misc/contextmenu.vue'
import rectButton from '../misc/rect-button.vue'
import buttons from '../misc/buttons.vue'
import Number from '../misc/number.vue'
import colorPicker from '../colorpicker/colorpicker.vue'
import popup from '../misc/popup.vue'

// Import element Items
import componentItem from './component-item.vue'

export default {
	name: 'layout',

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
     * Required components
     * @type {Object}
     */
    components: {
        accordionWrapper, accordionItem, accordionItemView, accordionExpandView,
        contextMenu, rectButton, buttons, Number, Multiselect, colorPicker, popup,
        componentItem,
    },

    /**
	 * Unobuilder layout selector data
	 * @return {Object}
	 */
	data () {
		return {
            canvas: null,
            screenSize: 'large',
            windowSize: 0,
            boundTop: 0,
            scrollValue: 0,
            fontFamilyList: constant.NATIVE_FONTS,
            colorSyncValue: '',
            allBorderColor: {
                hex: '#000000',
                hsl: {
                    h: 0,
                    s: 0,
                    l: 0,
                    a: 1
                },
                hsv: {
                    h: 0,
                    s: 0,
                    v: 0,
                    a: 1
                },
                rgba: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1
                },
                a: 1
            },

            /**
             * List of all ui interaction view
             * @type {Object}
             */
            ui: {
                rightPanel: 'settings',
                cssEditor: false,
                blockPanel: false,
                editingContent: false,
                componentPanel: false,
                contextMenu: false,
                dragging: false,
                rightPanelPopup: '',
                colorPickerPopup: '',
                hoverStatus: '',
            },

            /**
             * Drag state
             * @type {Object}
             */
            drag: {
                modelValue: null,
                direction: false,
                move: false,
                startCoords: {}
            },

            /**
             * List of all keyboard keydown/keyup event model
             * @type {Object}
             */
            keyboard: {
                shift: false
            },

            /**
             * Check for position over layout
             * @type {Object}
             */
            positionOver: {
                position: false,
                positionDirection: '',
                margin: false,
                marginDirection: '',
                border: false,
                borderDirection: '',
                padding: false,
                paddingDirection: ''
            },

            /**
             * List of editor elements
             * @type {Object}
             */
            editor: {
                cssEditor: null
            },

            popupModel: {
                color: '',
                position: {},
                all: ''
            },

            /**
             * List of filter
             * @type {Object}
             */
            filter: {
                searchComponent: null
            },


            /**
             * Advanced properties
             * @type {Object}
             */
            advanced: {
                display: true,
                size: false,
                typography: false,
                background: true
            },

            /**
             * Outline hover and select
             * @type {Object}
             */
            outline: {
                hover: {},
                select: {}
            },

            /**
             * Context menu object
             * @type {Object}
             */
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
                position: {}
            },

            /**
             * Component list
             * @type {Object}
             */
            components: {},

            /**
             * Block list
             * @type {Object}
             */
			block: {
				latest: null,
				selected: 'structure',
				items: [
					{id: 'structure', label: 'Structure', items: [
						{
							tag: 'section',
							type: 'section',
							kind: 'section',
							append: 'body',
							accept: 'body,section'
						},
						{
							tag: 'section',
							type: 'section',
							kind: 'section',
							append: 'body',
							accept: 'body,section',
							elements: [{
								tag: 'div',
								type: 'section',
								kind: 'container',
								accept: 'body,section',
								wrapper: true,
								selectable: false,
								attrs: {class: 'uk-container uk-container-center'},
								elements: [{
									tag: 'div',
									type: 'child',
									kind: 'container'
								}]
							}],
						}
					]},
					{id: 'headers', label: 'Headers'},
					{id: 'blog', label: 'Blog'},
					{id: 'features', label: 'Features'},
					{id: 'team', label: 'Team'},
					{id: 'gallery', label: 'Gallery'}
				]
			}
        }
    },


    /**
     * Computed properties
     * @type {Object}
     */
    computed: {
        /**
         * Count component length
         * @return {Number}
         */
        componentSize () {
            return _.size(this.components)
        },

        /**
         * CSS class for iframe viewer
         * @return {Object} klass
         */
        iframeClass () {
            let klass = [this.screenSize]

            if (this.isUI('dragging')) {
                klass.push('disable')
            }

			return klass
        },

        /**
         * CSS class when hovering an element in canvas
         * @return {Object} klass
         */
		outlineHoverClass () {
			let klass = [], outline = this.outline.hover

            // If breadcrumbs exist
			if (outline.breadcrumbs.length>0) {
                // If hover at top elements
                if (outline.css.$top < 30) {
                    klass.push('top')
                }

                // If hover on body element
                if (outline.breadcrumbs[0].label === 'body') {
                    klass.push('body')
                }
			}

			return klass
		},

        /**
         * CSS class when selects an element in canvas
         * @return {Object} klass
         */
		outlineSelectClass () {
			let klass = [], outline = this.outline.select

			if (outline.breadcrumbs) {
                // If select top element
				if (outline.css.$top < 30) {
                    klass.push('top')
                }

                // If select body
				if (outline.breadcrumbs[0].label === 'body') {
                    klass.push('body')
                }

                // If element is small
				if (outline.css.$width<235) {
                    klass.push('small')
                }

                // If show breadcrumbs
                if (outline.showBreadcrumbs) {
                    klass.push('view')
                }
			}

			return klass
		},

        /**
         * Set color value in popup
         * @type {Object}
         */
        popupColorValue: {
            get () {
                return this.getProps(this.popupModel.color)
            },

            set (value) {
                this.setProps(this.popupModel.color, value)
            }
        },

        /**
         * Set color value in popup
         * @type {Object}
         */
        popupAllColorValue: {
            get () {
                return this.popupAllBorderColor
            },

            set (value) {
                this.popupAllBorderColor = value
            }
        },

        /**
         * Get position key
         * @type {Object}
         */
        popupPositionKey () {
            let type = this.popupModel.position.type,
            pos = this.popupModel.position.pos

            if (type && pos) {
                let key
                if (type === 'position') {
                    key = `position.settings.${this.getProps('position.value')}.${pos}`
                } else {
                    key = type + this.capitalize(pos)
                }

                return key
            }
        },

        /**
         * Position value in popup
         * @type {Object}
         */
        popupPositionValue: {
            get () {
                let key = this.popupPositionKey
                if (key) {
                    return this.getProps(`${key}.value`)
                }
            },

            set (value) {
                let key = this.popupPositionKey
                if (key) {
                    this.setProps(`${key}.value`, value)
                }
            }
        },

        /**
         * Position unit value in popup
         * @type {Object}
         */
        popupPositionUnit: {
            get () {
                let key = this.popupPositionKey
                if (key) {
                    return this.getProps(`${key}.unit`)
                }
            },

            set (value) {
                let key = this.popupPositionKey
                if (key) {
                    this.setProps(`${key}.unit`, value)
                }
            }
        },

        /**
         * Brder style model in popup
         * @type {Object}
         */
        popupBorderStyle: {
            get () {
                let key = this.popupPositionKey
                if (key) {
                    return this.getProps(`${key}.borderStyle`)
                }
            },

            set (value) {
                let key = this.popupPositionKey
                if (key) {
                    this.setProps(`${key}.borderStyle`, value)
                }
            }
        },

        /**
         * Popup border color key
         * @return {String}
         */
        popupBorderColorKey () {
            let key = this.popupPositionKey
            if (key) {
                return `${key}.color`
            }
        },

        /**
         * Position unit value in popup
         * @type {Object}
         */
        popupBorderColor: {
            get () {
                let key = this.popupPositionKey
                if (key) {
                    return this.getProps(`${key}.color`)
                }
            },

            set (value) {
                let key = this.popupPositionKey
                if (key) {
                    this.setProps(`${key}.color`, value)
                }
            }
        },

        /**
         * Value properties in "all" popup
         * @type {Object}
         */
        popupAllValue: {
            get () {
                let key = this.popupModel.all
                if (key) {
                    let left = this.getProps(`${key}Left.value`),
                    right = this.getProps(`${key}Right.value`),
                    top = this.getProps(`${key}Top.value`),
                    bottom = this.getProps(`${key}Bottom.value`)

                    let value = 0, values = [left, right, top, bottom]
                    for (let i in values) {
                        if (values[i]>value) {
                            value = values[i]
                        }
                    }

                    return value
                }
            },

            set (value) {
                let key = this.popupModel.all
                if (key) {
                    this.setProps(`${key}Left.value`, value),
                    this.setProps(`${key}Right.value`, value),
                    this.setProps(`${key}Top.value`, value),
                    this.setProps(`${key}Bottom.value`, value)
                }
            }
        },

        /**
         * Unit properties in "all" popup
         * @type {Object}
         */
        popupAllUnit: {
            get () {
                let key = this.popupModel.all
                if (key) {
                    let left = this.getProps(`${key}Left.unit`),
                    right = this.getProps(`${key}Right.unit`),
                    top = this.getProps(`${key}Top.unit`),
                    bottom = this.getProps(`${key}Bottom.unit`)

                    let value = '', values = [left, right, top, bottom]
                    for (let i in values) {
                        if (values[i]!==value) {
                            value = values[i]
                        }
                    }

                    return value
                }
            },

            set (value) {
                let key = this.popupModel.all
                if (key) {
                    this.setProps(`${key}Left.unit`, value),
                    this.setProps(`${key}Right.unit`, value),
                    this.setProps(`${key}Top.unit`, value),
                    this.setProps(`${key}Bottom.unit`, value)
                }
            }
        },

        /**
         * Border style properties in "all" popup
         * @type {Object}
         */
        popupAllBorderStyle: {
            get () {
                let key = this.popupModel.all
                if (key) {
                    let left = this.getProps(`${key}Left.borderStyle`),
                    right = this.getProps(`${key}Right.borderStyle`),
                    top = this.getProps(`${key}Top.borderStyle`),
                    bottom = this.getProps(`${key}Bottom.borderStyle`)

                    let value = '', values = [left, right, top, bottom]
                    for (let i in values) {
                        if (values[i]!==value) {
                            value = values[i]
                        }
                    }

                    return value
                }
            },

            set (value) {
                let key = this.popupModel.all
                if (key) {
                    this.setProps(`${key}Left.borderStyle`, value),
                    this.setProps(`${key}Right.borderStyle`, value),
                    this.setProps(`${key}Top.borderStyle`, value),
                    this.setProps(`${key}Bottom.borderStyle`, value)
                }
            }
        },

        /**
         * Border radius properties in "all" popup
         * @type {Object}
         */
        popupAllBorderRadiusValue: {
            get () {
                let key = this.popupModel.all
                if (key) {
                    let topleft = this.getProps(`borderRadiusTopLeft.value`),
                    topright = this.getProps(`borderRadiusTopRight.value`),
                    bottomleft = this.getProps(`borderRadiusBottomLeft.value`),
                    bottomright = this.getProps(`borderRadiusBottomRight.value`)

                    let value = '', values = [topleft, topright, bottomleft, bottomright]
                    for (let i in values) {
                        if (values[i]!==value) {
                            value = values[i]
                        }
                    }

                    return value
                }
            },

            set (value) {
                let key = this.popupModel.all
                if (key) {
                    this.setProps(`borderRadiusTopLeft.value`, value)
                    this.setProps(`borderRadiusTopRight.value`, value)
                    this.setProps(`borderRadiusBottomLeft.value`, value)
                    this.setProps(`borderRadiusBottomRight.value`, value)
                }
            }
        },

        /**
         * Border color properties in "all" popup
         * @type {Object}
         */
        popupAllBorderColor: {
            get () {
                return this.allBorderColor
            },

            set (value) {
                let key = this.popupModel.all
                if (key) {
                    this.allBorderColor = value
                    this.setProps(`${key}Left.color`, value),
                    this.setProps(`${key}Right.color`, value),
                    this.setProps(`${key}Top.color`, value),
                    this.setProps(`${key}Bottom.color`, value)
                }
            }
        },

        /**
         * Properties for $props.id
         * @type {Object}
         */
        propId: {
            get () {
                return this.getProps('id')
            },

            set (value) {
                this.setProps('id', value)
            }
        },

        /**
         * Properties for $props.klass
         * @type {Object}
         */
        propClass: {
            get () {
                return this.getProps('klass')
            },

            set (value) {
                this.setProps('klass', value)
            }
        },

        /**
         * Properties for $props.width
         * @type {Object}
         */
        propWidthValue: {
            get () {
                return this.getProps('width.value')
            },

            set (value) {
                this.setProps('width.value', value)
            }
        },

        propWidthUnit: {
            get () {
                return this.getProps('width.unit')
            },

            set (value) {
                this.setProps('width.unit', value)
            }
        },

        /**
         * Properties for $props.minWidth
         * @type {Object}
         */
        propMinWidthValue: {
            get () {
                return this.getProps('minWidth.value')
            },

            set (value) {
                this.setProps('minWidth.value', value)
            }
        },

        propMinWidthUnit: {
            get () {
                return this.getProps('minWidth.unit')
            },

            set (value) {
                this.setProps('minWidth.unit', value)
            }
        },

        /**
         * Properties for $props.maxWidth
         * @type {Object}
         */
        propMaxWidthValue: {
            get () {
                return this.getProps('maxWidth.value')
            },

            set (value) {
                this.setProps('maxWidth.value', value)
            }
        },

        propMaxWidthUnit: {
            get () {
                return this.getProps('maxWidth.unit')
            },

            set (value) {
                this.setProps('maxWidth.unit', value)
            }
        },

        /**
         * Properties for $props.height
         * @type {Object}
         */
        propHeightValue: {
            get () {
                return this.getProps('height.value')
            },

            set (value) {
                this.setProps('height.value', value)
            }
        },

        propHeightUnit: {
            get () {
                return this.getProps('height.unit')
            },

            set (value) {
                this.setProps('height.unit', value)
            }
        },

        /**
         * Properties for $props.minHeight
         * @return {Object}
         */
        propMinHeightValue: {
            get () {
                return this.getProps('minHeight.value')
            },

            set (value) {
                this.setProps('minHeight.value', value)
            }
        },

        propMinHeightUnit: {
            get () {
                return this.getProps('minHeight.unit')
            },

            set (value) {
                this.setProps('minHeight.unit', value)
            }
        },

        /**
         * Properties for $props.maxWidth
         * @type {Object}
         */
        propMaxHeightValue: {
            get () {
                return this.getProps('maxWidth.value')
            },

            set (value) {
                this.setProps('maxWidth.value', value)
            }
        },

        propMaxHeightUnit: {
            get () {
                return this.getProps('maxWidth.unit')
            },

            set (value) {
                this.setProps('maxWidth.unit', value)
            }
        },

        /**
         * Properties for $props.fontFamily
         * @type {Object}
         */
        propFontFamily: {
            get () {
                return this.getProps('fontFamily.value')
            },

            set (value) {
                this.setProps('fontFamily.value', value)
            }
        },

        /**
         * Properties for $props.fontFamily
         * @type {Object}
         */
        propFontWeight: {
            get () {
                return this.getProps('fontWeight.value')
            },

            set (value) {
                this.setProps('fontWeightValue', value)
            }
        },

        /**
         * Properties for $props.fontSize
         * @type {Object}
         */
        propFontSizeValue: {
            get () {
                return this.getProps('fontSize.value')
            },

            set (value) {
                this.setProps('fontSize.value', value)
            }
        },

        propFontSizeUnit: {
            get () {
                return this.getProps('fontSize.unit')
            },

            set (value) {
                this.setProps('fontSize.unit', value)
            }
        },

        /**
         * Properties for $props.lineHeight
         * @type {Object}
         */
        propLineHeightValue: {
            get () {
                return this.getProps('lineHeight.value')
            },

            set (value) {
                this.setProps('lineHeight.value', value)
            }
        },

        propLineHeightUnit: {
            get () {
                return this.getProps('lineHeight.unit')
            },

            set (value) {
                this.setProps('lineHeight.unit', value)
            }
        },

        /**
         * Properties for $props.fontColor
         * @type {Object}
         */
        propFontColor: {
            get () {
                return this.getProps('fontColor')
            },

            set (value) {
                this.setProps('fontColor', value)
            }
        },

        /**
         * Properties for $props.letterSpacing
         * @type {Object}
         */
        propLetterSpacingValue: {
            get () {
                return this.getProps('letterSpacing.value')
            },

            set (value) {
                this.setProps('letterSpacing.value', value)
            }
        },

        propLetterSpacingUnit: {
            get () {
                return this.getProps('letterSpacing.unit')
            },

            set (value) {
                this.setProps('letterSpacing.unit', value)
            }
        },

        /**
         * Properties for $props.letterSpacing
         * @type {Object}
         */
        propBackgroundColor: {
            get () {
                return this.getProps('background.settings.color')
            },

            set (value) {
                this.setProps('background.settings.color', value)
            }
        },

        /**
         * All panel class when element change "position properties"
         * @return {Array} klass
         */
        resizeCursor () {
            let klass = []

            if (this.drag.direction==='left'||this.drag.direction==='right') {
                klass.push('resize-leftright')
            }

            if (this.drag.direction==='top'||this.drag.direction==='bottom') {
                klass.push('resize-updown')
            }

            if (this.drag.modelValue && this.drag.modelValue.indexOf('borderRadius')>-1) {
                let position = this.drag.modelValue.replace('borderRadius', '')
                position = position.toLowerCase()
                if (position==='topleft'||position==='bottomright') {
                    klass.push('resize-nwse')
                } else {
                    klass.push('resize-nesw')
                }
            }

            return klass
        },

        /**
         * Position class if user hover and press shift in margin properties
         * @return {String} klass
         */
        positionPosClass () {
            let klass = ''

            if (this.keyboard.shift) {
                if (['top', 'bottom'].includes(this.positionOver.positionDirection)) {
                    klass = 'updown'
                }

                if (['left', 'right'].includes(this.positionOver.positionDirection)) {
                    klass = 'leftright'
                }
            }

            return klass
        },

        /**
         * Margin class if user hover and press shift in margin properties
         * @return {String} klass
         */
        positionMarginClass () {
            let klass = ''

            if (this.keyboard.shift) {
                if (['top', 'bottom'].includes(this.positionOver.marginDirection)) {
                    klass = 'updown'
                }

                if (['left', 'right'].includes(this.positionOver.marginDirection)) {
                    klass = 'leftright'
                }
            }

            return klass
        },

        /**
         * Margin class if user hover and press shift in margin properties
         * @return {String} klass
         */
        positionBorderClass () {
            let klass = ''

            if (this.keyboard.shift) {
                if (['top', 'bottom'].includes(this.positionOver.borderDirection)) {
                    klass = 'updown'
                }

                if (['left', 'right'].includes(this.positionOver.borderDirection)) {
                    klass = 'leftright'
                }
            }

            return klass
        },

        /**
         * Margin class if user hover and press shift in margin properties
         * @return {String} klass
         */
        positionPaddingClass () {
            let klass = ''

            if (this.keyboard.shift) {
                if (['top', 'bottom'].includes(this.positionOver.paddingDirection)) {
                    klass = 'updown'
                }

                if (['left', 'right'].includes(this.positionOver.paddingDirection)) {
                    klass = 'leftright'
                }
            }

            return klass
        },
    },


    /**
     * Methods
     * @type {Object}
     */
    methods: {
        /**
         * Add component
         * @param {Object} component
         */
        addComponent (component) {
            let group = 'Ungrouped'
            if (component.info.group) {
                group = component.info.group
            }

            // Set new group if not exists
            if (!this.components[group]) {
                this.$set(`components.${group}`, [])
            }

            // Convert component into object
            let componentData = this.componentToObject(component)
            this.components[group].push(componentData)
        },

        /**
         * Load component, basically it's just append script tag
         * @param  {String} url
         */
        loadComponent (url) {
            let script = document.createElement('script')
            script.src = url
            document.body.appendChild(script)
        },

        /**
         * Register Components
         */
        registerComponents () {
            $.getJSON(constant.COMPONENT_REST_URL)
            .then((response) => {
                if (response.items) {
                    let itemCount = 0
                    _.each(response.items, (item, index) => {
                        this.loadComponent(item.url)
                    })
                }
            })
        },

        /**
         * Load google fonts
         * @return {[type]} [description]
         */
        registerGoogleFont () {
            let url = constant.GOOGLE.endpointUrl + constant.GOOGLE.apiKey,
            fontFamilyList = this.fontFamilyList

            $.getJSON(url, (response) => {

    			// Push item to list
    			if (response.items && response.items.length > 0) {
    				_.each(response.items, function (item) {
    					fontFamilyList.push(item.family)
    				})
    			}

    			// Avoid duplicate font
    			this.$set('fontFamilyList', _.unique(fontFamilyList))
    		})
        },

        /**
         * Convert component into template
         * @param {Object} component
         */
        componentToObject (component) {
            let template = this.parsingTemplateMarkup(component.template, 'component')
            component.template = template

            return component
        },

        /**
         * Parsing template markup
         * @param {String} str
         * @param {String} type
         * @link https://github.com/djavaweb/unobuilder/wiki/Create-New-Uno-Component
         */
        parsingTemplateMarkup (template, type) {
            /*{
                tag: 'section',
                type: 'section',
                kind: 'section',
                append: 'body',
                accept: 'body,section',
                elements: [{
                    tag: 'div',
                    type: 'section',
                    kind: 'container',
                    accept: 'body,section',
                    wrapper: true,
                    selectable: false,
                    attrs: {class: 'uk-container uk-container-center'},
                    elements: [{
                        tag: 'div',
                        type: 'child',
                        kind: 'container'
                    }]
                }],
            }*/
            let templateObject = {type: type}

            // Parsing tag to node element
            template = $($.parseXML(template)).children()

            // Get kind
            let kind = template.get(0).tagName
            templateObject.kind = kind

            // Only if wrappers
            if (kind === 'wrapper') {
                templateObject.wrapper = true
                templateObject.selectable = false
            }

            // Tag name
            let tagName = template.attr('tag') || 'div'
            templateObject.tag = tagName

            // Get attributes
            let attrs = {}
            _.each(template.get(0).attributes, (attr, index) => {
                if (attr.name !== 'tag') {
                    attrs[attr.name] = attr.value
                }
            })
            templateObject.attrs = attrs

            // Get children
            let elements = [], childNodes = template.get(0).childNodes,
            childLength = childNodes.length

            // Parsing child elements if any
            while (childLength--) {
                if (childNodes[childLength].nodeType === 1) {
                    elements.unshift(this.parsingTemplateMarkup(childNodes[childLength].outerHTML, type))
                }
            }

            // Push to template object
            if (elements.length>0) {
                templateObject.elements = elements
            }

            return templateObject
        },

        /**
		 * Set user interface value
		 * @param {String} name
		 * @param {StringBoolean|Number} value
		 */
		setUI (name, value) {
			this.$set('ui.' + name, value)
		},

        /**
		 * Check whether UI with name is equals to value
		 * @param {String} name
		 * @param {String} value
		 * @param {StringBoolean|Number} value
		 */
		isUI (name, value) {
            if (! value) {
                return this.ui[name] && this.ui[name] !== ''
            }

			return this.ui[name] === value
		},

        /**
		 * Toggle user interface in data.ui
		 * @param {String} name
		 */
		toggleUI (name) {
            this.setUI(name, !this.ui[name])

            // If toggle component panel
            // hide css editor panel
            if (name === 'componentPanel') {
                this.hideUI('cssEditor')
            }
		},

        /**
		 * Show user interface in data.ui
		 * @param {String} name
		 */
		showUI (name) {
			this.setUI(name, true)
		},

		/**
		 * Hide user interface in data.ui
		 * @param {String} name
		 */
		hideUI (name) {
			this.setUI(name, false)
		},


        /**
		 * Set screen size
		 * @param {String} size
		 */
		setScreen (size) {
			this.$set('screenSize', size)
			this.canvas.$emit('screenSize', size)
		},

        /**
		 * Check current screen size
		 * @param  {String} size
		 * @return {Boolean}
		 */
		isScreen (size) {
			return this.screenSize === size
		},

        /**
		 * Get iframe viewer element
		 * @param {String|ElementNode} body
		 * @param {Boolean} doconly
		 * @return {ElementNode}
		 */
		getCanvasIframe (selector, doconly) {
			let iframe = document.querySelector('[data-layout-viewer]')

            // If selector defined
			if (selector) {
                // Get document of iframe
				let iframeDoc = iframe.contentWindow.document

                // If document only return window.document of iframe
				if (doconly) {
					return iframeDoc
				}

                // if not return by selector
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
			switch (property) {
				case 'height':
                    let body = this.getCanvasIframe('body'),
    			    html = this.getCanvasIframe(null, true)

					return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
				break

				case 'width':
					return this.getCanvasIframe().getBoundingClientRect().width
				break
			}
		},

        /**
		 * Context Menu
		 * @param  {String} type
		 * @param  {Event} event
		 */
        activateContextMenu (type, event) {
            event.preventDefault()

            switch (type) {
                case 'breadcrumb':
                    // Get canvas width and viewer width
                    let canvasWidth = document.querySelector('.canvas-builder').getBoundingClientRect().width,
                    layoutViewerWidth = this.getCanvasIframe().getBoundingClientRect().width,
                    gutter = canvasWidth - layoutViewerWidth

                    // Set position
                    let top = event.pageY - this.boundTop - 35,
                    left = event.pageX - (gutter / 2) - 35

                    // Show context menu
                    this.$emit('displayContextMenu', {top: top, left: left})
                break
            }
        },

        /**
		 * Context function call
		 * @param  {String} cmd
		 * @param  {Boolean} customEvent
		 * @return {Function}
		 */
		contextFn (command, customEvent) {
            // Default event
			if (!customEvent) {
				return () => {
					this.canvas.$emit('keyCapture', command)
					this.hideUI('contextMenu')
				}
			} else {
				switch (command) {
                    // On outline remove over
					case 'removeover':
						return () => {
							this.outlineRemoveOver()
						}
					break;

                    // On outline remove leave
					case 'removeleave':
						return () => {
							this.outlineRemoveLeave()
						}
					break;
				}
			}
		},

        /**
		 * Selected outline on hover
		 */
		outlineRemoveOver () {
			this.$set('outline.select.removeOver', true)
		},


		/**
		 * Selected outline on mouseleave
		 */
		outlineRemoveLeave () {
			this.$set('outline.select.removeOver', false)
		},

        /**
		 * Show outline of hovered breadcrumb
		 * @param  {Object} breadcrumb [Breadcrumb Data]
		 * @param  {Number} index [Current selected index]
		 * @param  {Boolean} enter [Whether it's mouseover state or leave state]
		 */
		displayOutline (breadcrumb, index, enter) {
			this.canvas.$emit('elementHover', breadcrumb, enter)
		},


        /**
		 * Show breadcrumbs full hierarchy
		 * @param  {Object} breadcrumb [Breadcrumb Data]
		 * @param  {Number} index [Current selected index]
		 */
		displayBreadcrumbs (breadcrumb, index) {
			if (this.outline.select && index === 0) {
				this.$set('outline.select.showBreadcrumbs', !this.outline.select.showBreadcrumbs)
			} else {
				this.canvas.$emit('elementSelect', breadcrumb)
			}

			this.hideUI('contextMenu')
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
		 * @param  {String} id
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
			if (this.canvas) {
				this.canvas.$emit('addBlock', block)
			}
		},

        /**
		 * Copy Element
		 */
		copyElement () {
			this.canvas.$emit('copyElement', this.outline.select.id)
		},

        /**
		 * Remove Element
		 */
		removeElement () {
			this.canvas.$emit('removeElement', this.outline.select.id)
		},

        /**
         * Get active element
         * @return {ElementNOde}
         */
        activeElement () {
            if (this.canvas && this.outline.select) {
                let activeElement = this.canvas.getElement(this.outline.select.id)
                return activeElement
            }
        },

        /**
         * If active element has properties
         * @return {Boolean}
         */
        hasProps () {
            let activeElement = this.activeElement()
            if (activeElement && activeElement.$props) {
                return true
            }

            return false
        },

        /**
         * Get properties of active element
         * @param {String} key
         * @return {Object}
         */
        getProps (key) {
            let activeElement = this.activeElement()
            if (activeElement) {
                return activeElement.$get(key, this.screenSize)
            }
        },

        /**
         * Get properties of active element
         * @param {String} key
         * @param {String|Object|Array} value
         * @return {Object}
         */
        setProps (key, value) {
            let activeElement = this.activeElement()
            if (activeElement) {
                activeElement.$set(key, value, this.screenSize)
            }
        },

        /**
         * Check whether active element properties key is the same with value
         * @param  {String} key
         * @param  {String|Number} equals
         * @return {Boolean}
         */
        isProps (key, equals) {
            let value = this.getProps(key)
            if (equals === undefined) {
                return value && value !== ''
            }

            return value === equals
        },

        /**
         * Get parent properties of active element
         * @param {String} key
         * @return {Object}
         */
        getParentProps (key) {
            let activeElement = this.activeElement()
            if (activeElement) {
                let parentElement = activeElement.$parentElement()
                if (parentElement) {
                    return parentElement.$get(key, this.screenSize)
                }
            }
        },

        /**
         * Check whether active element properties key is the same with value
         * @param  {String} key
         * @param  {String|Number} equals
         * @return {Boolean}
         */
        isParentProps (key, equals) {
            return this.getParentProps(key) === equals
        },

        /**
         * Get active element kind
         * @return {[type]} [description]
         */
        getKind () {
            let activeElement = this.activeElement()
            if (activeElement) {
                return activeElement.$kind
            }
        },

        /**
         * Get active element type
         * @return {[type]} [description]
         */
        getType () {
            let activeElement = this.activeElement()
            if (activeElement) {
                return activeElement.$type
            }
        },

        /**
         * Is kind is equals to comparator?
         * @param  {String} equals
         * @return {Boolean}
         */
        isKind (equals) {
            let kind = this.getKind()
            if (kind) {
                return kind == equals
            }
            return false
        },

        /**
         * Is type is equals to comparator?
         * @param  {String} equals
         * @return {Boolean}
         */
        isType (equals) {
            let type = this.getType()
            if (type) {
                return type == equals
            }
            return false
        },

        /**
		 * Set gutter for selected element (only for section, container, column)
		 * @param {String} size
		 */
		setGutter (size) {
            let kind = this.getKind()
			if (kind === 'section'|| kind === 'container' || kind === 'column') {
				return () => this.setProps('gutter.value', size)
			}

			return
		},

        /**
         * Set popup model
         * @param {String} key
         * @param {String} value
         */
        setPopupModel (key, value) {
            this.popupModel[key] = value
        },

        /**
         * Show color popup
         * @param {String} key
         * @param {String} value
         * @return {Function}
         */
        showPopup (key, value) {
            this.setPopupModel(key, value)
            this.setUI('rightPanelPopup', key)
        },

        /**
         * Close popup
         * @param {Boolean} directly
         * @return {Function}
         */
        closePopup (directly) {
            const fn = () => {
                this.setUI('colorPickerPopup', '')
                this.setUI('rightPanelPopup', '')
            }

            if (directly) {
                fn()
            } else {
                return fn
            }

        },

        /**
         * Close "all" popup
         * @param {Boolean} directly
         * @return {Function}
         */
        closeAllPopup (directly) {
            const fn = () => {
                this.setUI('colorPickerPopup', '')
                this.setUI('rightPanelPopup', '')
                this.$nextTick(() => {
                    this.popupAllUnit = this.popupAllUnit
                    this.popupAllValue = this.popupAllValue
                    if (this.popupModel.all === 'border') {
                        this.popupAllBorderStyle = this.popupAllBorderStyle
                        this.popupAllBorderColor = this.popupAllBorderColor
                    }
                })
            }

            if (directly) {
                fn()
            } else {
                return fn
            }

        },

        /**
         * Check current popup position
         * @param  {String} pos
         * @return {Boolean}
         */
        isPopupPosition (pos) {
            return this.popupModel.position && this.popupModel.position.type === pos
        },

        /**
         * Check current "all" popup
         * @param  {String} type
         * @return {Boolean}
         */
        isPopupAll (type) {
            return this.popupModel.all && this.popupModel.all === type
        },

        /**
		 * Show color picker popup
		 * @param {String} properties
		 * @param {String} type
		 * @return {Function}
		 */
		colorPopup (properties, type) {
			return () => {
                if (! type) {
                    type = 'global'
                }
                this.showPopup('color', properties)
                this.setUI('colorPickerPopup', type)
            }
		},

        /**
         * Show position popup
         * @param  {String} key
         * @param  {String} value
         * @param  {Boolean} event
         * @return {Function}
         */
        positionPopup (key, value, directly) {
            let props = {
                type: key,
                pos: value
            }

            const fn = () => {
                this.showPopup('position', props)
            }

            if (directly) {
                fn()
            } else {
                return fn
            }
        },

        /**
         * Show "all" popup
         * @param  {String} key
         * @param  {Boolean} event
         * @return {Function}
         */
        allPopup (key, directly) {
            const fn = () => {
                this.showPopup('all', key)
            }

            if (directly) {
                fn()
            } else {
                return fn
            }
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
		 * Generate flex buttons class for flex-direction
		 * @param  {String} prefix
		 * @param  {String} suffix
		 * @return {Object} klass
		 */
		flexBtnDirectionClass (prefix, suffix) {
			let klass = [],
            direction = this.getProps('display.settings.flex.container.direction'),
            reverse = this.getProps('display.settings.flex.container.reverse')

			if (direction === 'column') {
				direction = 'col'
			}

			if (suffix) {
				suffix = '--' + suffix
			} else {
				suffix = ''
			}

			if (reverse) {
				suffix += '-reverse'
			}

			klass.push(direction + '-' + prefix + suffix)
			return klass
		},

        /**
		 * Position properties on mouse over
		 * @param  {String} type
		 * @param  {String} direction
		 * @return {void}
		 */
		propPositionOver (type, direction) {
            if (!this.isUI('dragging')) {
                for (let key in this.positionOver) {
                    if (key !== type) {
                        let value = false
                        if (key.indexOf('Direction')<0) {
                            value = ''
                        }

                        this.positionOver[key] = false
                    }
                }
                this.$nextTick(() => {
                    if (direction) {
                        this.positionOver[`${type}Direction`] = direction
                    }
                    this.positionOver[type] = true
                })
            }
		},


		/**
		 * Position properties on mouse leave
		 * @param  {String} type
		 * @return {void}
		 */
		propPositionLeave (type) {
            if (!this.isUI('dragging')) {
                for (let key in this.positionOver) {
                    this.positionOver[key] = false
                }
            }
		},

        /**
         * Capitalize string
         * @param  {String} str
         * @return {String}
         */
        capitalize (str) {
            return str.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase())
        },

        humanize (str) {
            return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2').replace(/[-\s]+/g, '_').toLowerCase().replace(/_id$/,'').replace(/_/g, ' ')
        },

        /**
         * Unit Value Properties
         * @param  {Object} propName
         * @param  {Object} delimiter
         * @return {String}
         */
        unitValue (propName, delimiter) {
            let props = this.getProps(propName)
            if (props) {
                let value = props.value

                if (delimiter) {
                    value = value + delimiter
                }

                return value + props.unit
            }
        },

        /**
         * Position value
         * @param  {String} position
         * @return {String}
         */
        positionValue (position) {
            let positionValue = this.getProps('position.value'), delimiter
            if (position === 'left' || position === 'right') {
                delimiter = ' '
            }

            return this.unitValue(`position.settings.${positionValue}.${position}`, delimiter)
        },

        /**
         * Switch position value between relative, absolute, fixed
         */
        switchPosition () {
            let position = ['relative', 'absolute', 'fixed'],
            value = this.getProps('position.value'),
            index = position.indexOf(value)

            index++

            if (index===position.length) {
                index = 0
            }

            this.setProps('position.value', position[index])
        },

        /**
         * Margin value
         * @param  {String} position
         * @return {String}
         */
        marginValue (position) {
            let key = 'margin' + this.capitalize(position), delimiter
            if (position === 'left' || position === 'right') {
                delimiter = ' '
            }

            return this.unitValue(`${key}`, delimiter)
        },

        /**
         * Padding value
         * @param  {String} position
         * @return {String}
         */
        paddingValue (position) {
            let key = 'padding' + this.capitalize(position), delimiter
            if (position === 'left' || position === 'right') {
                delimiter = ' '
            }
            return this.unitValue(`${key}`, delimiter)
        },

        /**
         * Border value
         * @param  {String} position
         * @return {String}
         */
        borderValue (position) {
            let key = 'border' + this.capitalize(position), delimiter
            if (position === 'left' || position === 'right') {
                delimiter = ' '
            }
            return this.unitValue(`${key}`, delimiter)
        },

        /**
         * Show css editor
         */
        toggleCssEditor () {
            this.toggleUI('cssEditor')
            if (!this.isUI('cssEditor')) return;

            // Setup Editor
            this.$nextTick(() => {
                // Set height of editor element like it's parent
                let editorElement = document.querySelector('#css-editor')
                editorElement.style.height = editorElement.parentElement.offsetHeight + 'px'

                // Destroy first
                let editor = this.editor.cssEditor
                if (editor) {
                    editor.destroy()
                }

                // Init editor
                ace.require('ace/ext/language_tools')
                editor  = ace.edit('css-editor')

                // Get custom css from canvas
                if (this.canvas) {
                    editor.setValue(this.canvas.customCSS)
                }

                // Set custom css when any changes
                editor.on('change', () => {
                    let value = editor.getValue()
                    if (this.canvas) {
                        this.canvas.$emit('saveCSS', value)
                    }
                })

                // Editor options
                editor.$blockScrolling = Infinity;
                editor.session.setMode('ace/mode/css')
                editor.setTheme('ace/theme/monokai')
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false
                })
            })
        },

        /**
         * Drag start on position properties
         * @param {Event} event
         * @param {String} prop
         * @param {String} direction
         */
        dragPositionStart (event, prop, direction) {
            let key = prop + this.capitalize(direction), value
            if (prop === 'position') {
                let position = this.getProps('position.value')
                key = `position.settings.${position}.${direction}`
            }

            // Get current value of model
            value = this.getProps(`${key}.value`)

            // Set init variable before move
            this.drag.modelValue = prop
            this.drag.direction = direction
            this.drag.startCoords = {
                x: event.pageX,
                y: event.pageY,
                value: value
            }
            this.$emit('dragStart', 'position')
        },

        /**
         * Drag start on position properties
         * @param {Object} event
         */
        dragPositionEnd (event) {
            if (!this.drag.move) {
                this.positionPopup(this.drag.modelValue, this.drag.direction, true)
            }
            this.drag.startCoords = {}
            this.drag.modelValue = ''
            this.drag.direction = ''
            this.$emit('dragEnd', 'position')
        },

        /**
         * Drag move on position properties
         * @param {Object} event
         */
        dragPositionMove (event) {
            let key = this.drag.modelValue + this.capitalize(this.drag.direction),
            x, y, position, positionKey

            // If dragging position
            if (this.drag.modelValue === 'position') {
                position = this.getProps('position.value')
                positionKey = `position.settings.${position}.${this.drag.direction}`
            }

            // Border value must larger than 0
            const fixValue = () => {
                x += this.drag.startCoords.value
                y += this.drag.startCoords.value

                if (['border', 'padding'].includes(this.drag.modelValue)) {
                    if (x<0) {
                        x = 0
                    }

                    if (y<0) {
                        y = 0
                    }
                }
            }

            // Get y coords by decreasing from start coords
            if (this.drag.startCoords.y) {
                y = parseInt((this.drag.startCoords.y - event.pageY)/2)
            }

            // Get x coords by decreasing from start coords
            if (this.drag.startCoords.x) {
                x = parseInt((this.drag.startCoords.x - event.pageX)/2)
            }

            if (this.drag.direction === 'left') {
                x = -x
            }

            // Set drag move
            this.drag.move = true

            // Check if using shift or not
            // We must handle with different direction
            if (this.keyboard.shift) {
                let keyTop = `${this.drag.modelValue}Top`,
                keyBottom = `${this.drag.modelValue}Bottom`,
                keyLeft = `${this.drag.modelValue}Left`,
                keyRight = `${this.drag.modelValue}Right`

                if (positionKey) {
                    keyTop = `position.settings.${position}.top`
                    keyBottom = `position.settings.${position}.bottom`,
                    keyLeft = `position.settings.${position}.left`,
                    keyRight = `position.settings.${position}.right`
                }

                if (this.drag.direction === 'top') {
                    y = -y
                }

                fixValue()

                // Set value
                if (['top','bottom'].includes(this.drag.direction)) {
                    this.setProps(`${keyTop}.value`, y)
                    this.setProps(`${keyBottom}.value`, y)
                } else {
                    this.setProps(`${keyLeft}.value`, x)
                    this.setProps(`${keyRight}.value`, x)
                }
            } else {
                // If position is top or bottom, flip y coord
                if (['top','bottom'].includes(this.drag.direction)) {
                    y = -y
                }

                // If 'position'
                if (positionKey) {
                    key = positionKey
                }

                fixValue()

                // Set value
                if (['top','bottom'].includes(this.drag.direction)) {
                    this.setProps(`${key}.value`, y)
                } else {
                    this.setProps(`${key}.value`, x)
                }
            }
        },

        /**
         * Drag radius start
         * @param  {Event} event
         * @param  {String} position
         * @param  {String} position2
         */
        dragRadiusStart (event, position, direction) {
            let key = 'borderRadius' + this.capitalize(position) + this.capitalize(direction),

            // Get current value of model
            value = this.getProps(`${key}.value`)

            // Set init variable before move
            this.drag.modelValue = key
            this.drag.direction = direction
            this.drag.startCoords = {
                x: event.pageX,
                y: event.pageY,
                value: value
            }
            this.$emit('dragStart', 'radius')
        },

        /**
         * Drag start on position properties
         * @param {Object} event
         */
        dragRadiusEnd (event) {
            if (!this.drag.move) {
                let position = this.drag.modelValue.replace('borderRadius', '')
                this.positionPopup('borderRadius' + position, this.capitalize(this.drag.direction), true)
            }
            this.drag.startCoords = {}
            this.drag.modelValue = ''
            this.drag.direction = ''
            this.$emit('dragEnd', 'radius')
        },

        dragRadiusMove (event) {
            let y

            // Get y coords by decreasing from start coords
            if (this.drag.startCoords.y) {
                y = parseInt((this.drag.startCoords.y - event.pageY)/2)
                y = parseInt(y * Math.tan(45 * Math.PI / 180))

                let position = this.drag.modelValue.replace('borderRadius', '').toLowerCase()
                if (position.indexOf('top')>-1) {
                    y = -y
                }

                if (y<0) {
                    y = 0
                }
            }

            if (y) {

                console.log(y);

                this.drag.move = true
                this.setProps(`${this.drag.modelValue}.value`, y)
            }
        }
    },


    /**
     * Event list
     * @type {Object}
     */
    events: {
        /**
		 * Set viewer when layout viewer is ready
		 * @param layout {Object}
		 */
		viewerReady () {
            // Get canvas
			let canvas = this.getCanvasIframe('body').__vue__

			// Set canvas layout
			this.$set('canvas', canvas)
			uno.viewer = canvas
		},

        /**
         * When canvas scrolling
         * @param  {Object} bodyBound
         */
        scrolling (bodyBound) {
            // Set current bound top of canvas viewer
            this.$set('boundTop', bodyBound.top)

            // Set scroll value of canvas viewer
			this.$set('scrollValue', {
				top: `${bodyBound.top}px`
			})
        },

        /**
		 * Display element outline when selected
		 * @param  {Object} obj
		 * @return {void}
		 */
		elementSelect (obj) {
			// Select element
			this.$set('outline.select', obj)

			// Toggle panel
			this.hideUI('blockPanel')
			this.hideUI('componentPanel')
            this.hideUI('contextMenu')

            // Close popup only when we're trying to hover canvas builder
            if (this.isUI('hoverStatus', 'centerPanel')) {
                this.closePopup(true)
            }

			/*this.blockPanelReposition(obj)

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
			}*/
		},

        /**
		 * Display element outline when mouseover
		 * @param  {Object} props
		 */
		elementHover (props) {
			this.$set('outline.hover', props)
		},

        /**
		 * Show Context Menu
		 * @param {Object} coords
		 */
		displayContextMenu (coords) {
			// Get gutter between canvas and iframe
			let viewerWidth = this.getCanvasSize('width'),
			viewerHeight = this.getCanvasSize('height'),
			gutter = document.querySelector('.canvas-builder').getBoundingClientRect().width - viewerWidth

			// Get top and left position
			let leftOrRight, topOrBottom, position = {},
			height = $('._cm').outerHeight(true),
			x = coords.left + (gutter / 2),
			y = coords.top

			// Set x position
			if (viewerWidth - coords.left < 200) {
				position.right = viewerWidth - x + 'px'
			} else {
				position.left = x + 'px'
			}

			// Set y position
			if (viewerHeight - coords.top < height) {
				position.top = y - height + 'px'
			} else {
				position.top = y + 'px'
			}

			// Set context menu position
            this.showUI('contextMenu')
			this.$set('contextMenu.position', position)
		},

        /**
         * Record all key capture
         * @param  {String} event
         */
        keyCapture (event) {
            switch (event) {
                case 'pressShift':
                    this.keyboard.shift = true
                break

                case 'releaseShift':
                    this.keyboard.shift = false
                break
            }
        },

        /**
         * Dragging start state
         * @param  {String} name
         * @param  {Object} options
         */
        dragStart (name, options) {
            if (name) {
                this.setUI('dragging', true)
                name = this.capitalize(name)
                document.addEventListener('mousemove', this[`drag${name}Move`], false)
                document.addEventListener('mouseup', this[`drag${name}End`], false)
            }
        },

        /**
         * Dragging end state
         * @param  {String} name
         * @param  {Object} options
         */
        dragEnd (name, options) {
            if (name) {
                name = this.capitalize(name)
                document.removeEventListener('mousemove', this[`drag${name}Move`], false)
                document.removeEventListener('mouseup', this[`drag${name}End`], false)
                this.setUI('dragging', false)
            }
        }
    },


    /**
     * When element is ready
     */
    ready () {

        // Load google web fonts
		this.registerGoogleFont()

        // Get event when uno add new components
        uno.on('addComponent', (component) => {
            this.addComponent(component)
        })

        // Register components
        this.registerComponents()


        /**
		 * Window resize observer, since we can't using this app with screen < 950, warning will appear
		 * @return {void}
		 */
		const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

		this.$set('windowSize', windowWidth)
		window.addEventListener('resize', () => {
			this.$set('windowSize', windowWidth)
		}, true)

        // Keyboard Event Binding using Mousetrap
		// Copy element
		Mousetrap.bind(['ctrl+c', 'command+c'], () => {
			this.canvas.$emit('keyCapture', 'copy')
		})

		// Paste element
		Mousetrap.bind(['ctrl+v', 'command+v'], () => {
			this.canvas.$emit('keyCapture', 'paste')
		})

		// Delete element
		Mousetrap.bind('del', () => {
			this.canvas.$emit('keyCapture', 'delete')
		})

		// Copy element style
		Mousetrap.bind(['ctrl+shift+c', 'command+shift+c'], () => {
			this.canvas.$emit('keyCapture', 'copyStyle')
		})

		// Paste element style
		Mousetrap.bind(['ctrl+shift+v', 'command+shift+v'], () => {
			this.canvas.$emit('keyCapture', 'pasteStyle')
		})

		// Clear element style
		Mousetrap.bind(['ctrl+shift+del', 'command+shift+del'], () => {
			this.canvas.$emit('keyCapture', 'clearStyle')
		})

		// Select using left and up
		Mousetrap.bind(['left', 'up'], () => {
			this.canvas.$emit('keyCapture', 'selectUp')
		})

		// Select using right and down
		Mousetrap.bind(['right', 'down'], () => {
			this.canvas.$emit('keyCapture', 'selectDown')
		})

		// Select childs using space
		Mousetrap.bind(['space', 'enter'], () => {
			this.canvas.$emit('keyCapture', 'enter')
		})

        // Detect shift keydown/keyup
		Mousetrap.bind('shift', () => {
			this.$emit('keyCapture', 'pressShift')
		})
        Mousetrap.bind('shift', () => {
			this.$emit('keyCapture', 'releaseShift')
		}, 'keyup')
    }
}
</script>
