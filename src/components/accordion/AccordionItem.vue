<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Labels, Icons, Tooltips} from '../../const'
import {SVGIcon} from '../../utils'

/* eslint-disable no-unused-vars */
import Switcher from '../fields/Switcher'

const mainClass = `${ClassPrefix.ACCORDION}-item`
const contentClasses = `${mainClass}__content`
const labelClass = `${ClassPrefix.ACCORDION}-label`
const iconClass = `${ClassPrefix.ACCORDION}-icon`
const mouseStateClass = `${ClassPrefix.ACCORDION}-mouse-state`
const stateClasses = `${ClassPrefix.ACCORDION}-state-switcher`
const advancedClasses = `${ClassPrefix.ACCORDION}-advanced-switcher`

const iconList = [
  Icons.EXPAND,
  Icons.COLLAPSE
]

const stateSwitcher = [
  Labels.MOUSE_STATE_NONE,
  Labels.MOUSE_STATE_HOVER,
  Labels.MOUSE_STATE_ACTIVE,
  Labels.MOUSE_STATE_FOCUS
]

export default {
  name: 'accordionItem',
  props: {
    id: {
      type: String
    },
    title: {
      type: String,
      required: true,
      default: Labels.UNTITLED
    },
    open: {
      type: Boolean,
      default: false
    },
    mouseState: {
      type: Boolean
    },
    advanced: {}
  },

  data () {
    return {
      mouseOpen: false,
      activeState: Labels.MOUSE_STATE_NONE
    }
  },

  computed: {
    ...mapGetters([
      'advancedPanels'
    ])
  },

  methods: {
    ...mapActions([
      'toggleAdvancedPanel',
      'registerAdvancedPanel'
    ])
  },

  created () {
    const {id, advanced} = this
    this.registerAdvancedPanel({ id, value: advanced })
  },

  render (h) {
    let {stateSwitchers, advancedToggle, mouseStateSwitcher} = {}

    if (this.mouseState && this.mouseOpen) {
      const stateSwitcherItems = stateSwitcher.map(item => {
        const switcherClick = event => {
          this.activeState = item
        }
        const anchorClass = {
          'state--active': this.activeState === item
        }
        return <a onClick={switcherClick} class={anchorClass}>{item}</a>
      })

      stateSwitchers = <div class={stateClasses}>{stateSwitcherItems}</div>
    }

    if (this.advanced) {
      const advancedToggleClick = event => {
        this.toggleAdvancedPanel(this.id)
        this.$forceUpdate()
      }

      advancedToggle = <div class={advancedClasses}>
        <Switcher active={this.advancedPanels[this.id]}
          title={Tooltips.ADVANCED_VIEW}
          uk-tooltip="pos: bottom-right"
          nativeOnClick={advancedToggleClick} />
      </div>
    }

    if (this.mouseState) {
      const mouseStateClick = event => {
        this.mouseOpen = !this.mouseOpen
      }

      mouseStateSwitcher = <a
        class={[mouseStateClass, {'mouse--active': this.mouseOpen}]}
        title={Tooltips.MOUSE_STATE}
        onClick={mouseStateClick}
        domPropsInnerHTML={SVGIcon(Icons.MOUSE)} />
    }

    const expandCollapseIcon = iconList.map(item => {
      return <span
        class={[`icon--${item}`, iconClass]}
        domPropsInnerHTML={SVGIcon(item)} />
    })

    const titleClick = event => {
      const containsSwitcher = event.target.className.indexOf('switcher') > -1
      const containsMouse = event.target.className.indexOf('mouse') > -1
      if (containsSwitcher || containsMouse) {
        event.stopPropagation()
      }
    }

    return (
      <li class={[mainClass, {'uk-open': this.open}]}>
        <h3 class="uk-accordion-title" onClick={titleClick}>
          {expandCollapseIcon}
          <span class={labelClass}>{this.title}</span>
          {advancedToggle}
          {mouseStateSwitcher}
        </h3>
        <div class={['uk-accordion-content', contentClasses]}>
          {stateSwitchers}
          {this.$slots.default}
        </div>
      </li>
    )
  }
}
</script>
