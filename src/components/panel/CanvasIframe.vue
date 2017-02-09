<script>
import Vue from 'vue'
import store from '../../store'
import uno from '../../client'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import CanvasBuilder from './CanvasBuilder'

export default {
  name: 'canvasIframe',
  render (h) {
    const iframeInit = event => {
      const {contentWindow} = this.$refs.canvasIframe
      const {document: canvasDocument} = contentWindow
      const {body} = canvasDocument

      const canvasBuilder = canvasDocument.createElement('div')
      canvasBuilder.className = ClassPrefix.MAIN
      body.appendChild(canvasBuilder)

      /* eslint-disable no-new */
      new Vue({
        el: canvasDocument.querySelector(`.${ClassPrefix.MAIN}`),
        render: h => <CanvasBuilder ref="canvasBuilder" />,
        store
      })
    }

    return (
      <iframe ref="canvasIframe" src={uno.getBuilderUrl()} onLoad={iframeInit} />
    )
  }
}
</script>
