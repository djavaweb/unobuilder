<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import RemoveButton from '../fields/CloseButton'

const mainClass = `${ClassPrefix.CANVAS}-selector`
const selectedClass = `${ClassPrefix.CANVAS}-selector__selected`
const selectorToolClass = `${selectedClass}-tools`
const breadcrumbClass = `${selectedClass}-breadcrumbs`
const removeClass = `${selectedClass}-remove`

export default {
  name: 'canvasElementSelector',
  computed: {
    ...mapGetters([
      'openBreadcrumbs',
      'selectedElement',
      'selectedOffset',
      'canvasScroll',
      'breadcrumbs'
    ])
  },
  methods: {
    ...mapActions([
      'selectElement',
      'removeElement',
      'showBreadcrumbs'
    ])
  },
  data () {
    return {
      removeHover: false
    }
  },
  render (h) {
    let selectedStyles = {}
    const selectedHoverClass = {
      'hover--remove': this.removeHover
    }
    const toolStyles = {
      top: `${this.canvasScroll.top}px`
    }

    if (this.selectedElement) {
      selectedStyles = this.selectedOffset
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

      return <span class={className}>
        <a onClick={onClick}>{item.label}</a>
      </span>
    })

    const removeHover = event => {
      this.removeHover = true
    }

    const removeLeave = event => {
      this.removeHover = false
    }

    const removeClick = event => {
      this.removeElement(this.selectedElement.id)
    }

    let removeElement
    if (this.selectedElement && !this.selectedElement.dataObject.attrs.root) {
      removeElement = <RemoveButton
        class={removeClass}
        nativeOnMouseover={removeHover}
        nativeOnMouseleave={removeLeave}
        nativeOnClick={removeClick}
      />
    }

    return (
      <div class={mainClass} style={toolStyles}>
        <div class={[selectedClass, selectedHoverClass]} style={selectedStyles}>
          <div class={selectorToolClass}>
            <div class={breadcrumbClass}>{breadcrumbEls}</div>
            {removeElement}
          </div>
        </div>
      </div>
    )
  }
}
</script>
