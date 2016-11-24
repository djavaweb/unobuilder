<template lang="pug">
// Topbar panel
.topbar-panel(@click="$root.closeAllPanels()")
    div &nbsp;

    // Screen size button
    .screen-view
        a(
        @click="setScreen('large')",
        :class="{active: isScreen('large')}"
        )
            i.uk-icon-laptop

        a(
        @click="setScreen('medium')",
        :class="{active: isScreen('medium')}"
        )
            i.uk-icon-tablet

        a(
        @click="setScreen('small')",
        :class="{active: isScreen('small')}"
        )
            i.uk-icon-mobile.horizontal

        a(
        @click="setScreen('mini')",
        :class="{active: isScreen('mini')}"
        )
            i.uk-icon-mobile
    // End of screen size button

    // Save view buttons
    .save-view-rollback
        a.button.unre-do
            i.uk-icon-mail-reply
        | &nbsp;
        a.button.unre-do
            i.uk-icon-mail-forward
        | &nbsp;
        a.button
            .uk-icon-eye
        | &nbsp;
        a.button
            .uk-icon-save
            | Save
    // End of save view buttons
// End of topbar panel
</template>

<script>
export default {
    name: 'topbarPanel',

    methods: {
        setScreen (size) {
          this.screenSize = size
          this.$root.canvasBuilder().layout().setScreenSize(size)
        },

        isScreen (size) {
          return this.screenSize === size
        }
    },

    data () {
        return {
            screenSize: 'large'
        }
    }
}
</script>
