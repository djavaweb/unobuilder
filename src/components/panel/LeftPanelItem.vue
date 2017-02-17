<script>
import {mapGetters, mapActions} from 'vuex'
import {SVGIcon} from '../../utils'

export default {
  name: 'leftPanelNavItem',
  props: {
    id: {
      type: String
    },
    icon: {
      type: String
    },
    tooltip: {
      type: String
    },
    defaultActive: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'openLeftPanel'
    ])
  },
  methods: {
    ...mapActions([
      'showLeftPanel',
      'hideLeftPanels'
    ])
  },
  created () {
    if (this.defaultActive) {
      this.showLeftPanel(this.id)
      this.hideLeftPanels()
    }
  },
  render (h) {
    const isOpenCurrentPanel = this.openLeftPanel === this.id

    const classes = {
      'panel--selected': isOpenCurrentPanel
    }

    const attrs = {
      title: this.tooltip,
      'uk-tooltip': 'pos: right'
    }

    const onClick = event => {
      this.showLeftPanel(this.id)
    }

    return (
      <a class={classes}
      onClick={onClick}
      domPropsInnerHTML={SVGIcon(this.icon)}
      {...{attrs}} />
    )
  }
}
</script>
