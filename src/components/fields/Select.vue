<script>
/* eslint-disable no-unused-vars */
import {ClassPrefix, Labels} from '../../const'

const mainClass = `${ClassPrefix.FIELDS}--select`

export default {
  name: 'select',
  props: {
    options: {
      type: Array,
      default: () => [Labels.NO_ITEMS]
    }
  },
  render (h) {
    const props = {
      options: this.options,
      selectedLabel: Labels.EMPTY,
      selectLabel: Labels.EMPTY,
      deselectLabel: Labels.EMPTY,
      maxHeight: 120
    }

    return (
      <div>
      </div>
      // <Multiselect class={mainClass} {...{props}}>
      //   <span slot="noResult">{Labels.NO_ITEMS}</span>
      // </Multiselect>
    )
  }
}
</script>
