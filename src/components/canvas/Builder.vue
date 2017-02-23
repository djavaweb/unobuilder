<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, RootElementTag} from '../../const'

/* eslint-disable no-unused-vars */
import Elements from './Elements'
import Stylesheet from './Stylesheet'

export default {
  name: 'canvasBuilder',
  computed: {
    ...mapGetters([
      'elements',
      'selectedElement',
      'previewMode',
      'customStyles'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels',
      'addElement',
      'removeElement',
      'moveElement',
      'dropElement',
      'selectElement',
      'editContent'
    ])
  },
  mounted () {
    const {ownerDocument: document} = this.$el
    const head = document.querySelector('head')

    const styles = document.createElement('style')
    styles.innerHTML = require('!raw-loader!assets/uikit/css/uikit.min.css')
    styles.innerHTML += require('!raw-loader!sass-loader!assets/scss/canvas.scss')
    head.appendChild(styles)

    const jquery = document.createElement('script')
    jquery.src = require('url-loader!jquery')
    document.body.appendChild(jquery)

    const uikit = document.createElement('script')
    uikit.src = require('url-loader!uikit/js/uikit.min.js')
    document.body.appendChild(uikit)

    if (this.elements.length < 1) {
      // Add root element
      this.addElement({
        markupText: `div(kind="layout", ${RootElementTag}="true")`
      })

      // Select root element
      this.$nextTick(() => {
        const firstElement = this.elements[0]
        if (firstElement) {
          this.selectElement(firstElement.id)
        }
      })
    }
  },
  render (h) {
    const classes = {
      'preview--mode': this.previewMode
    }

    const onClick = event => {
      this.hideAllPanels()
    }

    const elements = this.elements.map(element => {
      return <Elements node={element} />
    })

    const baba = event => {
      this.addElement({
        markupText: 'div.uk-container(kind="container")',
        appendTo: this.selectedElement.id
      })
    }

    return (
      <div class={[ClassPrefix.MAIN, classes]} onClick={onClick}>
        <Stylesheet content={this.customStyles} />
        {elements}
      </div>
    )
  }
}
</script>
