<script>
import { Icons, Labels, ButtonType, Tooltips, PropertyPanelIds } from '../../const'
import { mapActions, mapGetters } from 'vuex'
import { srcType as ColorPickerType } from 'vue-sketch-color-picker'
import AccordionContent from '../accordion/AccordionContent'
import AccordionContentItem from '../accordion/AccordionContentItem'
import Row from '../fields/Row'
import ButtonGroup from '../fields/ButtonGroup'
import Colorpicker from '../fields/Colorpicker'

// Temporary constant
// We will set in the store state later
const BACKGROUND_COLOR = 'color'
const BACKGROUND_IMAGE = 'image'
const BACKGROUND_VIDEO = 'video'
const BACKGROUND_GRADIENT = 'gradient'

const panelId = PropertyPanelIds.BACKGROUND
export default {
  name: 'backgroundProperties',
  data () {
    return {
      openPanel: BACKGROUND_COLOR,
      updated: false
    }
  },

  computed: {
    ...mapGetters([
      'mouseStatePanel'
    ])
  },

  methods: {
    ...mapActions([
      'setStyle'
    ]),

    handleStyle (config, snapshot = false) {
      return this.setStyle({
        snapshot,
        mouseState: this.mouseStatePanel[panelId],
        styles: {
          backgroundColor: config
        }
      }).then(() => {
        this.$forceUpdate()
      })
    },

    handleUpdate (colors) {
      this.handleStyle(colors, colors.source !== ColorPickerType.SATURATION)
    },

    handleMouseup (colors) {
      this.handleStyle(colors, true)
    }
  },

  render (h) {
    const typeSelectorButtons = [
      {
        icon: Icons.CLOSE,
        tooltip: Tooltips.BACKGROUND_NONE,
        active: true
      },

      {
        icon: Icons.BACKGROUND_COLOR,
        tooltip: Tooltips.BACKGROUND_COLOR
      },

      {
        icon: Icons.BACKGROUND_IMAGE,
        tooltip: Tooltips.BACKGROUND_IMAGE
      },

      {
        icon: Icons.BACKGROUND_VIDEO,
        tooltip: Tooltips.BACKGROUND_VIDEO
      },

      {
        icon: Icons.BACKGROUND_GRADIENT,
        tooltip: Tooltips.BACKGROUND_GRADIENT
      }
    ]

    let bgPropContentEl
    let bgPropTitleEl

    switch (this.openPanel) {
      case BACKGROUND_COLOR:
        bgPropTitleEl = Labels.BACKGROUND_COLOR_SETTINGS
        bgPropContentEl = <Colorpicker on-mouseup={ this.handleMouseup } on-update={ this.handleUpdate } />
        break

      case BACKGROUND_IMAGE:
        bgPropTitleEl = Labels.BACKGROUND_IMAGE_SETTINGS
        bgPropContentEl = 'image'
        break

      case BACKGROUND_VIDEO:
        bgPropTitleEl = Labels.BACKGROUND_VIDEO_SETTINGS
        bgPropContentEl = 'video'
        break

      case BACKGROUND_GRADIENT:
        bgPropTitleEl = Labels.BACKGROUND_GRADIENT_SETTINGS
        bgPropContentEl = 'gradient'
        break
    }

    let bgPropEl
    if (this.openPanel) {
      bgPropEl = <AccordionContent>
        <AccordionContentItem label={ bgPropTitleEl }>{ bgPropContentEl }</AccordionContentItem>
      </AccordionContent>
    }

    return (
      <div>
        <Row label={ { text: Labels.SELECT_TYPE, bold: true } }>
          <ButtonGroup type={ ButtonType.SECONDARY } items={ typeSelectorButtons } />
        </Row>
        { bgPropEl }
      </div>
    )
  }
}
</script>
