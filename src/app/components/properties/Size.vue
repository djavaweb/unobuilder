<template lang="pug">
accordion-item(title="size", :mouse-state.sync="mouseState", :advanced.sync="advanced")
  accordion-item-view
    .uk-grid.uk-grid-small
      .uk-width-5-10
        input-number(
        label="Width",
        :value.sync="width",
        :unit.sync="widthUnit",
        :disabled="widthDisabled",
        :min="0",
        :max="1000")

        input-number(
        label="Min",
        :value.sync="minWidth",
        :unit.sync="minWidthUnit",
        :disabled="minWidthDisabled",
        :min="0",
        :max="1000",
        v-if="advanced")

        input-number(
        label="Max",
        :value.sync="maxWidth",
        :unit.sync="maxWidthUnit",
        :disabled="maxWidthDisabled",
        :min="0",
        :max="1000",
        v-if="advanced")

      .uk-width-5-10
        input-number(
        label="Height",
        :value.sync="height",
        :unit.sync="heightUnit",
        :disabled="heightDisabled",
        :min="0",
        :max="1000")

        input-number(
        label="Min",
        :value.sync="minHeight",
        :unit.sync="minHeightUnit",
        :disabled="minHeightDisabled",
        :min="0",
        :max="1000",
        v-if="advanced")

        input-number(
        label="Max",
        :value.sync="maxHeight",
        :unit.sync="maxHeightUnit",
        :disabled="maxHeightDisabled",
        :min="0",
        :max="1000",
        v-if="advanced")
</template>

<script>
import accordionItem from '../accordion/Item.vue'
import accordionItemView from '../accordion/ItemView.vue'
import inputNumber from '../form/InputNumber.vue'

export default {
    name: 'size',
    components: {
      accordionItem,
      accordionItemView,
      inputNumber
    },

    data () {
      return {
        mouseState: '',
        advanced: false
      }
    },

    computed: {
      width: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('width.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('width.value', val, this.mouseState)
        }
      },
      widthUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('width.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('width.unit', val, this.mouseState)
        }
      },
      widthDisabled () {
        return this.$root.elementSelector().getProp('width.disabled', this.mouseState)
      },

      minWidth: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('minWidth.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('minWidth.value', val, this.mouseState)
        }
      },
      minWidthUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('minWidth.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('minWidth.unit', val, this.mouseState)
        }
      },
      minWidthDisabled () {
        return this.$root.elementSelector().getProp('minWidth.disabled', this.mouseState)
      },

      maxWidth: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('maxWidth.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('maxWidth.value', val, this.mouseState)
        }
      },
      maxWidthUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('maxWidth.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('maxWidth.unit', val, this.mouseState)
        }
      },
      maxWidthDisabled () {
        return this.$root.elementSelector().getProp('maxWidth.disabled', this.mouseState)
      },


      height: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('height.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('height.value', val, this.mouseState)
        }
      },
      heightUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('height.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('height.unit', val, this.mouseState)
        }
      },
      heightDisabled () {
        return this.$root.elementSelector().getProp('height.disabled', this.mouseState)
      },

      minHeight: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('minHeight.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('minHeight.value', val, this.mouseState)
        }
      },
      minHeightUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('minHeight.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('minHeight.unit', val, this.mouseState)
        }
      },
      minHeightDisabled () {
        return this.$root.elementSelector().getProp('minHeight.disabled', this.mouseState)
      },

      maxHeight: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('maxHeight.value', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('maxHeight.value', val, this.mouseState)
        }
      },
      maxHeightUnit: {
        get () {
            return this.$root
            .elementSelector()
            .getProp('maxHeight.unit', this.mouseState)
        },

        set (val) {
            this.$root
            .elementSelector()
            .setProp('maxHeight.unit', val, this.mouseState)
        }
      },
      maxHeightDisabled () {
        return this.$root.elementSelector().getProp('maxHeight.disabled', this.mouseState)
      },
    }
}
</script>
