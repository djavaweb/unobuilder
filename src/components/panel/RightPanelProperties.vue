<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, PropertyPanelIds, Labels} from '../../const'

/* eslint-disable no-unused-vars */
import Accordion from '../accordion/Accordion'
import AccordionItem from '../accordion/AccordionItem'
import DisplayProperties from '../properties/Display'
import LayoutProperties from '../properties/Layout'
import SizeProperties from '../properties/Size'
import TypographyProperties from '../properties/Typography'
import BackgroundProperties from '../properties/Bg'
import AttrProperties from '../properties/Attr'

const mainClass = `${ClassPrefix.MAIN}__properties`

export default {
  name: 'rightPanelProperties',
  computed: {
    ...mapGetters([
      'cssProperties',
      'advancedPanels'
    ])
  },
  methods: {
    ...mapActions([
      'hideLeftPanels'
    ])
  },
  render (h) {
    const properties = [
      {
        id: PropertyPanelIds.DISPLAY,
        title: Labels.DISPLAY_PROPERTIES,
        open: true,
        mouseState: true,
        advanced: true
      },

      {
        id: PropertyPanelIds.LAYOUT,
        title: Labels.LAYOUT_PROPERTIES,
        mouseState: true
      },

      {
        id: PropertyPanelIds.SIZE,
        title: Labels.SIZE_PROPERTIES,
        advanced: true,
        mouseState: true
      },

      {
        id: PropertyPanelIds.TYPOGRAPHY,
        title: Labels.TYPOGRAPHY_PROPERTIES,
        advanced: true,
        mouseState: true
      },

      {
        id: PropertyPanelIds.BACKGROUND,
        title: Labels.BACKGROUND_PROPERTIES,
        advanced: true,
        mouseState: true
      },

      {
        id: PropertyPanelIds.ATTRIBUTE,
        title: Labels.ATTRIBUTE_PROPERTIES
      }
    ]

    const propertiesEls = properties.map(props => {
      let propEl

      switch (props.id) {
        case PropertyPanelIds.DISPLAY:
          propEl = <DisplayProperties />
          break

        case PropertyPanelIds.LAYOUT:
          propEl = <LayoutProperties />
          break

        case PropertyPanelIds.SIZE:
          propEl = <SizeProperties />
          break

        case PropertyPanelIds.TYPOGRAPHY:
          propEl = <TypographyProperties />
          break

        case PropertyPanelIds.BACKGROUND:
          propEl = <BackgroundProperties />
          break

        case PropertyPanelIds.ATTRIBUTE:
          propEl = <AttrProperties />
          break
      }

      return (
        <AccordionItem {...{props}}>{propEl}</AccordionItem>
      )
    })

    return (
      <div class={mainClass} onClick={this.hideLeftPanels}>
        <Accordion>{propertiesEls}</Accordion>
      </div>
    )
  }
}
</script>
