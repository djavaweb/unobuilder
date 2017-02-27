<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Tooltips, Icons} from '../../const'
import {SVGIcon} from '../../utils'

/* eslint-disable no-unused-vars */
import RemoveButton from '../fields/CloseButton'

const mainClass = `${ClassPrefix.CANVAS}-selector`
const selectedClass = `${mainClass}__selected`
const hoveredClass = `${mainClass}__hovered`
const selectorToolClass = `${mainClass}-tools`
const breadcrumbClass = `${mainClass}-breadcrumbs`
const removeClass = `${mainClass}-remove`
const buttonClass = `${mainClass}-buttons`

export default {
  name: 'canvasElementSelector',
  computed: {
    ...mapGetters([
      'openBreadcrumbs',
      'selectedElement',
      'hoveredElement',
      'selectedOffset',
      'hoveredOffset',
      'canvasScroll',
      'breadcrumbs',
      'breadcrumb'
    ])
  },
  methods: {
    ...mapActions([
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
    const toolStyles = {
      top: `${this.canvasScroll.top}px`
    }

    if (this.selectedElement) {
      let {top, left, width, height} = this.selectedOffset
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
        this.removeHover = false
      }

      removeElementBtn = <RemoveButton
        class={removeClass}
        nativeOnMouseover={removeHover}
        nativeOnMouseleave={removeLeave}
        nativeOnClick={removeClick}
      />

      const copyClick = event => {
        this.duplicateElement(this.selectedElement.id)
      }

      copyElementBtn = <a domPropsInnerHTML={SVGIcon(Icons.COPY)}
        onClick={copyClick}
        title={Tooltips.COPY_ELEMENT}
        uk-tooltip="pos: top" />
    }

    let hoverTools
    if (this.hoveredElement && this.selectedElement.id !== this.hoveredElement.id) {
      let {top, left, width, height} = this.hoveredOffset
      hoveredStyles = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }

      hoverTools = <div class={[hoveredClass]} style={hoveredClass} style={hoveredStyles}>
        <div class={selectorToolClass}>
          <div class={breadcrumbClass}>
            <span>{this.breadcrumb.label}</span>
          </div>
        </div>
      </div>
    }

    return (
      <div class={mainClass} style={toolStyles}>
        <div class={[selectedClass, selectedHoverClass]} style={selectedStyles}>
          <div class={selectorToolClass}>
            <div class={breadcrumbClass}>{breadcrumbEls}</div>
            <div class={buttonClass}>
              {copyElementBtn}
            </div>
            {removeElementBtn}
          </div>
        </div>
        {hoverTools}
      </div>
    )
  }
}
</script>
