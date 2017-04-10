<script>
import { ClassPrefix, Labels } from '../../const'

const mainClass = `${ ClassPrefix.RIGHT_PANEL }-layout-box`
const positionClass = `${ mainClass }__position`
const marginClass = `${ mainClass }__margin`
const borderClass = `${ mainClass }__border`
const paddingClass = `${ mainClass }__padding`
const topClass = `${ mainClass }--top`
const bottomClass = `${ mainClass }--bottom`
const leftClass = `${ mainClass }--left`
const rightClass = `${ mainClass }--right`
const centerClass = `${ mainClass }--center`
const middleClass = `${ mainClass }--middle`
const overlayClass = `${ ClassPrefix.RIGHT_PANEL }__overlay`

const popupState = {
  PADDING_ALL: `${ Labels.LAYOUT_PADDING }_all`,
  PADDING_TOP: `${ Labels.LAYOUT_PADDING }_top`,
  PADDING_BOTTOM: `${ Labels.LAYOUT_PADDING }_bottom`,
  PADDING_LEFT: `${ Labels.LAYOUT_PADDING }_left`,
  PADDING_RIGHT: `${ Labels.LAYOUT_PADDING }_right`,
  MARGIN_ALL: `${ Labels.LAYOUT_MARGIN }_all`,
  MARGIN_TOP: `${ Labels.LAYOUT_MARGIN }_top`,
  MARGIN_BOTTOM: `${ Labels.LAYOUT_MARGIN }_bottom`,
  MARGIN_LEFT: `${ Labels.LAYOUT_MARGIN }_left`,
  MARGIN_RIGHT: `${ Labels.LAYOUT_MARGIN }_right`,
  BORDER_ALL: `${ Labels.LAYOUT_BORDER }_all`,
  BORDER_TOP: `${ Labels.LAYOUT_BORDER }_top`,
  BORDER_BOTTOM: `${ Labels.LAYOUT_BORDER }_bottom`,
  BORDER_LEFT: `${ Labels.LAYOUT_BORDER }_left`,
  BORDER_RIGHT: `${ Labels.LAYOUT_BORDER }_right`,
  BORDER_TYPE: `${ Labels.LAYOUT_BORDER }_type`,
  POSITION_TOP: `${ Labels.LAYOUT_POSITION }_top`,
  POSITION_BOTTOM: `${ Labels.LAYOUT_POSITION }_bottom`,
  POSITION_LEFT: `${ Labels.LAYOUT_POSITION }_left`,
  POSITION_RIGHT: `${ Labels.LAYOUT_POSITION }_right`
}

export default {
  name: 'layoutProperties',
  data () {
    return {
      popup: false,
      popupState: '',
      hoveredLayout: ''
    }
  },
  methods: {
    hover (event, layout) {
      if (event.target === event.currentTarget) {
        this.hoveredLayout = layout
      }
    },
    openPopup (state) {
      this.popup = true
      this.popupState = state
    },
    closePopup () {
      this.popup = false
    }
  },
  render (h) {
    let overlayEl
    let overlayContainerEl
    if (this.popup) {
      switch (this.popupState) {
        case popupState.PADDING_TOP:
          overlayContainerEl = ''
          break
        case popupState.PADDING_BOTTOM:
          overlayContainerEl = ''
          break
        case popupState.PADDING_LEFT:
          overlayContainerEl = ''
          break
        case popupState.PADDING_RIGHT:
          overlayContainerEl = ''
          break
        case popupState.MARGIN_ALL:
          overlayContainerEl = ''
          break
        case popupState.MARGIN_TOP:
          overlayContainerEl = ''
          break
        case popupState.MARGIN_BOTTOM:
          overlayContainerEl = ''
          break
        case popupState.MARGIN_LEFT:
          overlayContainerEl = ''
          break
        case popupState.MARGIN_RIGHT:
          overlayContainerEl = ''
          break
        case popupState.BORDER_ALL:
          overlayContainerEl = ''
          break
        case popupState.BORDER_TOP:
          overlayContainerEl = ''
          break
        case popupState.BORDER_BOTTOM:
          overlayContainerEl = ''
          break
        case popupState.BORDER_LEFT:
          overlayContainerEl = ''
          break
        case popupState.BORDER_RIGHT:
          overlayContainerEl = ''
          break
        case popupState.BORDER_TYPE:
          overlayContainerEl = ''
          break
        case popupState.POSITION_TOP:
          overlayContainerEl = ''
          break
        case popupState.POSITION_BOTTOM:
          overlayContainerEl = ''
          break
        case popupState.POSITION_LEFT:
          overlayContainerEl = ''
          break
        case popupState.POSITION_RIGHT:
          overlayContainerEl = ''
          break
      }

      overlayEl = <div class={ overlayClass } onClick={ this.closePopup }>
        { overlayContainerEl }
        sdfsf
      </div>
    }

    const paddingClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_PADDING
    }
    const paddingEl = <div class={ [centerClass, paddingClass, paddingClasses] }
      onMouseover={ (e) => this.hover(e, Labels.LAYOUT_PADDING) }>
      <div class={ topClass }>
        <a onMousedown={ () => this.openPopup(popupState.PADDING_TOP) }>0px</a>
      </div>
      <div class={ middleClass }>
        <div class={ leftClass }>
          <a onMousedown={ () => this.openPopup(popupState.PADDING_LEFT) }>0px</a>
        </div>
        <div class={ centerClass }>
          <strong>
            <a onMousedown={ () => this.openPopup(popupState.PADDING_ALL) }>{ Labels.LAYOUT_PADDING }</a>
          </strong>
        </div>
        <div class={ rightClass }>
          <a onMousedown={ () => this.openPopup(popupState.PADDING_RIGHT) }>0px</a>
        </div>
      </div>
      <div class={ bottomClass }>
        <a onMousedown={ () => this.openPopup(popupState.PADDING_BOTTOM) }>0px</a>
      </div>
    </div>

    const borderClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_BORDER
    }
    const borderEl = <div class={ [centerClass, borderClasses, borderClass] }
      onMouseover={ (e) => this.hover(e, Labels.LAYOUT_BORDER) }>
      <div class={ topClass }>
        <strong><a onMousedown={ () => this.openPopup(popupState.BORDER_ALL) }>{ Labels.LAYOUT_BORDER }</a></strong>
        <a onMousedown={ () => this.openPopup(popupState.BORDER_TOP) }>0px</a>
        <a onMousedown={ () => this.openPopup(popupState.BORDER_TYPE) }>solid</a>
      </div>
      <div class={ middleClass }>
        <div class={ leftClass }>
          <a onMousedown={ () => this.openPopup(popupState.BORDER_LEFT) }>0px</a>
        </div>
        { paddingEl }
        <div class={ rightClass }>
          <a onMousedown={ () => this.openPopup(popupState.BORDER_RIGHT) }>0px</a>
        </div>
      </div>
      <div class={ bottomClass }>
        <a onMousedown={ () => this.openPopup(popupState.BORDER_BOTTOM) }>0px</a>
      </div>
    </div>

    const marginClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_MARGIN
    }
    const marginEl = <div class={ [centerClass, marginClasses, marginClass] }
      onMouseover={ (e) => this.hover(e, Labels.LAYOUT_MARGIN) }>
      <div class={ topClass }>
        <strong>
          <a onMousedown={ () => this.openPopup(popupState.MARGIN_ALL) }>{ Labels.LAYOUT_MARGIN }</a>
        </strong>
        <a onMousedown={ () => this.openPopup(popupState.MARGIN_TOP) }>0px</a>
        <span class='hidden'>{ Labels.LAYOUT_MARGIN }</span>
      </div>
      <div class={ middleClass }>
        <div class={ leftClass }>
          <a onMousedown={ () => this.openPopup(popupState.MARGIN_LEFT) }>0px</a>
        </div>
        { borderEl }
        <div class={ rightClass }>
          <a onMousedown={ () => this.openPopup(popupState.MARGIN_RIGHT) }>0px</a>
        </div>
      </div>
      <div class={ bottomClass }>
        <a onMousedown={ () => this.openPopup(popupState.MARGIN_BOTTOM) }>0px</a>
      </div>
    </div>

    const posClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_POSITION
    }
    const positionEl = <div class={ [centerClass, posClasses, positionClass] }
      onMouseover={ (e) => this.hover(e, Labels.LAYOUT_POSITION) }>
      <div class={ topClass }>
        <span>
          <strong>{ Labels.LAYOUT_POSITION }</strong>
          <a class='underlined'>absolute</a>
        </span>
        <a onMousedown={ () => this.openPopup(popupState.POSITION_TOP) }>0px</a>
        <a>z index 0</a>
      </div>
      <div class={ middleClass }>
        <div class={ leftClass }>
          <a onMousedown={ () => this.openPopup(popupState.POSITION_LEFT) }>0px</a>
        </div>
        { marginEl }
        <div class={ rightClass }>
          <a onMousedown={ () => this.openPopup(popupState.POSITION_RIGHT) }>0px</a>
        </div>
      </div>
      <div class={ bottomClass }>
        <a onMousedown={ () => this.openPopup(popupState.POSITION_BOTTOM) }>0px</a>
      </div>
    </div>

    return (
      <div class={ mainClass }>
        { positionEl }
        { overlayEl }
      </div>
    )
  }
}
</script>
