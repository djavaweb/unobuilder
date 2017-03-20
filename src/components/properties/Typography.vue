<script>
import {Icons, Tooltips, ButtonType, ButtonSize, Units} from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import Column from '../fields/Column'
import Buttons from '../fields/ButtonGroup'
import Colorpicker from '../fields/Colorpicker'
import Number from '../fields/Number'

export default {
  name: 'typographyProperties',
  methods: {
    fontColorUpdate (color) {
      console.log('c', color)
    }
  },

  render (h) {
    const textAlignButtons = [
      {
        icon: Icons.TEXT_ALIGN_LEFT,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_ALIGN_LEFT,
        active: true
      },

      {
        icon: Icons.TEXT_ALIGN_CENTER,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_ALIGN_CENTER
      },

      {
        icon: Icons.TEXT_ALIGN_JUSTIFY,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_ALIGN_JUSTIFY
      },

      {
        icon: Icons.TEXT_ALIGN_RIGHT,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_ALIGN_RIGHT
      }
    ]

    const textStyleButtons = [
      {
        icon: Icons.TEXT_STYLE_NORMAL,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_STYLE_NORMAL,
        active: true
      },

      {
        icon: Icons.TEXT_STYLE_ITALIC,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_STYLE_ITALIC
      }
    ]

    const textDecorationButtons = [
      {
        icon: Icons.TEXT_DECORATION_UNDERLINE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_DECORATION_UNDERLINE,
        active: true
      },

      {
        icon: Icons.TEXT_DECORATION_UNDERLINE,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_DECORATION_UNDERLINE
      },

      {
        icon: Icons.TEXT_DECORATION_STRIKETHROUGH,
        type: ButtonType.SECONDARY,
        tooltip: Tooltips.TEXT_DECORATION_STRIKETHROUGH
      }
    ]

    return (
      <div>
        <Row>
          <Column icon={Icons.FONT_FAMILY}>Font Selector</Column>
        </Row>

        <Row>
          <Column icon={Icons.FONT_WEIGHT}></Column>
          <Column icon={Icons.FONT_SIZE}>
            <Number value={12} units={Units.PX} excludeUnit={[Units.VW, Units.VH]} />
          </Column>
          <Column icon={Icons.LINE_HEIGHT}>
            <Number value={50} units={Units.PX} excludeUnit={[Units.VW, Units.VH]} />
          </Column>
        </Row>

        <Row>
          <Column icon={Icons.FONT_COLOR}>
            <Colorpicker popup={true} on-update={this.fontColorUpdate} />
          </Column>
          <Column icon={Icons.FONT_STYLE}>
            <Buttons size={ButtonSize.SMALL} items={textStyleButtons} />
          </Column>
          <Column icon={Icons.TEXT_DECORATION}>
            <Buttons size={ButtonSize.SMALL} items={textDecorationButtons} />
          </Column>
        </Row>

        <Row>
          <Column icon={Icons.TEXT_ALIGN} width={280}>
            <Buttons size={ButtonSize.SMALL} items={textAlignButtons} />
          </Column>
          <Column icon={Icons.LETTER_SPACING}>
            <Number value={50} units={Units.PX} excludeUnit={[Units.VW, Units.VH]} />
          </Column>
        </Row>
      </div>
    )
  }
}
</script>
