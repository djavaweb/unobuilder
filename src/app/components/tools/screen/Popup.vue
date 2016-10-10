<template lang="pug">
.popup(v-if="display")
    .popup-window(:class="class")
        .popup-inner
            a.popup-close.uk-icon-close(@click="hide()")
            .popup-title(v-if="title", v-html="title")
            .popup-html
                slot
                button(v-if="button", @click="hide()") {{button}}

    .popup-overlay(v-if="overlay", @click="hide()")
</template>

<style lang="sass">
@import "../../../scss/popup.scss"
</style>

<script>
export default {
    name: 'popup',
    props: {
        title: {
            type: String,
            default: 'Untitled Popup'
        },

        class: {
            type: String,
        },

        overlay: {
            type: Boolean,
            default: false
        },

        button: {
            type: String
        },

        onClose: {
            type: Function
        }
    },

    data () {
        return {
            display: false
        }
    },

    methods: {
        show () {
            this.display = true
        },

        hide () {
            this.display = false
            this.onClose && this.onClose()
        }
    }
}
</script>
