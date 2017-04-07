<script>
import { ClassPrefix } from '../../const'

const mainClass = `${ ClassPrefix.FIELDS }--switcher`

export default {
  name: 'switcher',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  render (h) {
    return (
      <span class={[mainClass, { 'switcher--checked': this.active }]} />
    )
  }
}
</script>
