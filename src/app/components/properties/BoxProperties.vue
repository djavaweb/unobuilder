<template lang="pug">
accordion-item(title="Box Properties", :mouse-state.sync="mouseState")
    // Position
    .box-outline(
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
            .box-outline.margin(@mouseover.self="over('margin')")
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
                    .box-outline.border(@mouseover.self="over('border')")
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
                            .box-outline.padding(@mouseover.self="over('padding')")
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
            mouseState: 'none'
        }
    },

    computed: {
        positionValue () {
            return this.getPositionProp('value')
        },

        positionTop () {
            if (this.positionValue !== 'relative') {
                let positionTop = this.getPositionProp(`settings.${this.positionValue}.top`)
                if (positionTop) {
                    return positionTop.value + positionTop.unit
                }
            }
        },

        positionRight () {
            if (this.positionValue !== 'relative') {
                let positionRight = this.getPositionProp(`settings.${this.positionValue}.right`)
                if (positionRight) {
                    return positionRight.value + positionRight.unit
                }
            }
        },

        positionBottom () {
            if (this.positionValue !== 'relative') {
                let positionBottom = this.getPositionProp(`settings.${this.positionValue}.bottom`)
                if (positionBottom) {
                    return positionBottom.value + positionBottom.unit
                }
            }
        },

        positionLeft () {
            if (this.positionValue !== 'relative') {
                let positionLeft = this.getPositionProp(`settings.${this.positionValue}.left`)
                if (positionLeft) {
                    return positionLeft.value + positionLeft.unit
                }
            }
        },

        marginTop () {
            let marginTop = this.getMarginProp('top')
            if (marginTop) {
                return marginTop.value + marginTop.unit
            }
        },

        marginRight () {
            let marginRight = this.getMarginProp('right')
            if (marginRight) {
                return marginRight.value + ' ' + marginRight.unit
            }
        },

        marginBottom () {
            let marginBottom = this.getMarginProp('bottom')
            if (marginBottom) {
                return marginBottom.value + marginBottom.unit
            }
        },

        marginLeft () {
            let marginLeft = this.getMarginProp('left')
            if (marginLeft) {
                return marginLeft.value + ' ' + marginLeft.unit
            }
        },

        borderTop () {
            let borderTop = this.getMarginProp('top')
            if (borderTop) {
                return borderTop.value + borderTop.unit
            }
        },

        borderRight () {
            let borderRight = this.getMarginProp('right')
            if (borderRight) {
                return borderRight.value + ' ' + borderRight.unit
            }
        },

        borderBottom () {
            let borderBottom = this.getMarginProp('bottom')
            if (borderBottom) {
                return borderBottom.value + borderBottom.unit
            }
        },

        borderLeft () {
            let borderLeft = this.getMarginProp('left')
            if (borderLeft) {
                return borderLeft.value + ' ' + borderLeft.unit
            }
        },

        paddingTop () {
            let paddingTop = this.getMarginProp('top')
            if (paddingTop) {
                return paddingTop.value + paddingTop.unit
            }
        },

        paddingRight () {
            let paddingRight = this.getMarginProp('right')
            if (paddingRight) {
                return paddingRight.value + ' ' + paddingRight.unit
            }
        },

        paddingBottom () {
            let paddingBottom = this.getMarginProp('bottom')
            if (paddingBottom) {
                return paddingBottom.value + paddingBottom.unit
            }
        },

        paddingLeft () {
            let paddingLeft = this.getMarginProp('left')
            if (paddingLeft) {
                return paddingLeft.value + ' ' + paddingLeft.unit
            }
        }
    },

    methods: {
        getPositionProp (value) {
            return this.$root.elementSelector().getProp(`position.${value}`, this.mouseState)
        },

        setPositionProp (key, value) {
            this.$root.elementSelector().setProp(`position.${key}`, value, this.mouseState)
        },

        isPositionValue (position) {
            return this.positionValue === position
        },

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

        getMarginProp (value) {
            let key = 'margin' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        getBorderProp (value) {
            let key = 'border' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        getPaddingProp (value) {
            let key = 'padding' + utils.capitalize(value)
            return this.$root.elementSelector().getProp(`${key}`, this.mouseState)
        },

        dragStartPosition () {},
        over () {},
        leave () {}
    }
}
</script>
