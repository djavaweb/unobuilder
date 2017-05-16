<script>
import { mapGetters } from 'vuex'
import { Icons, ClassPrefix } from '../../const'
import { SVGIcon } from '../../utils'

const mainClass = `${ ClassPrefix.MAIN }__text-toolbar`

export default {
  name: 'textToolbar',
  computed: {
    ...mapGetters([
      'textToolbarOffset',
      'iframeDocument'
    ])
  },
  methods: {
    handleExec (cmdName, showUi = false, value) {
      return this.iframeDocument.execCommand(cmdName, showUi, value)
    }
  },
  render (h) {
    const { left, top } = this.textToolbarOffset
    const styles = {
      left: left + 'px',
      top: top + 'px'
    }

    const handleBold = () => {
      this.handleExec('bold')
    }

    const handleItalic = () => {
      this.handleExec('italic')
    }

    const handleStrikethrough = () => {
      this.handleExec('strikeThrough')
    }

    const handleAnchor = () => {

    }

    return <div class={ mainClass } style={ styles }>
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_BOLD) } onClick={ handleBold } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_ITALIC) } onClick={ handleItalic } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_STRIKETHROUGH) } onClick={ handleStrikethrough } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_ANCHOR) } onClick={ handleAnchor } />
      <button domPropsInnerHTML={ SVGIcon(Icons.TEXT_TOOLBAR_COLOR_PICKER) } onClick={ handleBold } />
    </div>
  }
}
</script>
