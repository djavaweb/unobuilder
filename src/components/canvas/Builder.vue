<script>
import { mapGetters, mapActions } from 'vuex'
import { ClassPrefix, RootElementTag } from '../../const'
import HTMLParser from 'unobuilder-parser'

import Elements from './Elements'
import Stylesheet from './Stylesheet'

export default {
  name: 'canvasBuilder',
  computed: {
    ...mapGetters([
      'elements',
      'selectedElement',
      'iframeBody',
      'iframeWindow',
      'iframeDocument',
      'elementDragging',
      'previewMode',
      'customStyles',
      'globalCSS',
      'localCSS'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels',
      'addElement',
      'removeElement',
      'selectElement',
      'editContent',
      'setStyle',
      'setDefaultStyle'
    ])
  },

  created () {
    if (this.elements.length < 1) {
      // Add root element
      this.addElement({
        object: new HTMLParser(`<div ${ RootElementTag }="true" kind="layout"></div>`)
      }).then(object => {
        this.selectElement(object.id)
        this.setDefaultStyle(object)
        this.$forceUpdate()
      })
    }
  },

  mounted () {
    const { ownerDocument: document } = this.$el
    const head = document.querySelector('head')

    const styles = document.createElement('style')
    styles.innerHTML = require('!css-loader!assets/uikit/css/uikit.min.css')
    styles.innerHTML += require('!css-loader!sass-loader!assets/scss/canvas.scss')
    head.appendChild(styles)

    const jquery = document.createElement('script')
    jquery.src = require('url-loader!jquery')
    document.body.appendChild(jquery)

    const uikit = document.createElement('script')
    uikit.src = require('url-loader!uikit/js/uikit.min.js')
    document.body.appendChild(uikit)
  },

  render (h) {
    this.iframeBody.style.userSelect = this.elementDragging
      ? 'none'
      : 'initial'

    const classes = {
      'preview--mode': this.previewMode
    }

    const onClick = event => {
      this.hideAllPanels()
    }

    const elements = this.elements.map(element => {
      return <Elements node={ element } />
    })

    return (
      <div class={ [ClassPrefix.MAIN, classes] } onClick={ onClick }>
        <Stylesheet content={ this.globalCSS } />
        <Stylesheet content={ this.localCSS } />
        <Stylesheet content={ this.customStyles } />
        { elements }
      </div>
    )
  }
}
</script>
