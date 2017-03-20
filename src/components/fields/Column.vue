<script>
/* eslint-disable no-unused-vars */
import Label from './Label'
import {ClassPrefix} from '../../const'
import {SVGIcon} from '../../utils'

const mainClass = `${ClassPrefix.FIELDS}--column`

export default {
  name: 'column',
  props: {
    label: {
      type: Object
    },
    icon: {
      type: String
    },
    width: {
      type: Number
    }
  },
  render (h) {
    let {labelEl, icon} = {}
    const slot = this.$slots.default ? this.$slots.default : null

    if (this.label) {
      labelEl = <Label class="label" {...{props: this.label}} />
    }

    if (this.icon) {
      icon = <label class="icon" domPropsInnerHTML={SVGIcon(this.icon)} />
    }

    const styles = {}
    if (this.width && this.width > 0) {
      styles.width = `${this.width}px`
    }

    return (
      <div class={mainClass} style={styles}>
        {labelEl} {icon} {slot}
      </div>
    )
  }
}
</script>
