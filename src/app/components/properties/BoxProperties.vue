<template lang="pug">
accordion-item(title="Box Properties", :mouse-state.sync="mouseState")
    // Position
    .box-outline(
    :class="positionClass"
    @mouseover.self="over('position')",
    @mouseleave="leave('position')")
        label
            | Position&nbsp;
            a(v-html="positionValue" @click="switchPosition()")

        dl
            dt.top-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStart($event, 'position', 'top')",
            @mouseover.self="over('position', 'top')")

            dt.top(
            v-if="!isPositionValue('relative')",
            v-html="positionTop",
            @mousedown="dragStart($event, 'position', 'top')")

            dt.right-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStart($event, 'position', 'right')",
            @mouseover.self="over('position', 'right')")

            dt.right(
            v-if="!isPositionValue('relative')",
            v-html="positionRight",
            @mousedown="dragStart($event, 'position', 'right')")

            dt.bottom-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStart($event, 'position', 'bottom')",
            @mouseover.self="over('position', 'bottom')")

            dt.bottom(
            v-if="!isPositionValue('relative')",
            v-html="positionBottom",
            @mousedown="dragStart($event, 'position', 'bottom')")

            dt.left-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStart($event, 'position', 'left')",
            @mouseover.self="over('position', 'left')")

            dt.left(
            v-if="!isPositionValue('relative')",
            v-html="positionLeft",
            @mousedown="dragStart($event, 'position', 'left')")

        // Margin
        .inner
            .box-outline.margin(
            :class="marginClass",
            @mouseover.self="over('margin')")
                label
                    a(@click="showPopup($event, 'margin', 'all')") Margin
                dl
                    dt.top-resize(
                    @mousedown="dragStart($event, 'margin', 'top')",
                    @mouseover.self="over('margin', 'top')")

                    dt.top(
                    v-html="marginTop",
                    @mousedown="dragStart($event, 'margin', 'top')")

                    dt.right-resize(
                    @mousedown="dragStart($event, 'margin', 'right')",
                    @mouseover.self="over('margin', 'right')")

                    dt.right(
                    v-html="marginRight",
                    @mousedown="dragStart($event, 'margin', 'right')")

                    dt.bottom-resize(
                    @mousedown="dragStart($event, 'margin', 'bottom')",
                    @mouseover.self="over('margin', 'bottom')")

                    dt.bottom(
                    v-html="marginBottom",
                    @mousedown="dragStart($event, 'margin', 'bottom')")

                    dt.left-resize(
                    @mousedown="dragStart($event, 'margin', 'left')",
                    @mouseover.self="over('margin', 'left')")

                    dt.left(
                    v-html="marginLeft",
                    @mousedown="dragStart($event, 'margin', 'left')")

                .inner
                    .box-outline.border(
                    :class="borderClass",
                    @mouseover.self="over('border')")
                        label
                            a(@click="showPopup($event, 'border', 'all')") Border

                        a.radius.top.left(@mousedown="dragStartRadius($event, 'top', 'left')")
                        a.radius.top.right(@mousedown="dragStartRadius($event, 'top', 'right')")
                        a.radius.bottom.left(@mousedown="dragStartRadius($event, 'bottom', 'left')")
                        a.radius.bottom.right(@mousedown="dragStartRadius($event, 'bottom', 'right')")

                        dl
                            dt.top-resize(
                            @mousedown="dragStart($event, 'border', 'top')",
                            @mouseover.self="over('border', 'top')")

                            dt.top(
                            v-html="borderTop",
                            @mousedown="dragStart($event, 'border', 'top')")

                            dt.right-resize.border(
                            @mousedown="dragStart($event, 'border', 'right')",
                            @mouseover.self="over('border', 'right')")

                            dt.right(
                            v-html="borderRight",
                            @mousedown="dragStart($event, 'border', 'right')")

                            dt.bottom-resize(
                            @mousedown="dragStart($event, 'border', 'bottom')",
                            @mouseover.self="over('border', 'bottom')")

                            dt.bottom(
                            v-html="borderBottom",
                            @mousedown="dragStart($event, 'border', 'bottom')")

                            dt.left-resize.border(
                            @mousedown="dragStart($event, 'border', 'left')",
                            @mouseover.self="over('border', 'left')")

                            dt.left(
                            v-html="borderLeft",
                            @mousedown="dragStart($event, 'border', 'left')")

                        .inner
                            .box-outline.padding(
                            :class="paddingClass",
                            @mouseover.self="over('padding')")
                                label
                                    a(@click="showPopup($event, 'padding', 'all')") Padding

                                dl
                                    dt.top-resize.padding(
                                    @mousedown="dragStart($event, 'padding', 'top')", @mouseover.self="over('padding', 'top')")

                                    dt.top(
                                    v-html="paddingTop",
                                    @mousedown="dragStart($event, 'padding', 'top')")

                                    dt.right-resize.padding(
                                    @mousedown="dragStart($event, 'padding', 'right')" @mouseover.self="over('padding', 'right')")

                                    dt.right(
                                    v-html="paddingRight",
                                    @mousedown="dragStart($event, 'padding', 'right')")

                                    dt.bottom-resize.padding(
                                    @mousedown="dragStart($event, 'padding', 'bottom')" @mouseover.self="over('padding', 'bottom')")

                                    dt.bottom(
                                    v-html="paddingBottom",
                                    @mousedown="dragStart($event, 'padding', 'bottom')")

                                    dt.left-resize.padding(
                                    @mousedown="dragStart($event, 'padding', 'left')",
                                    @mouseover.self="over('padding', 'left')")

                                    dt.left(
                                    v-html="paddingLeft",
                                    @mousedown="dragStart($event, 'padding', 'left')")

// Popup position
popup(
:title="popupPositionTitle",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-position)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Position Value
        .uk-width-4-10
            input-number(
            :value.sync="positionPopup",
            :unit.sync="positionPopupUnit",
            :width="30",
            :units="['px', 'em']",
            :min="-1000",
            :max="1000")

// Popup margin
popup(
:title="popupMarginTitle",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-margin)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Margin Value
        .uk-width-4-10
            input-number(
            :value.sync="marginPopup",
            :unit.sync="marginPopupUnit",
            :width="30",
            :min="-1000",
            :max="1000")

// Popup all margin
popup(
title="All Margin",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-all-margin)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Margin Value
        .uk-width-4-10
            input-number(
            :value.sync="marginAll",
            :unit.sync="marginAllUnit",
            :width="30",
            :min="-1000",
            :max="1000")

// Popup padding
popup(
:title="popupPaddingTitle",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-padding)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Padding Value
        .uk-width-4-10
            input-number(
            :value.sync="paddingPopup",
            :unit.sync="paddingPopupUnit",
            :width="30",
            :min="0",
            :max="1000")

// Popup: all padding
popup(
title="All Padding",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-all-padding)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Padding Value
        .uk-width-4-10
            input-number(
            :value.sync="paddingAll",
            :unit.sync="paddingAllUnit",
            :width="30",
            :min="0",
            :max="1000")

// Popup border
popup(
:title="popupBorderTitle",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-border)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Value
        .uk-width-4-10
            input-number(
            :value.sync="borderPopup",
            :unit.sync="borderPopupUnit",
            :width="30",
            :min="0",
            :max="1000")

    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Type
        .uk-width-4-10
            multi-select(
            :multiple="false",
            :show-labels="false",
            :selected="borderStyle",
            @update="setBorderStyle",
            :max-height="250",
            :options="['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outside']|orderBy 1",
            placeholder="Style")
                span(slot="noResult") No border style have been found!

    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Color
        .uk-width-4-10
            color-box(:color="borderPopupColor.hex", @click="$refs.borderColorPopup.show(popupOption($event))")

// Popup: Border Color
popup-color-picker(
:colors.sync="borderPopupColor",
:overlay="true",
button="OK",
v-ref:border-color-popup)

// Popup: all border
popup(
title="All Border",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-all-border)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Width
        .uk-width-4-10
            input-number(
            :value.sync="borderWidthAll",
            :unit.sync="borderWidthAllUnit",
            :width="30",
            :min="0",
            :max="1000")

    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Type
        .uk-width-4-10
            multi-select(
            :multiple="false",
            :show-labels="false",
            :selected="borderStyleAll",
            @update="setAllBorderStyle",
            :max-height="250",
            :options="['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outside']|orderBy 1",
            placeholder="Style")
                span(slot="noResult") No border style have been found!

    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Color
        .uk-width-4-10
            color-box(:color="borderColorAll.hex", @click="$refs.borderColorAllPopup.show(popupOption($event))")

    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Border Radius
        .uk-width-4-10
            input-number(
            :value.sync="borderRadiusAll",
            :unit.sync="borderRadiusAllUnit",
            :width="30",
            :units="['px', '%']",
            :min="0",
            :max="100")

// Popup border radius
popup(
:title="popupBorderRadiusTitle",
:overlay="true",
:on-close="hidePopup",
button="OK",
v-ref:popup-border-radius)
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Radius Width
        .uk-width-4-10
            input-number(
            :value.sync="borderRadiusPopupValue",
            :unit.sync="borderRadiusPopupUnit",
            :width="30",
            :units="['px', '%']",
            :min="-1000",
            :max="1000")

// Popup: All border Color
popup-color-picker(
:colors.sync="borderColorAll",
:overlay="true",
button="OK",
v-ref:border-color-all-popup)
</template>

<script>
import multiSelect from 'vue-multiselect'
import utils from '../../utils.js'
import popup from '../tools/screen/Popup.vue'
import popupColorPicker from '../tools/screen/PopupColorPicker.vue'
import accordionItem from '../accordion/Item.vue'
import inputNumber from '../form/InputNumber.vue'
import colorBox from '../tools/element/ColorBox.vue'
export default {
    name: 'BoxProperties',
    components: {
        popup,
        colorBox,
        inputNumber,
        multiSelect,
        accordionItem,
        popupColorPicker
    },
    data () {
        return {
            mouseState: '',
            dragState: {
                y: 0,
                x: 0,
                move: false,
                layout: '',
                direction: '',
                initialValue: 0
            },
            dragRadiusState: {
                x: 0,
                y: 0,
                move: false,
                direction: '',
                initialValue: 0
            },
            overOutline: {
                position: {
                    hover: false,
                    direction: ''
                },
                margin: {
                    hover: false,
                    direction: ''
                },
                border: {
                    hover: false,
                    direction: ''
                },
                padding: {
                    hover: false,
                    direction: ''
                }
            },
            popupState: {
                margin: {
                    direction: ''
                },
                allMargin: {
                    direction: ''
                },
                border: {
                    direction: ''
                },
                borderRadius: {
                    yAxis: '',
                    xAxis: ''
                },
                allBorder: {
                    direction: ''
                },
                padding: {
                    direction: ''
                },
                allPadding: {
                    direction: ''
                },
                position: {
                    direction: ''
                }
            }
        }
    },

    computed: {
        /**
         * Position value
         * @return {String}
         */
        positionValue () {
            return this.getPositionProp('value')
        },

        /**
         * Position top value based on settings (absolute|fixed)
         * @return {String}
         */
        positionTopValue: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionTop = this.getPositionProp(`settings.${this.positionValue}.top`)
                    if (positionTop) {
                        return positionTop.value
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.top.value`, val)
            }
        },

        /**
         * Position top unit based on settings (absolute|fixed)
         * @return {String}
         */
        positionTopUnit: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionTop = this.getPositionProp(`settings.${this.positionValue}.top`)
                    if (positionTop) {
                        return positionTop.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.top.unit`, val)
            }
        },

        /**
         * Position top value based on settings (absolute|fixed)
         * @return {String}
         */
        positionTop: {
            get () {
                return utils.autoValue(this.positionTopValue, this.positionTopUnit)
            },

            set (value) {
                this.positionTopValue = value
            }
        },

        /**
         * Position right value based on settings (absolute|fixed)
         * @return {String}
         */
        positionRightValue: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionRight = this.getPositionProp(`settings.${this.positionValue}.right`)
                    if (positionRight) {
                        return positionRight.value
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.right.value`, val)
            }
        },

        /**
         * Position right unit based on settings (absolute|fixed)
         * @return {String}
         */
        positionRightUnit: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionRight = this.getPositionProp(`settings.${this.positionValue}.right`)
                    if (positionRight) {
                        return positionRight.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.right.unit`, val)
            }
        },

        /**
         * Position right value based on settings (absolute|fixed)
         * @return {String}
         */
        positionRight: {
            get () {
                return utils.autoValue(this.positionRightValue, this.positionRightUnit, ' ')
            },

            set (value) {
                this.positionRightValue = value
            }
        },

        /**
         * Position bottom value based on settings (absolute|fixed)
         * @return {String}
         */
        positionBottomValue: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionBottom = this.getPositionProp(`settings.${this.positionValue}.bottom`)
                    if (positionBottom) {
                        return positionBottom.value
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.bottom.value`, val)
            }
        },

        /**
         * Position bottom unit based on settings (absolute|fixed)
         * @return {String}
         */
        positionBottomUnit: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionBottom = this.getPositionProp(`settings.${this.positionValue}.bottom`)
                    if (positionBottom) {
                        return positionBottom.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.bottom.unit`, val)
            }
        },

        /**
         * Position bottom value based on settings (absolute|fixed)
         * @return {String}
         */
        positionBottom: {
            get () {
                return utils.autoValue(this.positionBottomValue, this.positionBottomUnit)
            },

            set (value) {
                this.positionBottomValue = value
            }
        },

        /**
         * Position left value based on settings (absolute|fixed)
         * @return {String}
         */
        positionLeftValue: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionLeft = this.getPositionProp(`settings.${this.positionValue}.left`)
                    if (positionLeft) {
                        return positionLeft.value
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.left.value`, val)
            }
        },

        /**
         * Position left unit based on settings (absolute|fixed)
         * @return {String}
         */
        positionLeftUnit: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionLeft = this.getPositionProp(`settings.${this.positionValue}.left`)
                    if (positionLeft) {
                        return positionLeft.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.left.unit`, val)
            }
        },

        /**
         * Position left value based on settings (absolute|fixed)
         * @return {String}
         */
        positionLeft: {
            get () {
                return utils.autoValue(this.positionLeftValue, this.positionLeftUnit, ' ')
            },

            set (value) {
                this.positionLeftValue = value
            }
        },

        /**
         * Position class
         * @return {Array}
         */
        positionClass () {
            let klass = []

            if (this.overOutline.position.hover) {
                klass.push('over')
            }

            return klass
        },

        /**
         * Position popup value
         * @return {String}
         */
        positionPopup: {
            get () {
                return this[`position${utils.capitalize(this.popupState.position.direction)}Value`]
            },

            set (val) {
                this[`position${utils.capitalize(this.popupState.position.direction)}Value`] = val
            }
        },

        /**
         * Position popup unit
         * @return {String}
         */
        positionPopupUnit: {
            get () {
                return this[`position${utils.capitalize(this.popupState.position.direction)}Unit`]
            },

            set (val) {
                this[`position${utils.capitalize(this.popupState.position.direction)}Unit`] = val
            }
        },

        /**
         * Margin top value
         * @return {String}
         */
        marginTopValue: {
            get () {
                let marginTop = this.getMarginProp('top')
                if (marginTop) {
                    return marginTop.value
                }
            },

            set (val) {
                this.setMarginProp('top.value', val)
            }
        },

        marginTopUnit: {
            get () {
                let marginTop = this.getMarginProp('top')
                if (marginTop) {
                    return marginTop.unit
                }
            },

            set (val) {
                this.setMarginProp('top.unit', val)
            }
        },

        marginTop: {
            get () {
                return utils.autoValue(this.marginTopValue, this.marginTopUnit)
            },

            set (value) {
                this.marginTopValue = value
            }
        },

        /**
         * Margin right value
         * @return {String}
         */
        marginRightValue: {
            get () {
                let marginRight = this.getMarginProp('right')
                if (marginRight) {
                    return marginRight.value
                }
            },

            set (val) {
                this.setMarginProp('right.value', val)
            }
        },

        marginRightUnit: {
            get () {
                let marginRight = this.getMarginProp('right')
                if (marginRight) {
                    return marginRight.unit
                }
            },

            set (val) {
                this.setMarginProp('right.unit', val)
            }
        },

        marginRight: {
            get () {
                return utils.autoValue(this.marginRightValue, this.marginRightUnit, ' ')
            },

            set (value) {
                this.marginRightValue = value
            }
        },

        /**
         * Margin bottom value
         * @return {String}
         */
         marginBottomValue: {
             get () {
                 let marginBottom = this.getMarginProp('bottom')
                 if (marginBottom) {
                     return marginBottom.value
                 }
             },

             set (val) {
                 this.setMarginProp('bottom.value', val)
             }
         },

         marginBottomUnit: {
            get () {
                let marginBottom = this.getMarginProp('bottom')
                if (marginBottom) {
                    return marginBottom.unit
                }
            },

            set (val) {
                this.setMarginProp('bottom.unit', val)
            }
        },

        marginBottom: {
            get () {
                return utils.autoValue(this.marginBottomValue, this.marginBottomUnit)
            },

            set (value) {
                this.marginBottomValue = value
            }
        },

        /**
         * Margin left value
         * @return {String}
         */
        marginLeftValue: {
             get () {
                 let marginLeft = this.getMarginProp('left')
                 if (marginLeft) {
                     return marginLeft.value
                 }
             },

             set (val) {
                 this.setMarginProp('left.value', val)
             }
         },

        marginLeftUnit: {
            get () {
                let marginLeft = this.getMarginProp('left')
                if (marginLeft) {
                    return marginLeft.unit
                }
            },

            set (val) {
                this.setMarginProp('left.unit', val)
            }
        },

        marginLeft: {
            get () {
                return utils.autoValue(this.marginLeftValue, this.marginLeftUnit, ' ')
            },

            set (value) {
                this.marginLeftValue = value
            }
        },

        /**
         * Margin popup value
         * @return {String}
         */
        marginPopup: {
            get () {
                let marginValue = this.getMarginProp(this.popupState.margin.direction)
                if (marginValue) {
                    return marginValue.value
                }
            },

            set (val) {
                this.setMarginProp(`${this.popupState.margin.direction}.value`, val)
            }
        },

        /**
         * Margin popup unit
         * @return {String}
         */
        marginPopupUnit: {
            get () {
                let marginValue = this.getMarginProp(this.popupState.margin.direction)
                if (marginValue) {
                    return marginValue.unit
                }
            },

            set (val) {
                this.setMarginProp(`${this.popupState.margin.direction}.unit`, val)
            }
        },

        /**
         * Margin popup value
         * @return {String}
         */
        marginAll: {
            get () {
                return Math.max(
                    this.marginTopValue,
                    this.marginRightValue,
                    this.marginBottomValue,
                    this.marginLeftValue
                )
            },

            set (val) {
                val = parseInt(val)
                if (isNaN(val)) {
                    val = 0
                }

                this.marginTopValue = val
                this.marginRightValue = val
                this.marginBottomValue = val
                this.marginLeftValue = val
            }
        },

        /**
         * Margin popup unit
         * @return {String}
         */
        marginAllUnit: {
            get () {
                let units = [
                    this.marginTopUnit,
                    this.marginRightUnit,
                    this.marginBottomUnit,
                    this.marginLeftUnit
                ]

                let unit = ''
                for (let i in units) {
                    if (unit !== units[i]) {
                        unit = units[i]
                    }
                }

                return unit
            },

            set (value) {
                this.marginTopUnit = value
                this.marginRightUnit = value
                this.marginBottomUnit = value
                this.marginLeftUnit = value
            }
        },

        /**
         * Margin class
         * @return {Array}
         */
        marginClass () {
            let klass = []

            if (this.overOutline.margin.hover) {
                klass.push('over')
            }

            return klass
        },

        /**
         * Border top value
         * @return {String}
         */
        borderTopValue: {
             get () {
                 let borderTop = this.getBorderProp('top')
                 if (borderTop) {
                     return borderTop.value
                 }
             },

             set (val) {
                 this.setBorderProp('top.value', val)
             }
        },

        borderTopUnit: {
             get () {
                 let borderTop = this.getBorderProp('top')
                 if (borderTop) {
                     return borderTop.unit
                 }
             },

             set (val) {
                 this.setBorderProp('top.unit', val)
             }
        },

        borderTop: {
            get () {
                return utils.autoValue(this.borderTopValue, this.borderTopUnit)
            },

            set (value) {
                this.borderTopValue = value
            }
        },

        /**
         * Border right value
         * @return {String}
         */
        borderRightValue: {
              get () {
                  let borderRight = this.getBorderProp('right')
                  if (borderRight) {
                      return borderRight.value
                  }
              },

              set (val) {
                  this.setBorderProp('right.value', val)
              }
        },

        borderRightUnit: {
              get () {
                  let borderRight = this.getBorderProp('right')
                  if (borderRight) {
                      return borderRight.unit
                  }
              },

              set (val) {
                  this.setBorderProp('right.unit', val)
              }
        },

        borderRight: {
            get () {
                return utils.autoValue(this.borderRightValue, this.borderRightUnit, ' ')
            },

            set (value) {
                this.borderRightValue = value
            }
        },

        /**
         * Border bottom value
         * @return {String}
         */
        borderBottomValue: {
               get () {
                   let borderBottom = this.getBorderProp('bottom')
                   if (borderBottom) {
                       return borderBottom.value
                   }
               },

               set (val) {
                   this.setBorderProp('bottom.value', val)
               }
        },

        borderBottomUnit: {
               get () {
                   let borderBottom = this.getBorderProp('bottom')
                   if (borderBottom) {
                       return borderBottom.unit
                   }
               },

               set (val) {
                   this.setBorderProp('bottom.unit', val)
               }
        },

        borderBottom: {
            get () {
                return utils.autoValue(this.borderBottomValue, this.borderBottomUnit)
            },

            set (value) {
                this.borderBottomValue = value
            }
        },

        /**
         * Border left value
         * @return {String}
         */
        borderLeftValue: {
                get () {
                    let borderLeft = this.getBorderProp('left')
                    if (borderLeft) {
                        return borderLeft.value
                    }
                },

                set (val) {
                    this.setBorderProp('left.value', val)
                }
        },

        borderLeftUnit: {
                get () {
                    let borderLeft = this.getBorderProp('left')
                    if (borderLeft) {
                        return borderLeft.unit
                    }
                },

                set (val) {
                    this.setBorderProp('left.unit', val)
                }
        },

        borderLeft: {
            get () {
               return utils.autoValue(this.borderLeftValue, this.borderLeftUnit, ' ')
            },

            set (value) {
                this.borderLeftValue = value
            }
        },

        /**
         * Border class
         * @return {Array}
         */
        borderClass () {
            let klass = []

            if (this.overOutline.border.hover) {
                klass.push('over')
            }

            return klass
        },

        borderStyle: {
            get () {
                let border = this.getBorderProp(this.popupState.border.direction)
                if (border) {
                    return border.style
                }
            },

            set (val) {
                this.setBorderProp(`${this.popupState.border.direction}.style`, val)
            }
        },

        /**
         * Border popup value
         * @return {String}
         */
        borderPopup: {
            get () {
                let borderValue = this.getBorderProp(this.popupState.border.direction)
                if (borderValue) {
                    return borderValue.value
                }
            },

            set (val) {
                this.setBorderProp(`${this.popupState.border.direction}.value`, val)
            }
        },

        /**
         * Border popup unit
         * @return {String}
         */
        borderPopupUnit: {
            get () {
                let borderValue = this.getBorderProp(this.popupState.border.direction)
                if (borderValue) {
                    return borderValue.unit
                }
            },

            set (val) {
                this.setBorderProp(`${this.popupState.border.direction}.unit`, val)
            }
        },

        /**
         * Border popup color value
         * @return {String}
         */
        borderPopupColor: {
            get () {
                let borderValue = this.getBorderProp(this.popupState.border.direction)
                if (borderValue) {
                    return borderValue.color
                }
            },

            set (val) {
                this.setBorderProp(`${this.popupState.border.direction}.color`, val)
            }
        },

        /**
         * Border popup value
         * @return {String}
         */
        borderWidthAll: {
            get () {
                return Math.max(
                    this.borderTopValue,
                    this.borderRightValue,
                    this.borderBottomValue,
                    this.borderLeftValue
                )
            },

            set (val) {
                val = parseInt(val)
                if (isNaN(val)) {
                    val = 0
                }

                this.borderTopValue = val
                this.borderRightValue = val
                this.borderBottomValue = val
                this.borderLeftValue = val
            }
        },

        /**
         * Border popup unit
         * @return {String}
         */
        borderWidthAllUnit: {
            get () {
                let units = [
                    this.borderTopUnit,
                    this.borderRightUnit,
                    this.borderBottomUnit,
                    this.borderLeftUnit
                ]

                let unit = ''
                for (let i in units) {
                    if (unit !== units[i]) {
                        unit = units[i]
                    }
                }

                return unit
            },

            set (value) {
                this.borderTopUnit = value
                this.borderRightUnit = value
                this.borderBottomUnit = value
                this.borderLeftUnit = value
            }
        },

        /**
         * All border style popup
         * @return {String}
         */
        borderStyleAll: {
            get () {
                let borderTop = this.getBorderProp('top'),
                borderRight = this.getBorderProp('right'),
                borderBottom =  this.getBorderProp('bottom'),
                borderLeft = this.getBorderProp('left')

                if (borderTop && borderRight && borderBottom && borderLeft) {
                    let styles = [
                        borderTop.style,
                        borderRight.style,
                        borderBottom.style,
                        borderLeft.style
                    ]

                    let style = ''
                    for (let i in styles) {
                        if (style !== styles[i]) {
                            style = styles[i]
                        }
                    }

                    return style
                }
            },

            set (value) {
                this.setBorderProp('top.style', value)
                this.setBorderProp('right.style', value)
                this.setBorderProp('bottom.style', value)
                this.setBorderProp('left.style', value)
            }
        },

        /**
         * All border color
         * @return {String}
         */
        borderColorAll: {
            cache: true,
            get () {
                let borderTop = this.getBorderProp('top'),
                borderRight = this.getBorderProp('right'),
                borderBottom =  this.getBorderProp('bottom'),
                borderLeft = this.getBorderProp('left')

                if (borderTop && borderRight && borderBottom && borderLeft) {
                    let colors = [
                        borderTop.color,
                        borderRight.color,
                        borderBottom.color,
                        borderLeft.color
                    ]

                    let colorHex = '', color = {}
                    for (let i in colors) {
                        if (colorHex !== colors[i].hex) {
                            colorHex = colors[i].hex
                            color = colors[i]
                        }
                    }

                    return color
                }

                return {}
            },

            set (value) {
                // Only changes when popup opened
                if (this.$refs.borderColorAllPopup.display) {
                    this.setBorderProp('top.color', value)
                    this.setBorderProp('right.color', value)
                    this.setBorderProp('bottom.color', value)
                    this.setBorderProp('left.color', value)
                }
            }
        },

        /**
         * Padding top value
         * @return {String}
         */
        paddingTopValue: {
            get () {
                let paddingTop = this.getPaddingProp('top')
                if (paddingTop) {
                    return paddingTop.value
                }
            },

            set (val) {
                this.setPaddingProp('top.value', val)
            }
        },

        paddingTopUnit: {
            get () {
                let paddingTop = this.getPaddingProp('top')
                if (paddingTop) {
                    return paddingTop.unit
                }
            },

            set (val) {
                this.setPaddingProp('top.unit', val)
            }
        },

        paddingTop: {
            get () {
                return utils.autoValue(this.paddingTopValue, this.paddingTopUnit)
            },

            set (value) {
                this.paddingTopValue = value
            }
        },

        /**
         * Padding right value
         * @return {String}
         */
        paddingRightValue: {
            get () {
                let paddingRight = this.getPaddingProp('right')
                if (paddingRight) {
                    return paddingRight.value
                }
            },

            set (val) {
                this.setPaddingProp('right.value', val)
            }
        },

        paddingRightUnit: {
            get () {
                let paddingRight = this.getPaddingProp('right')
                if (paddingRight) {
                    return paddingRight.unit
                }
            },

            set (val) {
                this.setPaddingProp('right.unit', val)
            }
        },

        paddingRight: {
            get () {
                return utils.autoValue(this.paddingRightValue, this.paddingRightUnit)
            },

            set (value) {
                this.paddingRightValue = value
            }
        },

        /**
         * Padding bottom value
         * @return {String}
         */
        paddingBottomValue: {
             get () {
                 let paddingBottom = this.getPaddingProp('bottom')
                 if (paddingBottom) {
                     return paddingBottom.value
                 }
             },

             set (val) {
                 this.setPaddingProp('bottom.value', val)
             }
        },

        paddingBottomUnit: {
             get () {
                 let paddingBottom = this.getPaddingProp('bottom')
                 if (paddingBottom) {
                     return paddingBottom.unit
                 }
             },

             set (val) {
                 this.setPaddingProp('bottom.unit', val)
             }
        },

        paddingBottom: {
            get () {
                return utils.autoValue(this.paddingBottomValue, this.paddingBottomUnit)
            },

            set (value) {
                this.paddingBottomValue = value
            }
        },

        /**
         * Padding left value
         * @return {String}
         */
        paddingLeftValue: {
              get () {
                  let paddingLeft = this.getPaddingProp('left')
                  if (paddingLeft) {
                      return paddingLeft.value
                  }
              },

              set (val) {
                  this.setPaddingProp('left.value', val)
              }
         },

         paddingLeftUnit: {
              get () {
                  let paddingLeft = this.getPaddingProp('left')
                  if (paddingLeft) {
                      return paddingLeft.unit
                  }
              },

              set (val) {
                  this.setPaddingProp('left.unit', val)
              }
        },

        paddingLeft: {
            get () {
                return utils.autoValue(this.paddingLeftValue, this.paddingLeftUnit)
            },

            set (value) {
                this.paddingLeftValue = value
            }
        },

        /**
         * Padding class
         * @return {Array}
         */
        paddingClass () {
            let klass = []

            if (this.overOutline.padding.hover) {
                klass.push('over')
            }

            return klass
        },

        /**
         * Padding popup value
         * @return {String}
         */
        paddingPopup: {
            get () {
                let paddingValue = this.getPaddingProp(this.popupState.padding.direction)
                if (paddingValue) {
                    return paddingValue.value
                }
            },

            set (val) {
                this.setPaddingProp(`${this.popupState.padding.direction}.value`, val)
            }
        },

        /**
         * Padding popup unit
         * @return {String}
         */
        paddingPopupUnit: {
            get () {
                let paddingValue = this.getPaddingProp(this.popupState.padding.direction)
                if (paddingValue) {
                    return paddingValue.unit
                }
            },

            set (val) {
                this.setPaddingProp(`${this.popupState.padding.direction}.unit`, val)
            }
        },

        /**
         * Padding popup value
         * @return {String}
         */
        paddingAll: {
            get () {
                return Math.max(
                    this.paddingTopValue,
                    this.paddingRightValue,
                    this.paddingBottomValue,
                    this.paddingLeftValue
                )
            },

            set (val) {
                val = parseInt(val)
                if (isNaN(val)) {
                    val = 0
                }

                this.paddingTopValue = val
                this.paddingRightValue = val
                this.paddingBottomValue = val
                this.paddingLeftValue = val
            }
        },

        /**
         * Padding popup unit
         * @return {String}
         */
        paddingAllUnit: {
            get () {
                let units = [
                    this.paddingTopUnit,
                    this.paddingRightUnit,
                    this.paddingBottomUnit,
                    this.paddingLeftUnit
                ]

                let unit = ''
                for (let i in units) {
                    if (unit !== units[i]) {
                        unit = units[i]
                    }
                }

                return unit
            },

            set (value) {
                this.paddingTopUnit = value
                this.paddingRightUnit = value
                this.paddingBottomUnit = value
                this.paddingLeftUnit = value
            }
        },

        /**
         * Border radius top left value
         * @type {Object}
         */
        borderRadiusTopLeft: {
            get () {
                let radiusValue = this.getBorderProp('radiusTopLeft')
                if (radiusValue) {
                    return radiusValue.value
                }
            },

            set (val) {
                this.setBorderProp(`radiusTopLeft.value`, val)
            }
        },

        /**
         * Border radius top left unit
         * @type {Object}
         */
        borderRadiusTopLeftUnit: {
            get () {
                let radiusValue = this.getBorderProp('radiusTopLeft')
                if (radiusValue) {
                    return radiusValue.unit
                }
            },

            set (val) {
                this.setBorderProp(`radiusTopLeft.unit`, val)
            }
        },

        /**
         * Border radius top right value
         * @type {Object}
         */
        borderRadiusTopRight: {
            get () {
                let radiusValue = this.getBorderProp('radiusTopRight')
                if (radiusValue) {
                    return radiusValue.value
                }
            },

            set (val) {
                this.setBorderProp(`radiusTopRight.value`, val)
            }
        },

        /**
         * Border radius top right unit
         * @type {Object}
         */
        borderRadiusTopRightUnit: {
            get () {
                let radiusValue = this.getBorderProp('radiusTopRight')
                if (radiusValue) {
                    return radiusValue.unit
                }
            },

            set (val) {
                this.setBorderProp(`radiusTopRight.unit`, val)
            }
        },

        /**
         * Border radius bottom right value
         * @type {Object}
         */
        borderRadiusBottomLeft: {
            get () {
                let radiusValue = this.getBorderProp('radiusBottomLeft')
                if (radiusValue) {
                    return radiusValue.value
                }
            },

            set (val) {
                this.setBorderProp(`radiusBottomLeft.value`, val)
            }
        },

        /**
         * Border radius bottom right unit
         * @type {Object}
         */
        borderRadiusBottomLeftUnit: {
            get () {
                let radiusValue = this.getBorderProp('radiusBottomLeft')
                if (radiusValue) {
                    return radiusValue.unit
                }
            },

            set (val) {
                this.setBorderProp(`radiusBottomLeft.unit`, val)
            }
        },

        /**
         * Border radius bottom right value
         * @type {Object}
         */
        borderRadiusBottomRight: {
            get () {
                let radiusValue = this.getBorderProp('radiusBottomRight')
                if (radiusValue) {
                    return radiusValue.value
                }
            },

            set (val) {
                this.setBorderProp(`radiusBottomRight.value`, val)
            }
        },

        /**
         * Border radius bottom right unit
         * @type {Object}
         */
        borderRadiusBottomRightUnit: {
            get () {
                let radiusValue = this.getBorderProp('radiusBottomRight')
                if (radiusValue) {
                    return radiusValue.unit
                }
            },

            set (val) {
                this.setBorderProp(`radiusBottomRight.unit`, val)
            }
        },

        /**
         * Border radius popup value
         * @type {Object}
         */
        borderRadiusPopupValue: {
            get () {
                let borderRadiusState = this.popupState.borderRadius,
                yAxis = utils.capitalize(borderRadiusState.yAxis),
                xAxis = utils.capitalize(borderRadiusState.xAxis)

                return this[`borderRadius${yAxis + xAxis}`]
            },

            set (val) {
                let borderRadiusState = this.popupState.borderRadius,
                yAxis = utils.capitalize(borderRadiusState.yAxis),
                xAxis = utils.capitalize(borderRadiusState.xAxis)

                this[`borderRadius${yAxis + xAxis}`] = val
            }
        },

        borderRadiusPopupUnit: {
            get () {
                let borderRadiusState = this.popupState.borderRadius,
                yAxis = utils.capitalize(borderRadiusState.yAxis),
                xAxis = utils.capitalize(borderRadiusState.xAxis)

                return this[`borderRadius${yAxis + xAxis}Unit`]
            },

            set (val) {
                let borderRadiusState = this.popupState.borderRadius,
                yAxis = utils.capitalize(borderRadiusState.yAxis),
                xAxis = utils.capitalize(borderRadiusState.xAxis)

                this[`borderRadius${yAxis + xAxis}Unit`] = val
            }
        },

        /**
         * Border radius popup unit
         * @return {String}
         */
        borderRadiusAll: {
            get () {
                return Math.max(
                    this.borderRadiusTopLeft,
                    this.borderRadiusTopRight,
                    this.borderRadiusBottomLeft,
                    this.borderRadiusBottomRight
                )
            },

            set (val) {
                val = parseInt(val)
                if (isNaN(val)) {
                    val = 0
                }

                this.borderRadiusTopLeft = val
                this.borderRadiusTopRight = val
                this.borderRadiusBottomLeft = val
                this.borderRadiusBottomRight = val
            }
        },

        /**
         * Border radius popup unit
         * @return {String}
         */
        borderRadiusAllUnit: {
            get () {
                let units = [
                    this.borderRadiusTopLeftUnit,
                    this.borderRadiusTopRightUnit,
                    this.borderRadiusBottomLeftUnit,
                    this.borderRadiusBottomRightUnit
                ]

                let unit = ''
                for (let i in units) {
                    if (unit !== units[i]) {
                        unit = units[i]
                    }
                }

                return unit
            },

            set (value) {
                this.borderRadiusTopLeftUnit = value
                this.borderRadiusTopRightUnit = value
                this.borderRadiusBottomLeftUnit = value
                this.borderRadiusBottomRightUnit = value
            }
        },

        /**
         * Popup Title for position
         * @return {String}
         */
        popupPositionTitle () {
            return `Position ${utils.capitalize(this.popupState.position.direction)}`
        },

        /**
         * Popup Title for Margin
         * @return {String}
         */
        popupMarginTitle () {
            return `Margin ${utils.capitalize(this.popupState.margin.direction)}`
        },

        /**
         * Popup Title for Border
         * @return {String}
         */
        popupBorderTitle () {
            return `Border ${utils.capitalize(this.popupState.border.direction)}`
        },

        /**
         * Popup Title for Border
         * @return {String}
         */
        popupPaddingTitle () {
            return `Padding ${utils.capitalize(this.popupState.padding.direction)}`
        },

        /**
         * Popup Title for Border
         * @return {String}
         */
        popupBorderRadiusTitle () {
            let borderRadiusState = this.popupState.borderRadius,
            yAxis = utils.capitalize(borderRadiusState.yAxis),
            xAxis = utils.capitalize(borderRadiusState.xAxis)

            return `Border ${yAxis} ${xAxis} Radius`
        },
    },

    methods: {
        /**
         * Get position properties
         * @param  {String} value
         * @return {String}
         */
        getPositionProp (value) {
            return this.$root.elementSelector().getProp(`position.${value}`, this.mouseState)
        },

        /**
         * Set position properties
         * @param {String} key
         * @param {String} value
         */
        setPositionProp (key, value) {
            this.$root.elementSelector().setProp(`position.${key}`, value, this.mouseState)
        },

        /**
         * Check position value
         * @param  {String} position
         * @return {Boolean}
         */
        isPositionValue (position) {
            return this.positionValue === position
        },

        /**
         * Switch position value
         * from relative to absolute
         * from absolute to fixed
         * from fixed to relative
         * @return {void}
         */
        switchPosition () {
            switch (this.positionValue) {
                case 'relative':
                    this.setPositionProp('value', 'absolute')
                break

                case 'absolute':
                    this.setPositionProp('value', 'fixed')
                break

                case 'fixed':
                    this.setPositionProp('value', 'relative')
                break
            }
        },

        /**
         * Get margin properties
         * @param  {String} value
         * @return {Object} [{value: Integer, unit: String}]
         */
        getMarginProp (value) {
            let key = 'margin' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        /**
         * Set margin properties
         * @param {String} key
         * @param {String} value
         */
        setMarginProp (key, value) {
            let propKey = 'margin' + utils.capitalize(key, false)
            this.$root.elementSelector().setProp(`${propKey}`, value, this.mouseState)
        },

        /**
         * Get border properties
         * @param  {String} value
         * @return {Object} [{value: Integer, unit: String}]
         */
        getBorderProp (value) {
            let key = 'border' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        /**
         * Set border properties
         * @param {String} key
         * @param {String} value
         */
        setBorderProp (key, value) {
            let propKey = 'border' + utils.capitalize(key, false)
            this.$root.elementSelector().setProp(`${propKey}`, value, this.mouseState)
        },

        /**
         * Get padding properties
         * @param  {String} value
         * @return {Object} [{value: Integer, unit: String}]
         */
        getPaddingProp (value) {
            let key = 'padding' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        /**
         * Set padding properties
         * @param {String} key
         * @param {String} value
         */
        setPaddingProp (key, value) {
            let propKey = 'padding' + utils.capitalize(key, false)
            this.$root.elementSelector().setProp(`${propKey}`, value, this.mouseState)
        },

        /**
         * Set current boder style in popup
         * @param {String} key
         * @param {String} value
         */
        setBorderStyle (value) {
            this.borderStyle = value
        },

        /**
         * Set all border properties at the same time
         * @param {String} key
         * @param {String} value
         */
        setAllBorderStyle (value) {
            this.borderStyleAll = value
        },

        /**
         * When mouse hovering layout
         * @param  {String} layout
         * @param  {String} direction
         * @return {void}
         */
        over (layout, direction = '') {
            if (! this.dragState.move) {
                for (let item in this.overOutline) {
                    if (layout !== item) {
    					this.overOutline[item].hover = false
                        this.overOutline[item].direction = ''
    				} else {
                        this.overOutline[layout].hover = true
                        this.overOutline[layout].direction = direction
                    }
                }
            }
        },

        /**
         * When mouse leave layout
         * @return {void}
         */
        leave () {
            if (! this.dragState.move) {
                for (let item in this.overOutline) {
                    this.overOutline[item].hover = false
                    this.overOutline[item].direction = ''
                }
            }
        },

        /**
         * Reset object by type
         * @param {Object} object
         */
        resetObject (object) {
            for (let i in object) {
                switch (typeof object[i]) {
                    case 'string':
                        object[i] = ''
                    break

                    case 'number':
                        object[i] = 0
                    break

                    case 'boolean':
                        object[i] = false
                    break
                }
            }
        },

        /**
         * Reset drag state
         */
        resetDragState () {
            this.resetObject(this.dragState)
        },

        /**
         * Reset drag radius state
         */
        resetDragRadiusState () {
            this.resetObject(this.dragRadiusState)
        },

        /**
         * Start drag state
         * @return {void}
         */
        dragStart (event, layout, direction) {
            let value = this[`${layout}${utils.capitalize(direction)}Value`]
            value = parseInt(value)

            // Start dragging
			this.dragState.x = event.pageX
			this.dragState.y = event.pageY
            this.dragState.layout = layout
            this.dragState.direction = direction
            this.dragState.initialValue = value
            utils.addEvent(document, 'mousemove', this.dragMove, false)
			utils.addEvent(document, 'mouseup', this.dragEnd, false)
        },

        /**
         * Dragging
         * @return {void}
         */
        dragMove (event) {
            let x, y

            // Border and Padding value must larger than zero
			const fixValue = () => {
				x += this.dragState.initialValue
				y += this.dragState.initialValue

				if (['border', 'padding'].includes(this.dragState.layout)) {
					if (x<0) {
						x = 0
					}

					if (y<0) {
						y = 0
					}
				}
			}


            // Get y coords by decreasing from start coords
			if (this.dragState.y) {
				y = parseInt((this.dragState.y - event.pageY)/2)
			}

			// Get x coords by decreasing from start coords
			if (this.dragState.x) {
				x = parseInt((this.dragState.x - event.pageX)/2)
			}


            // Tell that i'm on draggin'
            this.dragState.move = true

            // If drag direction left, flip x
            if (this.dragState.direction === 'left') {
				x = -x
			}


            // If it's on shift mode
            if (1 === 2) {

            } else {
                // If drag direction is top or bottom, flip y
                if (['top', 'bottom'].includes(this.dragState.direction)) {
                	y = -y
                }

                // fix value
                fixValue()

                // Set value
                let propKey = this.dragState.layout + utils.capitalize(this.dragState.direction)
                if (['top', 'bottom'].includes(this.dragState.direction)) {
                	this[propKey] = y
                } else {
                	this[propKey] = x
                }
            }
        },

        /**
         * Drag state ended
         * @return {void}
         */
        dragEnd (event) {
            // If it's not moving at all show popup
            if (this.dragState.x === event.pageX &&
                this.dragState.y === event.pageY &&
                ! this.dragState.move) {
				this.showPopup(event, this.dragState.layout, this.dragState.direction)
			}

            // Stop dragging
            this.resetDragState()
            utils.removeEvent(document, 'mousemove', this.dragMove, false)
			utils.removeEvent(document, 'mouseup', this.dragEnd, false)
        },

        /**
         * Start dragging radius
         * @param {Event} event
         * @param {String} yAxis
         * @param {String} xAxis
         */
        dragStartRadius (event, yAxis, xAxis) {
            this.dragRadiusState.x = event.pageX
			this.dragRadiusState.y = event.pageY
            this.dragRadiusState.xAxis = xAxis
            this.dragRadiusState.yAxis = yAxis
            utils.addEvent(document, 'mousemove', this.dragMoveRadius, false)
			utils.addEvent(document, 'mouseup', this.dragEndRadius, false)
        },

        /**
         * Dragging radius
         * @param  {Event} event
         */
        dragMoveRadius (event) {
            let delta

			// Get y coords by decreasing from start coords
			if (this.dragRadiusState.y) {
				delta = parseInt((this.dragRadiusState.y - event.pageY)/2)
				delta = parseInt(delta * Math.tan(45 * Math.PI / 180))

                // Flip value if yAxis is top
				if (this.dragRadiusState.yAxis === 'top') {
					delta = -delta
				}

                // Value below 0 is not allowed
				if (delta<0) {
					delta = 0
				}
			}

            // Set value
			if (delta) {

                let yAxis = utils.capitalize(this.dragRadiusState.yAxis),
                xAxis = utils.capitalize(this.dragRadiusState.xAxis),
                propKey = `borderRadius${yAxis + xAxis}`

                this.dragRadiusState.move = true
				this[propKey] = delta
			}
        },

        /**
         * Draggin' radius ended
         * @param  {Event} event
         */
        dragEndRadius (event) {
            // If it's not moving at all show popup
            if (this.dragRadiusState.x === event.pageX &&
                this.dragRadiusState.y === event.pageY &&
                ! this.dragRadiusState.move) {

                this.popupState.borderRadius.xAxis = this.dragRadiusState.xAxis
                this.popupState.borderRadius.yAxis = this.dragRadiusState.yAxis
                this.$refs.popupBorderRadius.show(this.popupOption(event))
			}

            // Stop dragging
            this.resetDragRadiusState()
            utils.removeEvent(document, 'mousemove', this.dragMoveRadius, false)
			utils.removeEvent(document, 'mouseup', this.dragEndRadius, false)
        },

        /**
         * Default option
         * @param  {Event} event
         * @return {Object}
         */
        popupOption (event) {
            return {
                y: event.pageY,
                dependOnScroll: this.$root.ref('rightPanel.properties').$el
            }
        },

        /**
         * Display popup
         * @param  {Event} event
         * @param  {String} state State can be position|margin|border|padding
         * @param  {String} direction top|bottom|left|right
         * @return {void}
         */
        showPopup (event, state, direction) {
            if (direction === 'all') {
                state = `all${utils.capitalize(state)}`
            }

            this.popupState[state].direction = direction
            this.$refs[`popup${utils.capitalize(state)}`].show(this.popupOption(event))
        },

        /**
         * Hide popup
         * @return {void}
         */
        hidePopup () {
            // Reset popup state
            for (let i in this.popupState) {
                this.resetObject(this.popupState[i])
            }

            // Fix auto number
            [
                'marginTopValue', 'marginRightValue',
                'marginBottomValue', 'marginLeftValue',
                'paddingTopValue', 'paddingRightValue',
                'paddingBottomValue', 'paddingLeftValue',
                'borderTopValue', 'borderRightValue',
                'borderBottomValue', 'borderLeftValue'
            ].forEach((propKey) => {
                if (isNaN(parseInt(this[propKey])) || isNaN(parseFloat(this[propKey]))) {
                    // If key is margin, it's okay if value is auto
                    // But it's a shame, if key is border or padding
                    if (propKey.indexOf('margin')) {
                        if (this[propKey] !== 'auto') {
                            this[propKey] = 0
                        }
                    } else {
                        this[propKey] = 0
                    }
                }
            })
        }
    }
}
</script>
