<script>
import { mapGetters } from 'vuex'
import { Icons, ClassPrefix } from '../../const'
import { SVGIcon } from '../../utils'

const mainClass = `${ ClassPrefix.MAIN }__text-toolbar`

export default {
  name: 'textToolbar',
  computed: {
    ...mapGetters([
      'textToolbarOffset'
    ])
  },
  render (h) {
    const { left, top } = this.textToolbarOffset
    const styles = {
      left: left + 'px',
      top: top + 'px'
    }
    return <div class={ mainClass } style={ styles }>
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_BOLD) } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_ITALIC) } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_STRIKETHROUGH) } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_ANCHOR) } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_COLOR_PICKER) } />
    </div>
  }
}
</script>
