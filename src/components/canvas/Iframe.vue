<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import store from '../../store/'
import uno from '../../client'
import { ClassPrefix } from '../../const'

import CanvasBuilder from '../canvas/Builder'

export default {
  name: 'canvasIframe',
  computed: {
    ...mapGetters([
      'canvasLoaded',
      'previewMode'
    ])
  },
  methods: {
    ...mapActions([
      'setOwnerWindow',
      'setCanvasScroll'
    ])
  },
  mounted () {
    this.$refs.canvasIframe.onload = event => {
      const { contentWindow: window } = this.$refs.canvasIframe
      const { document } = window
      const { body } = document

      window.onscroll = event => {
        this.setCanvasScroll(body.getBoundingClientRect())
      }

      const canvasBuilder = document.createElement('div')
      canvasBuilder.className = ClassPrefix.MAIN
      body.appendChild(canvasBuilder)

      /* eslint-disable no-new */
      this.setOwnerWindow(window)
      new Vue({
        store,
        el: document.querySelector(`.${ ClassPrefix.MAIN }`),
        render: h => <CanvasBuilder ref='canvasBuilder' />,
        mounted: () => {
          if (!this.canvasLoaded) {
            uno.emit('finish')
          }
        }
      })
    }
  },
  render (h) {
    return (
      <iframe src={ uno.getBuilderUrl() } ref='canvasIframe' />
    )
  }
}
</script>
