<script>
import {mapGetters, mapActions} from 'vuex'
import uno from '../../client'
import {ClassPrefix, PropertyPanelIds} from '../../const'

/* eslint-disable no-unused-vars */
import Accordion from '../accordion/Accordion'
import AccordionItem from '../accordion/AccordionItem'
import SearchBox from './LeftPanelSearchBox'
import ComponentItem from './LeftPanelComponentItem'
import CloseButton from '../fields/CloseButton'

const mainClass = `${ClassPrefix.LEFT_PANEL}-components`
const listClass = `${ClassPrefix.LEFT_PANEL}-list-components`
const searchClass = `${ClassPrefix.LEFT_PANEL}-search-components`

export default {
  name: 'leftPanelComponents',
  computed: {
    ...mapGetters([
      'openLeftPanel',
      'searchComponents',
      'toggleLeftPanel'
    ])
  },
  methods: {
    ...mapActions([
      'hideLeftPanels'
    ])
  },
  render (h) {
    const openPanel = this.openLeftPanel === PropertyPanelIds.COMPONENT
    let classes = {
      'animate--slide-in': openPanel && this.toggleLeftPanel,
      'animate--slide-out': !openPanel || !this.toggleLeftPanel
    }

    const closeOnClick = event => {
      this.hideLeftPanels()
    }

    const itemGroups = {}
    for (let item in uno.getComponentList()) {
      const component = uno.getComponentItem(item)
      if (!(component.settings.group in itemGroups)) {
        itemGroups[component.settings.group] = []
      }
      itemGroups[component.settings.group].push(component)
    }

    const componentGroups = []
    for (let title in itemGroups) {
      const components = itemGroups[title]
      componentGroups.push({ title, components })
    }

    const accordionItems = componentGroups.map((item, index) => {
      let {title, components} = item
      const props = {
        title,
        id: `component-${index}`,
        open: index === 0
      }

      components = components.filter(item => {
        if (this.searchComponents.length > 0) {
          const label = item.settings.label.toLowerCase()
          const search = this.searchComponents.toLowerCase()
          return label.indexOf(search) > -1
        }

        return true
      })

      return <AccordionItem {...{props}}>
        <ComponentItem items={components} />
      </AccordionItem>
    })

    return (
      <div class={[mainClass, classes]}>
        <div class={searchClass}>
          <CloseButton nativeOnClick={closeOnClick} class="close" />
          <SearchBox />
        </div>

        <div class={listClass}>
          <Accordion>{accordionItems}</Accordion>
        </div>
      </div>
    )
  }
}
</script>
