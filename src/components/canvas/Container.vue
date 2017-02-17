<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, ScreenType, ScreenSize} from '../../const'

/* eslint-disable no-unused-vars */
import MediaQueryStatus from '../tools/MediaQueryStatus'
import CanvasIframe from './Iframe'
import BlockComponent from './Block'
import ElementSelector from '../tools/ElementSelector'

export default {
  name: 'canvas',
  computed: {
    ...mapGetters([
      'screenSize',
      'previewMode'
    ]),
    canvasStyle () {
      const sizeConst = this.screenSize.toUpperCase()
      let styles = {}

      switch (this.screenSize) {
        case ScreenType.MEDIUM:
          styles = {
            width: `${ScreenSize.MEDIUM}px`,
            maxWidth: `${ScreenSize.LARGE}px`,
            minWidth: `${ScreenSize.MEDIUM}px`
          }
          break

        case ScreenType.SMALL:
          styles = {
            width: `${ScreenSize.SMALL}px`,
            maxWidth: `${ScreenSize.MEDIUM - 1}px`,
            minWidth: `${ScreenSize.SMALL}px`
          }
          break

        case ScreenType.TINY:
          styles = {
            width: `${ScreenSize.TINY}px`,
            maxWidth: `${ScreenSize.SMALL - 1}px`,
            minWidth: `${ScreenSize.TINY}px`
          }
          break
      }

      return styles
    }
  },

  render (h) {
    let mediaQueryStatus
    let elementSelector
    let blockComponent

    if (this.screenSize !== ScreenType.LARGE) {
      mediaQueryStatus = <MediaQueryStatus />
    }

    if (!this.previewMode) {
      elementSelector = <ElementSelector />
      blockComponent = <BlockComponent />
    }

    return (
      <div class={ClassPrefix.CANVAS} style={this.canvasStyle}>
        {mediaQueryStatus}
        {elementSelector}
        <CanvasIframe />
        {blockComponent}
      </div>
    )
  }
}
</script>
