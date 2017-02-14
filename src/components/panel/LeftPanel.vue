<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Tooltips, Icons, PropertyPanelIds} from '../../const'

/* eslint-disable no-unused-vars */
import NavItem from './LeftPanelItem'
import ComponentsPanel from './LeftPanelComponents'
import CSSEditor from './LeftPanelCssEditor'

const mainClass = ClassPrefix.LEFT_PANEL
const navClass = `${ClassPrefix.LEFT_PANEL}__nav`

const panels = [
  {
    id: PropertyPanelIds.COMPONENT,
    icon: Icons.ADD_ELEMENT,
    tooltip: Tooltips.ADD_ELEMENT,
    defaultActive: true
  },
  {
    id: PropertyPanelIds.CSS_EDITOR,
    icon: Icons.CODE_EDITOR,
    tooltip: Tooltips.CODE_EDITOR
  }
]

export default {
  name: 'leftPanel',
  computed: {
    ...mapGetters([
      'toggleLeftPanel',
      'previewMode'
    ])
  },
  methods: {
    ...mapActions([
      'registerLeftPanel',
      'hideAllPanels',
      'showLeftPanel'
    ])
  },
  render (h) {
    const navPanels = panels.map(props => {
      return <li>
        <NavItem {...{props}} />
      </li>
    })

    const leftPanelClick = event => {
      if (event.target !== event.currentTarget) return
      this.hideAllPanels()
    }

    const classes = {}
    classes['animate--slide-out'] = this.previewMode
    classes['animate--slide-in'] = !this.previewMode

    return (
      <div class={[mainClass, classes]}>
        <ul class={navClass} onClick={leftPanelClick}>
          {navPanels}
        </ul>
        <ComponentsPanel />
        <CSSEditor />
      </div>
    )
  }
}
</script>
