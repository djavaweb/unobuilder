<script>
import { ClassPrefix } from '../../const'

const mainClass = `${ ClassPrefix.ACCORDION }-content`

export default {
  name: 'accordionContent',
  render (h) {
    return (
      <div class={ mainClass }>
        { this.$slots.default }
      </div>
    )
  }
}
</script>
