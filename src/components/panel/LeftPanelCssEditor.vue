<script>
import { mapGetters, mapActions } from 'vuex'
import { ClassPrefix, PropertyPanelIds } from '../../const'
import ace from 'brace'
import 'brace/ext/language_tools'
import 'brace/mode/css'
import 'brace/theme/monokai'

const mainClass = `${ ClassPrefix.LEFT_PANEL }-css-editor`

export default {
  name: 'leftPanelCssEditor',
  computed: {
    ...mapGetters([
      'openLeftPanel',
      'toggleLeftPanel',
      'customStyles'
    ])
  },
  methods: {
    ...mapActions([
      'setCustomStyles'
    ])
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = ace.edit(this.$refs.editor)
    this.editor.$blockScrolling = Infinity
    this.editor.getSession().setMode('ace/mode/css')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.setOptions({
      enableLiveAutocompletion: true,
      showPrintMargin: false,
      wrap: true
    })
    this.editor.on('change', () => {
      this.setCustomStyles(this.editor.getValue())
    })
  },
  render (h) {
    const openPanel = this.openLeftPanel === PropertyPanelIds.CSS_EDITOR
    const classes = {
      'animate--fade-in': openPanel && this.toggleLeftPanel,
      'animate--fade-out': !openPanel || !this.toggleLeftPanel
    }

    // Little hacky here
    // using primitive method classList
    // to make perfect fade effects
    // add or remove .not-active class

    if (openPanel && this.toggleLeftPanel) {
      this.$refs.editorPanel.classList.remove('not-active')
      this.$nextTick(() => {
        this.editor.setValue(this.customStyles)
        this.editor.focus()
        this.editor.gotoLine(0)
        this.editor.navigateLineStart()
      })
    } else {
      setTimeout(() => {
        this.$refs.editorPanel.classList.add('not-active')
      }, 250)
    }

    return (
      <div ref='editorPanel' class={ [mainClass, classes] }>
        <div ref='editor'></div>
      </div>
    )
  }
}
</script>
