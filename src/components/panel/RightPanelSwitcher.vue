<script>
import {ClassPrefix, Labels, Tooltips} from '../../const'
import {mapGetters, mapActions} from 'vuex'

const mainClass = `${ClassPrefix.MAIN}__property-switcher`
const switcher = [
  {
    global: false,
    label: Labels.PAGE_PROPERTIES,
    tooltip: Tooltips.PAGE_PROPERTIES
  },
  {
    global: true,
    label: Labels.GLOBAL_PROPERTIES,
    tooltip: Tooltips.GLOBAL_PROPERTIES
  }
]

export default {
  name: 'rightPanelSwitcher',
  computed: {
    ...mapGetters([
      'globalPropertyActive'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels',
      'disableGlobalProperty',
      'enableGlobalProperty'
    ])
  },
  render (h) {
    const switcherEls = switcher.map(item => {
      const classes = {
        'property--active': item.global === this.globalPropertyActive
      }

      const attrs = {
        title: item.tooltip,
        'uk-tooltip': true
      }

      const switcherOnClick = event => {
        this.hideAllPanels()

        if (!item.global) {
          this.disableGlobalProperty()
        } else {
          this.enableGlobalProperty()
        }
      }

      return <a class={classes} {...{attrs}} onClick={switcherOnClick}>
        {item.label}
      </a>
    })

    return (
      <div class={mainClass}>{switcherEls}</div>
    )
  }
}
</script>
