<script>
import { ClassPrefix, InputType } from '../../const'
const mainClass = `${ ClassPrefix.FIELDS }--text-box`
export default {
  name: 'textbox',
  props: {
    value: {
      type: String | Number
    },
    type: {
      type: String,
      default: InputType.Text
    }
  },
  render (h) {
    return (
      <input class={ mainClass } type={ this.type } value={ this.value } />
    )
  }
}
</script>
