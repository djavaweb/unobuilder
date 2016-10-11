<template lang="pug">
// Background
accordion-item(title="Background", :advanced.sync="advanced", :mouse-state.sync="mouseState")
    // Background Buttons
    accordion-item-view
        .uk-grid.uk-grid-collapse
            .uk-width-3-10
                label.input-label.bold Select Type

            .uk-width-7-10.uk-flex
                .button-group.right
                    rect-button.background-none(:disabled="isDisabled()", :active="isValue('none')", @click="setValue('none')")

                    rect-button.background-color(:disabled="isDisabled()", :active="isValue('color')", @click="setValue('color')")

                    rect-button.background-image(:disabled="isDisabled()", :active="isValue('image')", @click="setValue('image')")

                    rect-button.background-video(:disabled="isDisabled()", :active="isValue('video')", @click="setValue('video')")

                    rect-button.background-gradient(:disabled="isDisabled()", :active="isValue('gradient')", @click="setValue('gradient')")
    // End of background buttons

    // Background Properties Panel
    accordion-expand-view(v-if="!isValue('none')")
        accordion-item-view(v-if="isValue('color')")
            color-picker(:colors.sync="bgColor", scheme="dark", v-ref:color-picker)
    // End of background properties panel
// End of background
</template>

<script>
import colorPicker from 'vue-sketch-color-picker'
import accordionItem from '../accordion/Item.vue'
import accordionItemView from '../accordion/ItemView.vue'
import accordionExpandView from '../accordion/ExpandView.vue'
import rectButton from '../form/RectButton.vue'

export default {
    name: 'Background',
    components: {
        accordionItem,
        accordionItemView,
        accordionExpandView,
        rectButton,
        colorPicker
    },

    data () {
        return {
            mouseState: '',
            advanced: true
        }
    },

    computed: {
        bgColor: {
            get () {
                return this.getProp('settings.color')
            },

            set (value) {
                this.setProp('settings.color', value)
            }
        }
    },

    methods: {
        isDisabled () {
            return this.getProp('disabled')
        },

        getProp (value) {
            return this.$root.elementSelector().getProp(`background.${value}`, this.mouseState)
        },

        setProp (key, value) {
            if (! this.getProp('disabled')) {
                this.$root.elementSelector().setProp(`background.${key}`, value, this.mouseState)
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
        }
    }
}
</script>
