<script>
import {ClassPrefix, ScreenType, Tooltips, Icons} from '../../const'
import {SVGIcon} from '../../utils/common'
import {mapGetters, mapActions} from 'vuex'

const mainClass = `${ClassPrefix.TOP_PANEL}-screen-switcher`

export default {
  name: 'topPanelScreenSwitcher',
  computed: {
    ...mapGetters([
      'screenSize'
    ])
  },
  methods: {
    ...mapActions([
      'changeScreenSize'
    ])
  },
  render (h) {
    const toolbars = Object.keys(ScreenType).map(size => {
      const screenSize = ScreenType[size]
      const classes = {
        'screen-switcher--active': this.screenSize === screenSize
      }
      classes[`${ClassPrefix.MAIN}__screen-switcher--${screenSize}`] = true

      const attrs = {
        title: Tooltips[`SCREEN_${size}`],
        'uk-tooltip': true
      }

      const onClick = event => {
        this.changeScreenSize(screenSize)
      }

      return <a
        class={[classes]}
        domPropsInnerHTML={SVGIcon(Icons[`SCREEN_${size}`])}
        onClick={onClick}
        {...{attrs}} />
    })

    return (
      <div class={mainClass}>{toolbars}</div>
    )
  }
}
</script>
