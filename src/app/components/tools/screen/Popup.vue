<template lang="pug">
.popup(v-if="display")
    .popup-inner
        a.popup-close.uk-icon-close(@click="hide()")
        .popup-title(v-html="title")
        .popup-html
            slot
</template>

<script>
export default {
    name: 'popup',
    props: {
        title: {
            required: true,
            type: String,
            default: 'Untitled Popup'
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
        }
    }
}
</script>
