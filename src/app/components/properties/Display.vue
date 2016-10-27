<template lang="pug">
accordion-item(title="Display", :mouse-state.sync="mouseState", :advanced.sync="advanced")
    // Buttons
    accordion-item-view
        .uk-grid.uk-grid-small
            .uk-width-2-5
                label.bold Select Type

            .uk-width-3-5
                .button-group.right
                    rect-button.display-block(:disabled="isDisabled()",
                    :active="isValue('block') && !isDisabled()",
                    @click="setValue('block')")

                    rect-button.display-flex(:disabled="isDisabled()",
                    :active="isValue('flex') && !isDisabled()",
                    @click="setValue('flex')",
                    v-show="advanced")

                    rect-button.display-none(:disabled="isDisabled()",
                    :active="isValue('none') && !isDiabled()",
                    @click="setValue('none')")

    // Flex Properties
    accordion-expand-view(v-if="(isKind('section') || isKind('container') || isKind('column')) || (isValue('flex') || isParentValue('flex'))")
        // Flex for current element
        accordion-item-view(title="Flex Layout Settings", v-if="isValue('flex') && advanced")

            // Default flex properties
            .flex-layout
                .flex-row-column
                    rect-button.flex-row(:class="{'flex-row--reverse': getProp('settings.flex.container.reverse')}",
                    :active="isProp('settings.flex.container.direction', 'row')",
                    @click="setProp('settings.flex.container.direction', 'row')")

                    rect-button.flex-column(:class="{'flex-column--reverse': getProp('settings.flex.container.reverse')}",
                    :active="isProp('settings.flex.container.direction', 'column')",
                    @click="setProp('settings.flex.container.direction', 'column')")

                .flex-buttons
                    rect-button(:class="flexDirClass('justify', 'start')",
                    :active="isProp('settings.flex.container.justifyContent', 'flex-start')",
                    @click="setProp('settings.flex.container.justifyContent', 'flex-start')")

                    rect-button(:class="flexDirClass('justify', 'center')",
                    :active="isProp('settings.flex.container.justifyContent', 'center')",
                    @click="setProp('settings.flex.container.justifyContent', 'center')")

                    rect-button(:class="flexDirClass('justify', 'end')",
                    :active="isProp('settings.flex.container.justifyContent', 'flex-end')",
                    @click="setProp('settings.flex.container.justifyContent', 'flex-end')")

                    rect-button(:class="flexDirClass('justify', 'space-between')",
                    :active="isProp('settings.flex.container.justifyContent', 'space-between')",
                    @click="setProp('settings.flex.container.justifyContent', 'space-between')")

                    rect-button(:class="flexDirClass('justify', 'space-around')",
                    :active="isProp('settings.flex.container.justifyContent', 'space-around')",
                    @click="setProp('settings.flex.container.justifyContent', 'space-around')")

                    rect-button(:class="flexDirClass('align', 'start')",
                    :active="isProp('settings.flex.container.alignItems', 'flex-start')",
                    @click="setProp('settings.flex.container.alignItems', 'flex-start')")

                    rect-button(:class="flexDirClass('align', 'center')",
                    :active="isProp('settings.flex.container.alignItems', 'center')",
                    @click="setProp('settings.flex.container.alignItems', 'center')")

                    rect-button(:class="flexDirClass('align', 'end')",
                    :active="isProp('settings.flex.container.alignItems', 'flex-end')",
                    @click="setProp('settings.flex.container.alignItems', 'flex-end')")

                    rect-button(:class="flexDirClass('align', 'stretch')",
                    :active="isProp('settings.flex.container.alignItems', 'stretch')",
                    @click="setProp('settings.flex.container.alignItems', 'stretch')")

                    rect-button(:class="flexDirClass('align', 'baseline')",
                    :active="isProp('settings.flex.container.alignItems', 'baseline')",
                    @click="setProp('settings.flex.container.alignItems', 'baseline')")

                .flex-reverse
                    rect-button.flex-reverse--row(
                    v-if="isProp('settings.flex.container.direction', 'row')",
                    :active="isProp('settings.flex.container.reverse')",
                    @click="setProp('settings.flex.container.reverse', !getProp('settings.flex.container.reverse'))")

                    rect-button.flex-reverse--col(
                    v-if="isProp('settings.flex.container.direction', 'column')",
                    :active="isProp('settings.flex.container.reverse')"
                    @click="setProp('settings.flex.container.reverse', !getProp('settings.flex.container.reverse'))")

            // Flex Wrap
            .flex-wrap-layout
                .flex-wrap
                    rect-button.flex-wrap(
                    :class="flexDirClass('wrap')",
                    :active="getProp('settings.flex.container.wrap')",
                    @click="setProp('settings.flex.container.wrap', !getProp('settings.flex.container.wrap'))")

                .flex-wrap-buttons(v-if="getProp('settings.flex.container.wrap')")
                    rect-button(:class="flexWrapClass('align', 'start')",
                    :active="isProp('settings.flex.container.alignContent', 'flex-start')",
                    @click="setProp('settings.flex.container.alignContent', 'flex-start')")

                    rect-button(:class="flexWrapClass('align', 'center')",
                    :active="isProp('settings.flex.container.alignContent', 'center')",
                    @click="setProp('settings.flex.container.alignContent', 'center')")

                    rect-button(:class="flexWrapClass('align', 'end')",
                    :active="isProp('settings.flex.container.alignContent', 'flex-end')",
                    @click="setProp('settings.flex.container.alignContent', 'flex-end')")

                    rect-button(:class="flexWrapClass('align', 'stretch')",
                    :active="isProp('settings.flex.container.alignContent', 'stretch')",
                    @click="setProp('settings.flex.container.alignContent', 'stretch')")

                    rect-button(:class="flexWrapClass('align', 'space-between')",
                    :active="isProp('settings.flex.container.alignContent', 'space-between')",
                    @click="setProp('settings.flex.container.alignContent', 'space-between')")

                    rect-button(:class="flexWrapClass('align', 'space-around')",
                    :active="isProp('settings.flex.container.alignContent', 'space-around')",
                    @click="setProp('settings.flex.container.alignContent', 'space-around')")

                .flex-reverse(v-if="isProp('settings.flex.container.wrap')")
                    rect-button.flex-reverse--wrap-row(
                    v-if="isProp('settings.flex.container.direction', 'row')",
                    :active="getProp('settings.flex.container.reverseWrap')",
                    @click="setProp('settings.flex.container.reverseWrap', !getProp('settings.flex.container.reverseWrap'))")

                    rect-button.flex-reverse--wrap-col(
                    v-if="isProp('settings.flex.container.direction', 'column')",
                    :active="getProp('settings.flex.container.reverseWrap')",
                    @click="setProp('settings.flex.container.reverseWrap', !getProp('settings.flex.container.reverseWrap'))")

        // Flex for childrens
        accordion-item-view(title="Flex Child Settings", v-if="isParentValue('flex') && advanced", border="top", :with-border="isValue('flex')")
            .flex-child-settings
                .label-group
                    label.input-label Sizing
                    label.input-label Align
                    label.input-label Order

                .flex-child-buttons
                    .flex
                        rect-button.flex-wrap(
                        :active="isProp('settings.flex.item.sizing.value', 'flexShrink')", @click="setProp('settings.flex.item.sizing.value', 'flexShrink')")

                        rect-button.fill-empty-space(
                        :active="isProp('settings.flex.item.sizing.value', 'flexGrow')",
                        @click="setProp('settings.flex.item.sizing.value', 'flexGrow')")

                        rect-button.dont-shrink(
                        :active="isProp('settings.flex.item.sizing.value', 'none')"
                        @click="setProp('settings.flex.item.sizing.value', 'none')")

                        rect-button.settings(
                        :active="isProp('settings.flex.item.sizing.value', 'custom')",
                        @click="setProp('settings.flex.item.sizing.value', 'custom')")

                    .flex
                        rect-button.align-self-start(
                        :active="isProp('settings.flex.item.alignSelf', 'flex-start')"
                        @click="setProp('settings.flex.item.alignSelf', 'flex-start')")

                        rect-button.align-self-center(
                        :active="isProp('settings.flex.item.alignSelf', 'center')",
                        @click="setProp('settings.flex.item.alignSelf', 'center')")

                        rect-button.align-self-end(
                        :active="isProp('settings.flex.item.alignSelf', 'flex-end')",
                        @click="setProp('settings.flex.item.alignSelf', 'flex-end')")

                        rect-button.align-self-stretch(
                        :active="isProp('settings.flex.item.alignSelf', 'stretch')",
                        @click="setProp('settings.flex.item.alignSelf', 'stretch')")

                        rect-button.align-self-baseline(
                        :active="isProp('settings.flex.item.alignSelf', 'baseline')",
                        @click="setProp('settings.flex.item.alignSelf', 'baseline')")

                    .flex
                        rect-button.auto(
                        :active="isProp('settings.flex.item.order.value', 'auto')",
                        @click="setProp('settings.flex.item.order.value', 'auto')")

                        rect-button.order-first(
                        :active="isProp('settings.flex.item.order.value', 'first')",
                        @click="setProp('settings.flex.item.order.value', 'first')")

                        rect-button.order-last(
                        :active="isProp('settings.flex.item.order.value', 'last')",
                        @click="setProp('settings.flex.item.order.value', 'last')")

                        rect-button.settings(
                        :active="isProp('settings.flex.item.order.value', 'custom')",
                        @click="setProp('settings.flex.item.order.value', 'custom')")

        // Gutter
        accordion-item-view(v-if="isKind('section') || isKind('container') || isKind('column')" border="top", :with-border="isValue('flex')")
            .uk-grid.uk-grid-small
                .uk-width-3-6
                    label.input-label Grid gutter

                .uk-width-3-6
                    .button-group.right
                        rect-button.gutter-large(
                        :active="isGutter('large')",
                        @click="setGutter('large')")

                        rect-button.gutter-medium(
                        :active="isGutter('medium')",
                        @click="setGutter('medium')")

                        rect-button.gutter-small(
                        :active="isGutter('small')"
                        @click="setGutter('small')")

                        rect-button.gutter-collapse(
                        :active="isGutter('collapse')"
                        @click="setGutter('collapse')")
</template>

<script>
import accordionItem from '../accordion/Item.vue'
import accordionItemView from '../accordion/ItemView.vue'
import accordionExpandView from '../accordion/ExpandView.vue'
import rectButton from '../form/RectButton.vue'
import dot from 'dot-object'
export default {
    name: 'display',
    components: {
        accordionItem,
        accordionItemView,
        accordionExpandView,
        rectButton
    },
    data () {
        return {
            mouseState: '',
            advanced: true
        }
    },

    methods: {
        isDisabled () {
            return this.getProp('disabled')
        },

        getProp (value) {
            return this.$root.elementSelector().getProp(`display.${value}`, this.mouseState)
        },

        setProp (key, value) {
            if (! this.getProp('disabled')) {
                this.$root.elementSelector().setProp(`display.${key}`, value, this.mouseState)
            }
        },

        isProp (value, equals) {
            let prop = this.getProp(value)

            if (equals) {
                return prop === equals
            }

            return prop
        },

        setValue (value) {
            this.setProp('value', value)
        },

        isValue (value) {
            return this.isProp('value', value)
        },

        /**
		 * Generate flex buttons class for flex-direction
		 * @param  {String} prefix
		 * @param  {String} suffix
		 * @return {Object} klass
		 */
		flexDirClass (prefix, suffix) {
			let direction = this.getProp('settings.flex.container.direction'),
			reverse = this.getProp('settings.flex.container.reverse'),
            klass = []

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
		 * Generate flex buttons class for flex-wrap and align-items
		 * @param  {String} prefix
		 * @param  {String} suffix
		 * @return {Object}
		 */
		flexWrapClass (prefix, suffix) {
			let direction = this.getProp('settings.flex.container.direction'),
            klass = []

            if (prefix) {
				prefix = '--' + prefix
			}

			if (suffix) {
				suffix = '-' + suffix
			} else {
				suffix = ''
			}

			if (this.getProp('settings.flex.container.reverseWrap')) {
				suffix += '-reverse'
			}

			klass.push('flex-wrap-' + direction + prefix + suffix)
			return klass
		},

        isKind (kind) {
            return this.$root.elementSelector().isKind(kind)
        },

        isParentValue (value) {
            let selector = this.$root.elementSelector()
			if (selector.activeElement) {
				let parentElement = selector.activeElement.$parentElement()
				if (parentElement) {
                    let parentValue = parentElement.$get('display.value', this.mouseState)
					return parentValue === value
				}
			}
        },

        isGutter (equalsTo) {
            let selector = this.$root.elementSelector(), gutter = 'large'
            if (selector.activeElement) {
                gutter = selector.getProp('gutter.value', this.mouseState)
            }

            return gutter === equalsTo
        },

        setGutter (value) {
            this.$root.canvasBuilder().layout().setGutter(value, this.mouseState)
        }
    }
}
</script>
