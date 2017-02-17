<script>
import {ClassPrefix, Icons} from '../../const'
import {SVGIcon} from '../../utils'

const mainClass = `${ClassPrefix.FIELDS}--x`

export default {
  name: 'closeButton',
  render (h) {
    return (
      <a class={mainClass} domPropsInnerHTML={SVGIcon(Icons.CLOSE)} />
    )
  }
}
</script>
