<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Tooltips, Icons} from '../../const'
import {SVGIcon} from '../../utils'

/* eslint-disable no-unused-vars */
import RemoveButton from '../fields/CloseButton'

const mainClass = `${ClassPrefix.CANVAS}-selector`
const selectedClass = `${mainClass}__selected`
const hoveredClass = `${mainClass}__hovered`
const hoveredDraggingClass = `${hoveredClass}--dragging`
const selectorToolClass = `${mainClass}-tools`
const breadcrumbClass = `${mainClass}-breadcrumbs`
const removeClass = `${mainClass}-remove`
const buttonClass = `${mainClass}-buttons`
const droplineClass = `${mainClass}-dropline`

export default {
  name: 'canvasElementSelector',
  computed: {
    ...mapGetters([
      'openBreadcrumbs',
      'selectedElement',
      'hoveredElement',
      'elementOffset',
      'breadcrumbs',
      'breadcrumb',
      'componentDragging',
      'elementDragging',
      'dropline'
    ])
  },
  methods: {
    ...mapActions([
      'noop',
      'selectElement',
      'hoverElement',
      'removeElement',
      'duplicateElement',
      'dropElement',
      'showBreadcrumbs'
    ])
  },
  data () {
    return {
      removeHover: false
    }
  },
  render (h) {
    let {selectedStyles, hoveredStyles} = {}

    const selectedHoverClass = {
      'hover--remove': this.removeHover
    }

    if (this.selectedElement && this.elementOffset.selected) {
      let {top, left, width, height} = this.elementOffset.selected
      selectedStyles = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    }

    let [lastBreadcrumb, restBreadcrumb] = [[], []]
    if (this.breadcrumbs.length > 0) {
      [lastBreadcrumb, ...restBreadcrumb] = this.breadcrumbs.slice().reverse()
    }

    const breadcrumbs = !this.openBreadcrumbs
      ? [lastBreadcrumb]
      : this.breadcrumbs

    const breadcrumbEls = breadcrumbs.map((item, index) => {
      const className = {
        'has-child': index !== breadcrumbs.length - 1
      }

      const onClick = event => {
        if (!this.openBreadcrumbs) {
          this.showBreadcrumbs()
        } else {
          this.selectElement(item.id)
        }
      }

      const onMouseOver = event => {
        this.hoverElement(item.id)
      }

      return <span class={className}>
        <a onClick={onClick} onMouseover={onMouseOver}>{item.label}</a>
      </span>
    })

    let removeElementBtn
    let copyElementBtn
    if (this.selectedElement && !this.selectedElement.dataObject.attrs.root) {
      const removeHover = event => {
        this.removeHover = true
      }

      const removeLeave = event => {
        this.removeHover = false
      }

      const removeClick = event => {
        this.removeElement(this.selectedElement.id)
          .then(nextElement => {
            this.selectElement(nextElement.id)
            this.removeHover = false
          })
      }

      removeElementBtn = <RemoveButton
        class={removeClass}
        nativeOnMouseover={removeHover}
        nativeOnMouseleave={removeLeave}
        nativeOnContextmenu={this.noop}
        nativeOnClick={removeClick}
      />

      const copyClick = event => {
        this.duplicateElement(this.selectedElement.id)
          .then(element => {
            if (element) {
              this.selectElement(element.id)
            }
          })
      }

      copyElementBtn = <a domPropsInnerHTML={SVGIcon(Icons.COPY)}
        onClick={copyClick}
        title={Tooltips.COPY_ELEMENT}
        uk-tooltip="pos: top" />
    }

    let hoverTools
    let droplineTools
    const hoveredNotSelected = this.hoveredElement && this.selectedElement.id !== this.hoveredElement.id
    const isDragging = this.componentDragging || this.elementDragging
    if ((hoveredNotSelected || isDragging) && this.elementOffset.hovered) {
      let {top, left, width, height} = this.elementOffset.hovered
      if (isDragging) {
        const gap = 4
        top -= gap
        left -= gap
        width += gap * 2
        height += gap * 2

        const droplineClasses = {
          'dropline--horizontal': this.dropline.position.top || this.dropline.position.bottom,
          'dropline--vertical': this.dropline.position.left || this.dropline.position.right
        }

        const {left: dLeft, top: dTop, width: dWidth, height: dHeight} = this.dropline.offset
        const droplineStyles = {
          left: `${dLeft + gap}px`,
          top: `${dTop + gap}px`,
          width: `${dWidth - (gap * 2)}px`
        }
        if (this.dropline.position.bottom) {
          droplineStyles.top = `${dTop - (gap / 2)}px`
          droplineStyles.left = `${dLeft - gap}px`
          droplineStyles.width = `${dWidth + (gap * 2)}px`
        }
        droplineTools = <div class={[droplineClass, droplineClasses]} style={droplineStyles} />
      }

      hoveredStyles = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }

      let activeClass = {}
      activeClass[hoveredClass] = true
      activeClass[hoveredDraggingClass] = isDragging

      hoverTools = <div class={activeClass} style={hoveredStyles}>
        <div class={selectorToolClass}>
          <div class={breadcrumbClass}>
            <span>{this.breadcrumb.label}</span>
          </div>
        </div>
      </div>
    }

    let selectTools
    if (!isDragging) {
      selectTools = <div class={[selectedClass, selectedHoverClass]} style={selectedStyles}>
        <div class={selectorToolClass}>
          <div class={breadcrumbClass}>{breadcrumbEls}</div>
          <div class={buttonClass}>
            {copyElementBtn}
          </div>
          {removeElementBtn}
        </div>
      </div>
    }

    return (
      <div class={mainClass}>
        {selectTools}
        {hoverTools}
        {droplineTools}
      </div>
    )
  }
}
</script>
