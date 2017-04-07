<script>
import { ClassPrefix, Labels } from '../../const'
const mainClass = `${ ClassPrefix.FIELDS }--textarea`
export default {
  name: 'textarea',
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: Labels.EMPTY
    }
  },
  render (createElement) {
    return (
      <textarea class={ mainClass } placeholder={ this.placeholder }>
        { this.value }
      </textarea>
    )
  }
}
</script>
