<script>
/* eslint-disable no-unused-vars */
import Label from './Label'
import {ClassPrefix} from '../../const'
import {SVGIcon} from '../../utils/common'

const mainClass = `${ClassPrefix.FIELDS}--row`

export default {
  name: 'row',
  props: {
    label: {
      type: Object
    }
  },
  render (h) {
    let {labelEl, icon} = {}

    if (this.label) {
      labelEl = <Label class="label" {...{props: this.label}} />
    }

    if (this.icon) {
      icon = <span class="label" domPropsInnerHTML={SVGIcon(this.icon)} />
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
