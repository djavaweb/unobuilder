<script>
import { ClassPrefix, Labels } from '../../const'

/* eslint-disable no-unused-vars */
import Label from '../fields/Label'

const mainClass = `${ ClassPrefix.ACCORDION }-content-item`

export default {
  name: 'accordionContent',
  props: {
    label: {
      type: String,
      default: Labels.EMPTY
    }
  },
  render (h) {
    let itemLabel

    if (this.label) {
      const props = {
        text: this.label,
        uppercase: true,
        bold: true
      }
      itemLabel = <Label { ...{ props } } />
    }

    return (
      <div class={ mainClass }>
        { itemLabel }
        { this.$slots.default }
      </div>
    )
  }
}
</script>
