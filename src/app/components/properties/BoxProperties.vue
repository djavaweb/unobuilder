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
            @mousedown="dragStartPosition($event, 'position', 'top')",
            @mouseover.self="over('position', 'top')")

            dt.top(
            v-if="!isPositionValue('relative')",
            v-html="positionTop",
            @mousedown="dragStartPosition($event, 'position', 'top')")

            dt.right-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStartPosition($event, 'position', 'right')",
            @mouseover.self="over('position', 'right')")

            dt.right(
            v-if="!isPositionValue('relative')",
            v-html="positionRight",
            @mousedown="dragStartPosition($event, 'position', 'right')")

            dt.bottom-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStartPosition($event, 'position', 'bottom')",
            @mouseover.self="over('position', 'bottom')")

            dt.bottom(
            v-if="!isPositionValue('relative')",
            v-html="positionBottom",
            @mousedown="dragStartPosition($event, 'position', 'bottom')")

            dt.left-resize(
            v-if="!isPositionValue('relative')",
            @mousedown="dragStartPosition($event, 'position', 'left')",
            @mouseover.self="over('position', 'left')")

            dt.left(
            v-if="!isPositionValue('relative')",
            v-html="positionLeft",
            @mousedown="dragStartPosition($event, 'position', 'left')")

        // Margin
        .inner
            .box-outline.margin(
            :class="marginClass",
            @mouseover.self="over('margin')")
                label
                    a(@click="") Margin
                dl
                    dt.top-resize(
                    @mousedown="dragStartPosition($event, 'margin', 'top')",
                    @mouseover.self="over('margin', 'top')")

                    dt.top(
                    v-html="marginTop",
                    @mousedown="dragStartPosition($event, 'margin', 'top')")

                    dt.right-resize(
                    @mousedown="dragStartPosition($event, 'margin', 'right')",
                    @mouseover.self="over('margin', 'right')")

                    dt.right(
                    v-html="marginRight",
                    @mousedown="dragStartPosition($event, 'margin', 'right')")

                    dt.bottom-resize(
                    @mousedown="dragStartPosition($event, 'margin', 'bottom')",
                    @mouseover.self="over('margin', 'bottom')")

                    dt.bottom(
                    v-html="marginBottom",
                    @mousedown="over($event, 'margin', 'bottom')")

                    dt.left-resize(
                    @mousedown="dragStartPosition($event, 'margin', 'left')",
                    @mouseover.self="over('margin', 'left')")

                    dt.left(
                    v-html="marginLeft",
                    @mousedown="dragStartPosition($event, 'margin', 'left')")

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
                            @mousedown="dragStartPosition($event, 'border', 'top')",
                            @mouseover.self="over('border', 'top')")

                            dt.top(
                            v-html="borderTop",
                            @mousedown="dragStartPosition($event, 'border', 'top')")

                            dt.right-resize.border(
                            @mousedown="dragStartPosition($event, 'border', 'right')",
                            @mouseover.self="over('border', 'right')")

                            dt.right(
                            v-html="borderRight",
                            @mousedown="dragStartPosition($event, 'border', 'right')")

                            dt.bottom-resize(
                            @mousedown="dragStartPosition($event, 'border', 'bottom')",
                            @mouseover.self="over('border', 'bottom')")

                            dt.bottom(
                            v-html="borderBottom",
                            @mousedown="dragStartPosition($event, 'border', 'bottom')")

                            dt.left-resize.border(
                            @mousedown="dragStartPosition($event, 'border', 'left')",
                            @mouseover.self="over('border', 'left')")

                            dt.left(
                            v-html="borderLeft",
                            @mousedown="dragStartPosition($event, 'border', 'left')")

                        .inner
                            .box-outline.padding(
                            :class="paddingClass",
                            @mouseover.self="over('padding')")
                                label
                                    a(@click="") Padding

                                dl
                                    dt.top-resize.padding(
                                    @mousedown="dragStartPosition($event, 'padding', 'top')", @mouseover.self="over('padding', 'top')")

                                    dt.top(
                                    v-html="paddingTop",
                                    @mousedown="dragStartPosition($event, 'padding', 'top')")

                                    dt.right-resize.padding(
                                    @mousedown="dragStartPosition($event, 'padding', 'right')" @mouseover.self="over('padding', 'right')")

                                    dt.right(
                                    v-html="paddingRight",
                                    @mousedown="dragStartPosition($event, 'padding', 'right')")

                                    dt.bottom-resize.padding(
                                    @mousedown="dragStartPosition($event, 'padding', 'bottom')" @mouseover.self="over('padding', 'bottom')")

                                    dt.bottom(
                                    v-html="paddingBottom",
                                    @mousedown="dragStartPosition($event, 'padding', 'bottom')")

                                    dt.left-resize.padding(
                                    @mousedown="dragStartPosition($event, 'padding', 'left')",
                                    @mouseover.self="over('padding', 'left')")

                                    dt.left(
                                    v-html="paddingLeft",
                                    @mousedown="over($event, 'padding', 'left')")
</template>

<script>
import utils from '../../utils.js'
import accordionItem from '../accordion/Item.vue'
export default {
    name: 'BoxProperties',
    components: {accordionItem},
    data () {
        return {
            mouseState: '',
            dragState: false,
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
        positionTop () {
            if (this.positionValue !== 'relative') {
                let positionTop = this.getPositionProp(`settings.${this.positionValue}.top`)
                if (positionTop) {
                    return positionTop.value + positionTop.unit
                }
            }
        },

        /**
         * Position right value based on settings (absolute|fixed)
         * @return {String}
         */
        positionRight () {
            if (this.positionValue !== 'relative') {
                let positionRight = this.getPositionProp(`settings.${this.positionValue}.right`)
                if (positionRight) {
                    return positionRight.value + positionRight.unit
                }
            }
        },

        /**
         * Position bottom value based on settings (absolute|fixed)
         * @return {String}
         */
        positionBottom () {
            if (this.positionValue !== 'relative') {
                let positionBottom = this.getPositionProp(`settings.${this.positionValue}.bottom`)
                if (positionBottom) {
                    return positionBottom.value + positionBottom.unit
                }
            }
        },

        /**
         * Position left value based on settings (absolute|fixed)
         * @return {String}
         */
        positionLeft () {
            if (this.positionValue !== 'relative') {
                let positionLeft = this.getPositionProp(`settings.${this.positionValue}.left`)
                if (positionLeft) {
                    return positionLeft.value + positionLeft.unit
                }
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
        marginTop () {
            let marginTop = this.getMarginProp('top')
            if (marginTop) {
                return marginTop.value + marginTop.unit
            }
        },

        /**
         * Margin right value
         * @return {String}
         */
        marginRight () {
            let marginRight = this.getMarginProp('right')
            if (marginRight) {
                return marginRight.value + ' ' + marginRight.unit
            }
        },

        /**
         * Margin bottom value
         * @return {String}
         */
        marginBottom () {
            let marginBottom = this.getMarginProp('bottom')
            if (marginBottom) {
                return marginBottom.value + marginBottom.unit
            }
        },

        /**
         * Margin left value
         * @return {String}
         */
        marginLeft () {
            let marginLeft = this.getMarginProp('left')
            if (marginLeft) {
                return marginLeft.value + ' ' + marginLeft.unit
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
        borderTop () {
            let borderTop = this.getMarginProp('top')
            if (borderTop) {
                return borderTop.value + borderTop.unit
            }
        },

        /**
         * Border right value
         * @return {String}
         */
        borderRight () {
            let borderRight = this.getMarginProp('right')
            if (borderRight) {
                return borderRight.value + ' ' + borderRight.unit
            }
        },

        /**
         * Border bottom value
         * @return {String}
         */
        borderBottom () {
            let borderBottom = this.getMarginProp('bottom')
            if (borderBottom) {
                return borderBottom.value + borderBottom.unit
            }
        },

        /**
         * Border left value
         * @return {String}
         */
        borderLeft () {
            let borderLeft = this.getMarginProp('left')
            if (borderLeft) {
                return borderLeft.value + ' ' + borderLeft.unit
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
        paddingTop () {
            let paddingTop = this.getMarginProp('top')
            if (paddingTop) {
                return paddingTop.value + paddingTop.unit
            }
        },

        /**
         * Padding right value
         * @return {String}
         */
        paddingRight () {
            let paddingRight = this.getMarginProp('right')
            if (paddingRight) {
                return paddingRight.value + ' ' + paddingRight.unit
            }
        },

        /**
         * Padding bottom value
         * @return {String}
         */
        paddingBottom () {
            let paddingBottom = this.getMarginProp('bottom')
            if (paddingBottom) {
                return paddingBottom.value + paddingBottom.unit
            }
        },

        /**
         * Padding left value
         * @return {String}
         */
        paddingLeft () {
            let paddingLeft = this.getMarginProp('left')
            if (paddingLeft) {
                return paddingLeft.value + ' ' + paddingLeft.unit
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
         * Get border properties
         * @param  {String} value
         * @return {Object} [{value: Integer, unit: String}]
         */
        getBorderProp (value) {
            let key = 'border' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
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
         * When mouse hovering layout
         * @param  {String} layout
         * @param  {String} direction
         * @return {void}
         */
        over (layout, direction = '') {
            if (! this.dragState) {
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
            if (! this.dragState) {
                for (let item in this.overOutline) {
                    this.overOutline[item].hover = false
                    this.overOutline[item].direction = ''
                }
            }
        },

        dragStartPosition () {},
    }
}
</script>
