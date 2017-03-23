<script>
import {ClassPrefix, Labels} from '../../const'

/* eslint-disable no-unused-vars */
import Colorpicker from 'vue-sketch-color-picker'
import Button from '../fields/Button'

const mainClass = `${ClassPrefix.FIELDS}--color-picker`
const boxClass = `${mainClass}__box`
const overlayClass = `${ClassPrefix.RIGHT_PANEL}__overlay`

export default {
  name: 'Colorpicker',
  props: {
    popup: {
      type: Boolean,
      defalut: true
    },
    colors: {
      type: Object,
      default: () => {
        return {
          hex: '#ffffff',
          hsl: {
            h: 0,
            s: 0,
            l: 0,
            a: 1
          },
          hsv: {
            h: 0,
            s: 0,
            v: 1,
            a: 1
          },
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          },
          a: 1
        }
      }
    }
  },

  data () {
    return {
      display: false,
      currentColor: ''
    }
  },

  methods: {
    update (color) {
      this.$emit('update', color)
      this.currentColor = color
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

  created () {
    this.currentColor = this.colors
  },

  render (h) {
    let boxPicker
    if (this.popup) {
      const boxStyles = {
        backgroundColor: this.currentColor.hex
      }
      boxPicker = <a class={boxClass} style={boxStyles} onClick={this.openPopup}></a>
    }

    const sketchColorPicker = <Colorpicker scheme="dark" on-update={this.update} {...{props: {colors: this.colors}}} />
    let colorPicker

    if (!this.popup) {
      colorPicker = sketchColorPicker
    }

    if (this.popup && this.display) {
      colorPicker = <div class={overlayClass} onClick={this.closePopup}>
        {sketchColorPicker}
        <Button nativeOnClick={this.hidePopup} label={Labels.OK} />
      </div>
    }

    return (
      <div class={mainClass}> {boxPicker} {colorPicker}</div>
    )
  }
}
</script>
