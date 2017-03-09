<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../../const'
import {addEvent, removeEvent} from '../../utils'

const mainClass = `${ClassPrefix.LEFT_PANEL}-component-items`
const itemClass = `${ClassPrefix.MAIN}__grid-item`
const itemDraggingClass = `${itemClass}--dragging`

export default {
  name: 'leftPanelComponentItem',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dragState: {
        element: undefined,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'iframeBody',
      'iframeDocument',
      'iframeOffset',
      'canvasScroll',
      'componentDragging'
    ])
  },
  methods: {
    ...mapActions([
      'hideLeftPanels',
      'enableDragComponent',
      'disableDragComponent'
    ]),
    /**
     * Move element position
     *
     * @param {DOMObject} target
     * @return void
     */
    moveElement (target) {
      if (target === undefined) return false
      let {left, top} = this.iframeOffset

      let {x, y} = this.dragState
      let rect = target.getBoundingClientRect()
      let {width, height} = rect
      target.style.top = `${y - (height / 2) + top + this.canvasScroll.top}px`
      target.style.left = `${x - (width / 2) + left}px`
    },
    dragStart (event) {
      let {target, pageX, pageY} = event

      this.dragState.element = target.cloneNode(true)
      this.dragState.element.style.pointerEvents = 'none'
      this.dragState.element.classList.add(itemDraggingClass)

      document.body.appendChild(this.dragState.element)

      this.dragState.x = pageX
      this.dragState.y = pageY

      // Start event dragging on document iframe
      addEvent(this.iframeDocument, 'mousemove', this.dragMove, false)
      addEvent(this.iframeDocument, 'mouseup', this.dragEnd, false)

      this.enableDragComponent()
      this.hideLeftPanels()
    },
    dragMove (event) {
      if (!this.componentDragging) return false

      let {pageX, pageY} = event

      this.dragState.x = pageX
      this.dragState.y = pageY

      // Move element UI
      this.moveElement(this.dragState.element)
    },
    dragEnd (event, moving) {
      this.dragState.element.remove()
      this.disableDragComponent()

      // remove event dragging on document iframe
      removeEvent(this.iframeDocument, 'mousemove', this.dragMove, false)
      removeEvent(this.iframeDocument, 'mouseup', this.dragEnd, false)

      // do something when dropped
    }
  },
  render (h) {
    const itemEls = this.items.map(item => {
      const styles = {
        backgroundImage: `url(${item.settings.icon})`
      }

      const imageClass = {
        'image': true,
        'no-image': !item.settings.icon
      }

      return <div
        class={itemClass}
        onMousedown={this.dragStart}>
        <div class={imageClass} style={styles} />
        <div class="label">{item.settings.label}</div>
      </div>
    })

    const classes = {
      'margin-auto': this.items.length % 3 !== 0
    }

    return (
      <div class={[mainClass, classes]}>{itemEls}</div>
    )
  }
}
</script>
