<script>
import {ClassPrefix, SafeScreenSize, Labels} from '../../const'

const alertClass = `${ClassPrefix.SCREEN}-alert`
const alertIconClass = `${alertClass}__icon`
const alertBrowserClass = `${alertClass}__browser`
const alertResizeClass = `${alertClass}__resize`

export default {
  name: 'screenDetector',
  data () {
    return {
      windowSize: 0
    }
  },
  methods: {
    /**
    * Get windows width
    * @return Number
    */
    windowWidth () {
      return window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    }
  },

  mounted () {
    /**
    * Window resize observer, since we can't using this app with screen < 950, warning will appear
    * @return {void}
    */
    this.windowSize = this.windowWidth()
    window.addEventListener('resize', () => {
      this.windowSize = this.windowWidth()
    }, true)
  },

  render (h) {
    const screenTooSmall = this.windowSize < SafeScreenSize

    if (!screenTooSmall) {
      return
    }

    const classes = {
      'screen--too-small': screenTooSmall
    }

    return (
      <div class={[ClassPrefix.SCREEN, classes]}>
        <div class={alertClass}>
          <div class={alertIconClass} uk-icon="icon: expand; ratio: 5" />
          <div class={alertBrowserClass}>{Labels.BROWSER_TOO_SMALL}</div>
          <div class={alertResizeClass}>{Labels.RESIZE_BROWSER}</div>
        </div>
      </div>
    )
  }
}
</script>
