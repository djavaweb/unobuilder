<template lang="pug">
.accordion-wrapper(:class="{'accordion-wrapper--disabled': disabled}")
  .switcher-handler(v-if="shouldDisplaySwitch || shouldDisplayMouseState")
    switcher(v-if="shouldDisplaySwitch", :value.sync="advanced", label="Advanced")
    a.mouse-state-toggler(v-if="shouldDisplayMouseState", @click="toggleMouseState()")

  h3.accordion-title(:class="{'uk-accordion-title': !disabled}")
    .uk-icon-caret-right
    .uk-icon-caret-down
    span.accordion-title__content {{title}}

  .uk-accordion-content
    .mouse-state-properties(v-if="shouldDisplayMouseState && chooseMouseState")
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

      disabled: {
        type: Boolean,
        default: false
      },

      advanced: {},
      mouseState: {
        type: String
      }
    },

    data () {
      return {
        chooseMouseState: false
      }
    },

    computed: {
      shouldDisplaySwitch () {
        return ! this.disabled && this.advanced !== undefined
      },

      shouldDisplayMouseState () {
        return ! this.disabled && this.mouseState !== undefined
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
          this.chooseMouseState = !this.chooseMouseState
      }
    }
}
</script>
