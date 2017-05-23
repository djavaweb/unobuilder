<script>
import { ClassPrefix, Labels } from '../../const'

/* eslint-disable no-unused-vars */
import Colorpicker from 'vue-sketch-color-picker'
import Button from '../fields/Button'

const mainClass = `${ ClassPrefix.FIELDS }--color-picker`
const boxClass = `${ mainClass }__box`
const overlayClass = `${ ClassPrefix.RIGHT_PANEL }__overlay`

export default {
  name: 'Colorpicker',
  props: {
    popup: {
      type: Boolean,
      defalut: true
    },
    colors: {
      type: Object
    }
  },

  data () {
    return {
      display: false,
      colorModel: undefined
    }
  },

  created () {
    const defaultColor = {
      hex: '#000000',
      hsl: {
        h: 0,
        s: 0,
        l: 0,
        a: 0
      },
      hsv: {
        h: 0,
        s: 0,
        v: 1,
        a: 0
      },
      rgba: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      },
      a: 0
    }
    this.colorModel = (this.colors && this.colors.rgba) ? this.colors : defaultColor
  },

  computed: {
    value: {
      get () {
        if (this.colorModel && this.colorModel.rgba) {
          return this.colorModel
        }

        return this.colors
      },

      set (value) {
        if (value && value.rgba) {
          this.colorModel = value
        }
      }
    }
  },

  methods: {
    update (color, oldColor) {
      this.value = color
      this.$emit('update', color, oldColor)
    },
    change (color) {
      this.value = color
      this.$emit('change', color)
    },
    openPopup () {
      this.display = !this.display
    },
    closePopup (event) {
      if (event.target !== event.currentTarget) return
      this.hidePopup()
    },
    hidePopup () {
      this.display = false
    }
  },

  render (h) {
    let boxPicker
    if (this.popup) {
      const boxStyles = {
        backgroundColor: this.colorModel.hex
      }
      boxPicker = <a class={ boxClass } style={ boxStyles } onClick={ this.openPopup }></a>
    }

    console.log('sdfdsf', this.colorModel)
    const sketchColorPicker = <Colorpicker scheme='dark' on-update={ this.update } on-change={ this.change } colors={ this.value } />
    let colorPickerWrapper = sketchColorPicker

    if (this.popup && this.display) {
      colorPickerWrapper = <div class={ overlayClass } onClick={ this.closePopup }>
        { sketchColorPicker }
        <Button nativeOnClick={ this.hidePopup } label={ Labels.OK } />
      </div>
    }

    return (
      <div class={ mainClass }> { boxPicker } { colorPickerWrapper }</div>
    )
  }
}
</script>
