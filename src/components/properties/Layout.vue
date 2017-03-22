<script>
import {ClassPrefix, Labels} from '../../const'

const mainClass = `${ClassPrefix.RIGHT_PANEL}-layout-box`
const positionClass = `${mainClass}__position`
const marginClass = `${mainClass}__margin`
const borderClass = `${mainClass}__border`
const paddingClass = `${mainClass}__padding`
const topClass = `${mainClass}--top`
const bottomClass = `${mainClass}--bottom`
const leftClass = `${mainClass}--left`
const rightClass = `${mainClass}--right`
const centerClass = `${mainClass}--center`
const middleClass = `${mainClass}--middle`
const overlayClass = `${ClassPrefix.RIGHT_PANEL}__overlay`

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
      overlayContainerEl = 'baba'
      overlayEl = <div class={overlayClass} onClick={this.closePopup}>
        {overlayContainerEl}
      </div>
    }

    const paddingClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_PADDING
    }
    const paddingEl = <div class={[centerClass, paddingClass, paddingClasses]}
      onMouseover={(e) => this.hover(e, Labels.LAYOUT_PADDING)}>
      <div class={topClass}>
        <a>0px</a>
      </div>
      <div class={middleClass}>
        <div class={leftClass}>
          <a>0px</a>
        </div>
        <div class={centerClass}>
          <strong><a>{Labels.LAYOUT_PADDING}</a></strong>
        </div>
        <div class={rightClass}>
          <a>0px</a>
        </div>
      </div>
      <div class={bottomClass}>
        <a>0px</a>
      </div>
    </div>

    const borderClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_BORDER
    }
    const borderEl = <div class={[centerClass, borderClasses, borderClass]}
      onMouseover={(e) => this.hover(e, Labels.LAYOUT_BORDER)}>
      <div class={topClass}>
        <strong><a>{Labels.LAYOUT_BORDER}</a></strong>
        <a>0px</a>
        <a>solid</a>
      </div>
      <div class={middleClass}>
        <div class={leftClass}>
          <a>0px</a>
        </div>
        {paddingEl}
        <div class={rightClass}>
          <a>0px</a>
        </div>
      </div>
      <div class={bottomClass}>
        <a>0px</a>
      </div>
    </div>

    const marginClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_MARGIN
    }
    const marginEl = <div class={[centerClass, marginClasses, marginClass]}
      onMouseover={(e) => this.hover(e, Labels.LAYOUT_MARGIN)}>
      <div class={topClass}>
        <strong><a>{Labels.LAYOUT_MARGIN}</a></strong>
        <a>0px</a>
        <span class="hidden">{Labels.LAYOUT_MARGIN}</span>
      </div>
      <div class={middleClass}>
        <div class={leftClass}>
          <a>0px</a>
        </div>
        {borderEl}
        <div class={rightClass}>
          <a>0px</a>
        </div>
      </div>
      <div class={bottomClass}>
        <a>0px</a>
      </div>
    </div>

    const posClasses = {
      hover: this.hoveredLayout === Labels.LAYOUT_POSITION
    }
    const positionEl = <div class={[centerClass, posClasses, positionClass]}
      onMouseover={(e) => this.hover(e, Labels.LAYOUT_POSITION)}>
      <div class={topClass}>
        <span><strong>{Labels.LAYOUT_POSITION}</strong> <a class="underlined">absolute</a></span>
        <a>0px</a>
        <a>z index 0</a>
      </div>
      <div class={middleClass}>
        <div class={leftClass}>
          <a>0px</a>
        </div>
        {marginEl}
        <div class={rightClass}>
          <a>0px</a>
        </div>
      </div>
      <div class={bottomClass}>
        <a>0px</a>
      </div>
    </div>

    return (
      <div class={mainClass}>
        {positionEl}
        {overlayEl}
      </div>
    )
  }
}
</script>
