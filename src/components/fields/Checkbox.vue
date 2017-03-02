<script>
import {ClassPrefix, Labels} from '../../const'

const mainClass = `${ClassPrefix.FIELDS}--checkbox`

export default {
  name: 'checkbox',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: Labels.UNTITLED
    }
  },
  render (h) {
    return (
      <div class={mainClass}>
        <input type="checkbox" checked={this.active} />
        <span class="icon" uk-icon="icon: check" />
        <span class="label">{this.label}</span>
      </div>
    )
  }
}
</script>
