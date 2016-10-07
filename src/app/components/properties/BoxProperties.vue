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
                    a(@click="") Margin
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
                            a(@click="") Border

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
                                    a(@click="") Padding

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

// Popup Overlay
.popup-overlay(v-if="displayOverlay" @click="hidePopup()")

// Popup margin
popup.popup-right-panel(
:title="popupMarginTitle",
:close="hidePopup",
v-if="popupState.margin.display")
    .uk-grid.uk-grid-small
        .uk-width-6-10
            label Margin Value
        .uk-width-4-10
            input-number(
            :value.sync="marginPopupValue",
            :unit.sync="marginPopupUnit",
            :input-width="30",
            :min="-1000",
            :max="1000")
    button(@click="hidePopup()") OK

// Popup Border
popup.popup-right-panel(
:title="popupBorderTitle",
:close="hidePopup",
v-if="popupState.border.display")
    | border

// Popup Border
popup.popup-right-panel(
:title="popupPaddingTitle",
:close="hidePopup",
v-if="popupState.padding.display")
    | padding
</template>

<script>
import utils from '../../utils.js'
import accordionItem from '../accordion/Item.vue'
import popup from '../tools/screen/Popup.vue'
import inputNumber from '../form/InputNumber.vue'
export default {
    name: 'BoxProperties',
    components: {
        accordionItem,
        popup,
        inputNumber
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
            displayOverlay: false,
            popupState: {
                margin: {
                    direction: '',
                    display: false
                },
                marginAll: {
                    direction: '',
                    display: false
                },
                border: {
                    direction: '',
                    display: false
                },
                borderRadius: {
                    direction: '',
                    display: false
                },
                borderAll: {
                    direction: '',
                    display: false
                },
                padding: {
                    direction: '',
                    display: false
                },
                paddingAll: {
                    direction: '',
                    display: false
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
        positionTop: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionTop = this.getPositionProp(`settings.${this.positionValue}.top`)
                    if (positionTop) {
                        return positionTop.value + positionTop.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.top.value`, val)
            }
        },

        /**
         * Position right value based on settings (absolute|fixed)
         * @return {String}
         */
        positionRight: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionRight = this.getPositionProp(`settings.${this.positionValue}.right`)
                    if (positionRight) {
                        return positionRight.value + positionRight.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.right.value`, val)
            }
        },

        /**
         * Position bottom value based on settings (absolute|fixed)
         * @return {String}
         */
        positionBottom: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionBottom = this.getPositionProp(`settings.${this.positionValue}.bottom`)
                    if (positionBottom) {
                        return positionBottom.value + positionBottom.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.bottom.value`, val)
            }
        },

        /**
         * Position left value based on settings (absolute|fixed)
         * @return {String}
         */
        positionLeft: {
            get () {
                if (this.positionValue !== 'relative') {
                    let positionLeft = this.getPositionProp(`settings.${this.positionValue}.left`)
                    if (positionLeft) {
                        return positionLeft.value + positionLeft.unit
                    }
                }
            },

            set (val) {
                this.setPositionProp(`settings.${this.positionValue}.left.value`, val)
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
         * Margin top value
         * @return {String}
         */
        marginTop: {
            get () {
                let marginTop = this.getMarginProp('top')
                if (marginTop) {
                    return marginTop.value + marginTop.unit
                }
            },

            set (val) {
                this.setMarginProp('top.value', val)
            }
        },

        /**
         * Margin right value
         * @return {String}
         */
        marginRight: {
            get () {
                let marginRight = this.getMarginProp('right')
                if (marginRight) {
                    return marginRight.value + ' ' + marginRight.unit
                }
            },

            set (val) {
                this.setMarginProp('right.value', val)
            }
        },

        /**
         * Margin bottom value
         * @return {String}
         */
        marginBottom: {
            get () {
                let marginBottom = this.getMarginProp('bottom')
                if (marginBottom) {
                    return marginBottom.value + marginBottom.unit
                }
            },

            set (val) {
                this.setMarginProp('bottom.value', val)
            }
        },

        /**
         * Margin left value
         * @return {String}
         */
        marginLeft: {
            get () {
                let marginLeft = this.getMarginProp('left')
                if (marginLeft) {
                    return marginLeft.value + ' ' + marginLeft.unit
                }
            },

            set (val) {
                this.setMarginProp('left.value', val)
            }
        },

        /**
         * Margin popup value
         * @return {String}
         */
        marginPopupValue: {
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
        borderTop: {
            get () {
                let borderTop = this.getBorderProp('top')
                if (borderTop) {
                    return borderTop.value + borderTop.unit
                }
            },

            set (val) {
                this.setBorderProp('top', val)
            }
        },

        /**
         * Border right value
         * @return {String}
         */
        borderRight: {
            get () {
                let borderRight = this.getBorderProp('right')
                if (borderRight) {
                    return borderRight.value + ' ' + borderRight.unit
                }
            },

            set (val) {
                this.setBorderProp('right', val)
            }
        },

        /**
         * Border bottom value
         * @return {String}
         */
        borderBottom: {
            get () {
                let borderBottom = this.getBorderProp('bottom')
                if (borderBottom) {
                    return borderBottom.value + borderBottom.unit
                }
            },

            set (val) {
                this.setBorderProp('bottom', val)
            }
        },

        /**
         * Border left value
         * @return {String}
         */
        borderLeft: {
            get () {
               let borderLeft = this.getBorderProp('left')
               if (borderLeft) {
                   return borderLeft.value + ' ' + borderLeft.unit
               }
            },

            set (val) {
                this.setBorderProp('left', val)
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

        /**
         * Padding top value
         * @return {String}
         */
        paddingTop: {
            get () {
                let paddingTop = this.getPaddingProp('top')
                if (paddingTop) {
                    return paddingTop.value + paddingTop.unit
                }
            },

            set (val) {
                this.setPaddingProp('top', val)
            }
        },

        /**
         * Padding right value
         * @return {String}
         */
        paddingRight: {
            get () {
                let paddingRight = this.getPaddingProp('right')
                if (paddingRight) {
                    return paddingRight.value + ' ' + paddingRight.unit
                }
            },

            set (val) {
                this.setPaddingProp('right', val)
            }
        },

        /**
         * Padding bottom value
         * @return {String}
         */
        paddingBottom: {
            get () {
                let paddingBottom = this.getPaddingProp('bottom')
                if (paddingBottom) {
                    return paddingBottom.value + paddingBottom.unit
                }
            },

            set (val) {
                this.setPaddingProp('bottom', val)
            }
        },

        /**
         * Padding left value
         * @return {String}
         */
        paddingLeft: {
            get () {
                let paddingLeft = this.getPaddingProp('left')
                if (paddingLeft) {
                    return paddingLeft.value + ' ' + paddingLeft.unit
                }
            },

            set (val) {
                this.setPaddingProp('left', val)
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
        }
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
            let propKey = 'border' + utils.capitalize(key)
            this.$root.elementSelector().setProp(`${propKey}.value`, value, this.mouseState)
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
            let propKey = 'padding' + utils.capitalize(key)
            this.$root.elementSelector().setProp(`${propKey}.value`, value, this.mouseState)
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
         * Start drag state
         * @return {void}
         */
        dragStart (event, layout, direction) {
            let value = this[layout + utils.capitalize(direction)].replace('px', '')
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
				this.showPopup(this.dragState.layout, this.dragState.direction)
			}

            // Stop dragging
            this.resetDragState()
            utils.removeEvent(document, 'mousemove', this.dragMove, false)
			utils.removeEvent(document, 'mouseup', this.dragEnd, false)
        },

        showPopup (state, direction) {
            this.popupState[state].display = true
            this.popupState[state].direction = direction
            this.displayOverlay = true
        },

        hidePopup () {
            for (let i in this.popupState) {
                this.resetObject(this.popupState[i])
            }
            this.displayOverlay = false
        }
    }
}
</script>
