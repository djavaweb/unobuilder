<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, ScreenType, ScreenSize} from '../../const'

/* eslint-disable no-unused-vars */
import MediaQueryStatus from '../tools/MediaQueryStatus'
import CanvasIframe from './CanvasIframe'
import CanvasBlockComponent from './CanvasBlockComponent'

const mainClass = `${ClassPrefix.WORKSPACE}-canvas`

export default {
  name: 'canvas',
  computed: {
    ...mapGetters([
      'screenSize'
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
    let {canvasStyle, mediaQueryStatus} = {}

    if (this.screenSize !== ScreenType.LARGE) {
      mediaQueryStatus = <MediaQueryStatus />
    }

    return (
      <div class={mainClass} style={this.canvasStyle}>
        {mediaQueryStatus}
        <CanvasIframe />
        <CanvasBlockComponent />
      </div>
    )
  }
}
</script>
