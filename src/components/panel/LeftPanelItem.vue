<script>
import {mapGetters, mapActions} from 'vuex'
import {SVGIcon} from '../../utils/common'

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
    open: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    initiated: {
      type: Boolean,
      default: false
    },
    defaultNav: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'leftPanelNav',
      'openLeftPanel',
      'defaultPanel'
    ])
  },
  methods: {
    ...mapActions([
      'registerLeftPanel',
      'showLeftPanel'
    ])
  },
  created () {
    const {active, open, initiated, defaultNav} = this
    const settings = {active, open, initiated, defaultNav}
    this.registerLeftPanel({id: this.id, settings})
  },
  render (h) {
    const classes = {
      'panel--selected': this.openLeftPanel === this.id
    }

    const attrs = {
      title: this.tooltip,
      'uk-tooltip': 'pos: right'
    }

    return (
      <a class={classes}
      domPropsInnerHTML={SVGIcon(this.icon)}
      {...{attrs}} />
    )
  }
}
</script>
