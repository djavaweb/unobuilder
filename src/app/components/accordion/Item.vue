<template lang="pug">
.accordion-wrapper
  .switcher-handler(v-if="advanced!==undefined||mouseState!==undefined")
    switcher(v-if="advanced!==undefined",:value.sync="advanced", label="Advanced")
    a.mouse-state-toggler(v-if="mouseState!==undefined", @click="toggleMouseState()")

  h3.uk-accordion-title
    .uk-icon-caret-right
    .uk-icon-caret-down
    span {{title}}

  .uk-accordion-content
    .mouse-state-properties(v-if="mouseState!==undefined && displayMouseState")
      a(@click="setMouseState('')", :class="{active: isMouseState('')}") none
      a(@click="setMouseState('hover')", :class="{active: isMouseState('hover')}") hover
      a(@click="setMouseState('active')", :class="{active: isMouseState('active')}") active
      a(@click="setMouseState('focus')", :class="{active: isMouseState('focus')}") focus
    slot
</template>

<script>
import switcher from '../form/Switcher.vue'
export default {
    name: 'accordionItem',

    components: {
        switcher
    },

    props: {
        title: {
            required: true,
            type: String,
            default: 'Untitled'
        },

        advanced: {},
        mouseState: {
            type: String
        }
    },

    data () {
        return {
            displayMouseState: false
        }
    },

    methods: {
        isMouseState (state) {
            return this.mouseState === state
        },

        setMouseState (state) {
            this.mouseState = state
        },

        toggleMouseState () {
            this.displayMouseState = !this.displayMouseState
        }
    }
}
</script>
