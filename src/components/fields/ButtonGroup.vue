<script>
/* eslint-disable no-unused-vars */
import Button from './Button'
import {ClassPrefix, ButtonType} from '../../const'

const mainClass = `${ClassPrefix.FIELDS}--button-group`

export default {
  name: 'buttonGroup',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ButtonType.PRIMARY
    },
    size: {
      type: String
    }
  },
  render (h) {
    const buttons = this.items
      .filter(item => item)
      .map(props => {
        props.size = this.size
        props.type = this.type
        return <Button {...{props}} />
      })

    return (
      <div class={mainClass}>{buttons}</div>
    )
  }
}
</script>
