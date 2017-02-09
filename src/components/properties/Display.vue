<script>
import {mapGetters} from 'vuex'
import {PropertyPanelIds, Icons, Labels, ButtonType, Tooltips} from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import ButtonGroup from '../fields/ButtonGroup'
import AccordionContent from '../accordion/AccordionContent'
import AccordionContentItem from '../accordion/AccordionContentItem'

export default {
  name: 'displayProperties',
  computed: {
    ...mapGetters([
      'cssProperties',
      'advancedPanels'
    ])
  },
  render (h) {
    const id = PropertyPanelIds.DISPLAY
    const isAdvanced = this.advancedPanels[id]

    const typeSelectorButtons = [
      {
        icon: Icons.DISPLAY_BLOCK,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.DISPLAY_BLOCK
      },

      this.advancedPanels.display ? {
        icon: Icons.DISPLAY_INLINE_BLOCK,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.DISPLAY_INLINE_BLOCK
      } : null,

      {
        icon: Icons.DISPLAY_INLINE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.DISPLAY_INLINE
      },

      this.advancedPanels.display ? {
        icon: Icons.DISPLAY_FLEX,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.DISPLAY_FLEX
      } : null,

      {
        icon: Icons.DISPLAY_NONE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.DISPLAY_NONE
      }
    ]

    const sizingButtons = [
      {
        icon: Icons.FLEX_SHRINK,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_SHRINK
      },

      {
        icon: Icons.FLEX_GROW,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_GROW
      },

      {
        icon: Icons.FLEX_NO_SHRINK,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_NO_SHRINK
      }
    ]

    const flexAlignSelfButtons = [
      {
        icon: Icons.FLEX_ALIGN_SELF_START,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ALIGN_SELF_START
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_END,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ALIGN_SELF_END
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_CENTER,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ALIGN_SELF_CENTER
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_BASELINE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ALIGN_SELF_BASELINE
      },

      {
        icon: Icons.FLEX_ALIGN_SELF_STRETCH,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ALIGN_SELF_STRETCH
      }
    ]

    const flexOrderButtons = [
      {
        label: Labels.FLEX_ORDER_AUTO,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ORDER_AUTO
      },

      {
        icon: Icons.FLEX_ORDER_FIRST,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ORDER_FIRST
      },

      {
        icon: Icons.FLEX_ORDER_LAST,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.FLEX_ORDER_LAST
      }
    ]

    const gutterButtons = [
      {
        icon: Icons.GUTTER_LARGE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.GUTTER_LARGE
      },

      {
        icon: Icons.GUTTER_MEDIUM,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.GUTTER_MEDIUM
      },

      {
        icon: Icons.GUTTER_SMALL,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.GUTTER_SMALL
      },

      {
        icon: Icons.GUTTER_NONE,
        type: ButtonType.SECONDARY,
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
            <ButtonGroup items={sizingButtons} />
          </Row>
          <Row label={{text: Labels.FLEX_ALIGN_SELF}}>
            <ButtonGroup items={flexAlignSelfButtons} />
          </Row>
          <Row label={{text: Labels.FLEX_ORDER}}>
            <ButtonGroup items={flexOrderButtons} />
          </Row>
          <Row label={{text: Labels.GRID_GUTTER}}>
            <ButtonGroup items={gutterButtons} />
          </Row>
        </AccordionContentItem>
      </AccordionContent>
    }

    return (
      <div>
        <Row label={{text: Labels.SELECT_TYPE, bold: true}}>
          <ButtonGroup items={typeSelectorButtons} />
        </Row>
        {advancedRow}
      </div>
    )
  }
}
</script>
