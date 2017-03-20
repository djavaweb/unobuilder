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
    }
  },
  render (h) {
    let {labelEl, icon} = {}

    if (this.label) {
      labelEl = <Label class="label" {...{props: this.label}} />
    }

    if (this.icon) {
      icon = <label class="icon" domPropsInnerHTML={SVGIcon(this.icon)} />
    }

    const slot = this.$slots.default ? this.$slots.default : null

    return (
      <div class={mainClass}>
        {labelEl} {icon} {slot}
      </div>
    )
  }
}
</script>
