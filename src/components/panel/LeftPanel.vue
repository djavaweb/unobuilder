<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Tooltips, Icons, PropertyPanelIds} from '../../const'

/* eslint-disable no-unused-vars */
import NavItem from './LeftPanelItem'
import ComponentsPanel from './LeftPanelComponents'

const mainClass = `${ClassPrefix.LEFT_PANEL}__nav`

export default {
  name: 'leftPanel',
  computed: {
    ...mapGetters([
      'previewMode',
      'openLeftPanel'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels',
      'showLeftPanel'
    ])
  },
  render (h) {
    if (this.previewMode) {
      return
    }

    const panels = [
      {
        id: PropertyPanelIds.COMPONENT,
        icon: Icons.ADD_ELEMENT,
        tooltip: Tooltips.ADD_ELEMENT,
        defaultNav: true,
        open: false,
        active: true,
        initiated: false
      },
      {
        id: PropertyPanelIds.CSS_EDITOR,
        icon: Icons.CODE_EDITOR,
        tooltip: Tooltips.CODE_EDITOR,
        open: false,
        active: false,
        initiated: false
      }
    ]

    const navPanels = panels.map(props => {
      const panelItemClick = event => {
        this.showLeftPanel(props.id)
        this.$forceUpdate()
      }
      return <li>
        <NavItem nativeOnClick={panelItemClick} {...{props}} />
      </li>
    })

    const leftPanelClick = event => {
      if (event.target !== event.currentTarget) return
      this.hideAllPanels()
    }

    let componentsPanel
    if (this.openLeftPanel === PropertyPanelIds.COMPONENT) {
      componentsPanel = <ComponentsPanel />
    }

    return (
      <div class={ClassPrefix.LEFT_PANEL}>
        <ul class={mainClass} onClick={leftPanelClick}>{navPanels}</ul>
        {componentsPanel}
      </div>
    )
  }
}
</script>
