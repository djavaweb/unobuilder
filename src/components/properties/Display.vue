<script>
import {mapGetters, mapActions} from 'vuex'
import {
  PropertyPanelIds,
  Icons,
  Labels,
  ButtonType,
  Tooltips
  // MouseType,
  // ScreenType
} from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import ButtonGroup from '../fields/ButtonGroup'
import AccordionContent from '../accordion/AccordionContent'
import AccordionContentItem from '../accordion/AccordionContentItem'
import {
  CloneObject,
  SelectorId
} from '../../utils'

const panelId = PropertyPanelIds.DISPLAY

export default {
  name: 'displayProperties',
  computed: {
    ...mapGetters([
      'advancedPanels',
      'mouseStatePanel',
      'selectedElement',
      'iframeDocument',
      'iframeWindow',
      'screenSize',
      'styles'
    ])
  },
  methods: {
    ...mapActions([
      'setStyle'
    ]),

    setDisplay (value) {
      this.setStyle({
        mouseState: this.mouseStatePanel[panelId],
        styles: {
          display: value
        }
      }).then(() => {
        this.$forceUpdate()
      })
    }
  },
  render (h) {
    const isAdvanced = this.advancedPanels[panelId]
    const currentMouseState = this.mouseStatePanel[panelId]
    const propStyles = this.styles[currentMouseState]

    const typeSelectorButtons = [
      {
        icon: Icons.DISPLAY_BLOCK,
        tooltip: Tooltips.DISPLAY_BLOCK,
        active: propStyles.display === 'block',
        value: 'block'
      },

      this.advancedPanels.display ? {
        icon: Icons.DISPLAY_INLINE_BLOCK,
        tooltip: Tooltips.DISPLAY_INLINE_BLOCK,
        active: propStyles.display === 'inline-block',
        value: 'inline-block'
      } : null,

      {
        icon: Icons.DISPLAY_INLINE,
        tooltip: Tooltips.DISPLAY_INLINE,
        active: propStyles.display === 'inline',
        value: 'inline'
      },

      this.advancedPanels.display ? {
        icon: Icons.DISPLAY_FLEX,
        tooltip: Tooltips.DISPLAY_FLEX,
        active: propStyles.display === 'flex',
        value: 'flex'
      } : null,

      {
        icon: Icons.DISPLAY_NONE,
        tooltip: Tooltips.DISPLAY_NONE,
        active: propStyles.display === 'none',
        value: 'none'
      }
    ]

    const sizingButtons = [
      {
        icon: Icons.FLEX_SHRINK,
        tooltip: Tooltips.FLEX_SHRINK
      },

      {
        icon: Icons.FLEX_GROW,
        tooltip: Tooltips.FLEX_GROW
      },

      {
        icon: Icons.FLEX_NO_SHRINK,
        tooltip: Tooltips.FLEX_NO_SHRINK
      }
    ]

    const flexAlignSelfButtons = [
      {
        icon: Icons.FLEX_ALIGN_SELF_START,
        tooltip: Tooltips.FLEX_ALIGN_SELF_START
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_END,
        tooltip: Tooltips.FLEX_ALIGN_SELF_END
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_CENTER,
        tooltip: Tooltips.FLEX_ALIGN_SELF_CENTER
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_BASELINE,
        tooltip: Tooltips.FLEX_ALIGN_SELF_BASELINE
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_STRETCH,
        tooltip: Tooltips.FLEX_ALIGN_SELF_STRETCH
      }
    ]

    const flexOrderButtons = [
      {
        label: Labels.FLEX_ORDER_AUTO,
        tooltip: Tooltips.FLEX_ORDER_AUTO
      },

      {
        icon: Icons.FLEX_ORDER_FIRST,
        tooltip: Tooltips.FLEX_ORDER_FIRST
      },

      {
        icon: Icons.FLEX_ORDER_LAST,
        tooltip: Tooltips.FLEX_ORDER_LAST
      }
    ]

    const gutterButtons = [
      {
        icon: Icons.GUTTER_LARGE,
        tooltip: Tooltips.GUTTER_LARGE
      },

      {
        icon: Icons.GUTTER_MEDIUM,
        tooltip: Tooltips.GUTTER_MEDIUM
      },

      {
        icon: Icons.GUTTER_SMALL,
        tooltip: Tooltips.GUTTER_SMALL
      },

      {
        icon: Icons.GUTTER_NONE,
        tooltip: Tooltips.GUTTER_NONE
      }
    ]

    let advancedRow

    if (isAdvanced) {
      advancedRow = <AccordionContent>
        <AccordionContentItem label={Labels.FLEX_LAYOUT_SETTINGS}>
        </AccordionContentItem>
        <AccordionContentItem label={Labels.FLEX_CHILD_SETTINGS}>
          <Row label={{text: Labels.FLEX_SIZING}}>
            <ButtonGroup type={ButtonType.SECONDARY} items={sizingButtons} />
          </Row>
          <Row label={{text: Labels.FLEX_ALIGN_SELF}}>
            <ButtonGroup type={ButtonType.SECONDARY} items={flexAlignSelfButtons} />
          </Row>
          <Row label={{text: Labels.FLEX_ORDER}}>
            <ButtonGroup type={ButtonType.SECONDARY} items={flexOrderButtons} />
          </Row>
          <Row label={{text: Labels.GRID_GUTTER}}>
            <ButtonGroup type={ButtonType.SECONDARY} items={gutterButtons} />
          </Row>
        </AccordionContentItem>
      </AccordionContent>
    }

    return (
      <div>
        <Row label={{text: Labels.SELECT_TYPE, bold: true}}>
          <ButtonGroup type={ButtonType.SECONDARY} items={typeSelectorButtons} on-click={this.setDisplay} />
        </Row>
        {advancedRow}
      </div>
    )
  }
}
</script>
