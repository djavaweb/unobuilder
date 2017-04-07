<script>
import { Icons, Tooltips, ButtonType, ButtonSize, Units } from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import Column from '../fields/Column'
import ButtonGroup from '../fields/ButtonGroup'
import Colorpicker from '../fields/Colorpicker'
import Number from '../fields/Number'
import Select from '../fields/Select'

export default {
  name: 'typographyProperties',
  methods: {
    fontColorUpdate (color) {
      console.log('c', color)
    }
  },

  render (h) {
    const fontFamilies = [
      { value: 'Arial', selected: true },
      { value: 'Georgia' },
      { value: 'Tahoma' },
      { value: 'Verdana' }
    ]

    const fontWeightOptions = [
      { value: 100, selected: true },
      { value: 200 },
      { value: 300 },
      { value: 400 },
      { value: 500 },
      { value: 600 },
      { value: 700 },
      { value: 800 },
      { value: 900 }
    ]

    const textAlignButtons = [
      {
        icon: Icons.TEXT_ALIGN_LEFT,
        tooltip: Tooltips.TEXT_ALIGN_LEFT,
        active: true
      },

      {
        icon: Icons.TEXT_ALIGN_CENTER,
        tooltip: Tooltips.TEXT_ALIGN_CENTER
      },

      {
        icon: Icons.TEXT_ALIGN_JUSTIFY,
        tooltip: Tooltips.TEXT_ALIGN_JUSTIFY
      },

      {
        icon: Icons.TEXT_ALIGN_RIGHT,
        tooltip: Tooltips.TEXT_ALIGN_RIGHT
      }
    ]

    const textStyleButtons = [
      {
        icon: Icons.TEXT_STYLE_NORMAL,
        tooltip: Tooltips.TEXT_STYLE_NORMAL,
        active: true
      },

      {
        icon: Icons.TEXT_STYLE_ITALIC,
        tooltip: Tooltips.TEXT_STYLE_ITALIC
      }
    ]

    const textDecorationButtons = [
      {
        icon: Icons.TEXT_DECORATION_UNDERLINE,
        tooltip: Tooltips.TEXT_DECORATION_UNDERLINE,
        active: true
      },

      {
        icon: Icons.TEXT_DECORATION_UNDERLINE,
        tooltip: Tooltips.TEXT_DECORATION_UNDERLINE
      },

      {
        icon: Icons.TEXT_DECORATION_STRIKETHROUGH,
        tooltip: Tooltips.TEXT_DECORATION_STRIKETHROUGH
      }
    ]

    return (
      <div>
        <Row>
          <Column icon={ Icons.FONT_FAMILY }>
            <Select options={ fontFamilies } />
          </Column>
        </Row>

        <Row>
          <Column icon={ Icons.FONT_WEIGHT }>
            <Select options={ fontWeightOptions } typehead={ false } />
          </Column>
          <Column icon={ Icons.FONT_SIZE }>
            <Number value={ 12 } units={ Units.PX } excludeUnit={ [Units.VW, Units.VH] } />
          </Column>
          <Column icon={ Icons.LINE_HEIGHT }>
            <Number value={ 50 } units={ Units.PX } excludeUnit={ [Units.VW, Units.VH] } />
          </Column>
        </Row>

        <Row>
          <Column icon={ Icons.FONT_COLOR }>
            <Colorpicker popup={ true } on-update={ this.fontColorUpdate } />
          </Column>
          <Column icon={ Icons.FONT_STYLE }>
            <ButtonGroup type={ ButtonType.SECONDARY } size={ ButtonSize.SMALL } items={ textStyleButtons } />
          </Column>
          <Column icon={ Icons.TEXT_DECORATION }>
            <ButtonGroup type={ ButtonType.SECONDARY } size={ ButtonSize.SMALL } items={ textDecorationButtons } />
          </Column>
        </Row>

        <Row>
          <Column icon={ Icons.TEXT_ALIGN } width={ 280 }>
            <ButtonGroup type={ ButtonType.SECONDARY } size={ ButtonSize.SMALL } items={ textAlignButtons } />
          </Column>
          <Column icon={ Icons.LETTER_SPACING }>
            <Number value={ 50 } units={ Units.PX } excludeUnit={ [Units.VW, Units.VH] } />
          </Column>
        </Row>
      </div>
    )
  }
}
</script>
