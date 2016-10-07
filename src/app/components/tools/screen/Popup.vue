<template lang="pug">
.popup
    .popup-inner
        a.popup-close.uk-icon-close(@click="onClose()")
        .popup-title(v-if="title", v-html="title")
        .popup-html
            slot
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

        close: {
            type: Function
        }
    },

    methods: {
        onClose () {
            this.close && this.close()
        }
    }
}
</script>
