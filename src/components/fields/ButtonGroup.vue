<script>
/* eslint-disable no-unused-vars */
import Button from './Button'
import {ClassPrefix} from '../../const'

const mainClass = `${ClassPrefix.FIELDS}--button-group`

export default {
  name: 'buttonGroup',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  render (h) {
    const buttons = this.items.filter(item => item).map(props => {
      return <Button {...{props}} />
    })

    return (
      <div class={mainClass}>{buttons}</div>
    )
  }
}
</script>
