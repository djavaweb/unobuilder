<script>
import {ClassPrefix} from '../../const'

export default {
  name: 'accordion',
  render (h) {
    return (
      <ul class={ClassPrefix.ACCORDION} uk-accordion="multiple: true">
        {this.$slots.default}
      </ul>
    )
  }
}
</script>
