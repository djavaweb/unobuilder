import Uno from 'uno'
import { mapGetters, mapActions } from 'vuex'
import {
  addEvent,
  removeEvent,
  SelectorAttrId,
  SelectorAttrComponent,
  dragElement
} from '../utils'
import {
  MoveAction,
  ClassPrefix
} from '../const'

export default {
  computed: {
    ...mapGetters([
      'componentDragging',
      'componentActive',
      'iframeWindow',
      'iframeDocument',
      'canvasScroll',
      'elementDragging',
      'dropline',
      'editable',
      'elementHelpers'
    ])
  },

  methods: {
    ...mapActions([
      'enableDragComponent',
      'disableDragComponent',
      'addElement',
      'enableDragElement',
      'disableDragElement',
      'moveElement',
      'setDropline',
      'resetDropline',
      'hideLeftPanels'
    ]),

    click (event) {
      event.preventDefault()
      event.stopPropagation()

      if (this.previewMode) {
        return
      }

      const { x, which } = event
      let { y } = event

      if (which === 3) {
        y += Math.abs(this.canvasScroll.top)
        this.setContextCoords({ x, y })
        this.showContextMenu()
      } else if (which === 1) {
        this.hideContextMenu()
      }

      this.selectElement(event.target).then(() => {
        this.$forceUpdate()
        if (this.toggleBlockPanel) {
          this.hideBlockPanel()
        }
      })
    },

    mouseover (event) {
      if (!this.previewMode && !this.toggleBlockPanel) {
        this.hoverElement(event.target)
      }
    },

    async mouseup (event, type) {
      this.resetInterval()
      const { target, currentTarget } = event

      // what we do when component (from left panel) dropped
      if (this.componentDragging) {
        if (target === currentTarget) {
          removeEvent(document, 'mousemove', this.mousemove, false)
          removeEvent(document, 'mouseup', this.mouseup, false)

          const item = await Uno.getComponentItemById(this.componentActive)
          const id = this.dropline.target
          this.addElement({
            name: await Uno.getComponentNameById(this.componentActive),
            object: item.template,
            appendTo: id,
            index: this.dropline.index
          }).then(object => {
            this.selectElement(object.id).then(() => this.$forceUpdate())
            this.setDefaultStyle(object)
          })
        }
        this.disableDragComponent()
      }

      // what we do when element (from builder canvas it self) dropped
      if (this.elementDragging) {
        if (!this.dragState.element) return
        this.dragState.element.remove()

        if (target === currentTarget && target !== this.dragState.element) {
          const id = this.dropline.target
          if (!id) return false

          removeEvent(this.iframeDocument, 'mousemove', this.mousemove, false)
          removeEvent(this.iframeDocument, 'mouseup', this.mouseup, false)

          const stateElId = this.dragState.element.getAttribute(SelectorAttrId)
          console.log(this.componentDragging)
          if (!this.componentDragging && stateElId !== id) {
            this.moveElement({
              action: MoveAction.CUT,
              appendTo: id,
              id: stateElId,
              index: this.dropline.index
            }).then(element => {
              this.selectElement(id)
            })
          }
        }
      }

      this.disableDragElement()
      // Little hack
      if (this.dragState.element) {
        this.dragState.element.remove()
      }
    },

    dragStart (event, type) {
      const { target, pageX, pageY } = event

      this.dragState.element = target.cloneNode(true)

      if (type === 'component') {
        const itemClass = `${ ClassPrefix.MAIN }__grid-item`
        const itemDraggingClass = `${ itemClass }--dragging`
        this.dragState.element.style.pointerEvents = 'none'
        this.dragState.element.classList.add(itemDraggingClass)
      } else {
        this.dragState.element.style.position = 'absolute'
        this.dragState.element.classList.add('element-dragged')
      }

      document.body.appendChild(this.dragState.element)

      if (type === 'component') {
        addEvent(document, 'mousemove', this.mousemove, false)
        addEvent(document, 'mouseup', this.mouseup, false)
      }

      addEvent(this.iframeDocument, 'mousemove', this.mousemove, false)
      addEvent(this.iframeDocument, 'mouseup', this.mouseup, false)

      this.dragState.x = pageX
      this.dragState.y = pageY

      // Move element UI
      dragElement(this.dragState.element, {
        iframeWindow: this.iframeWindow,
        state: this.dragState,
        canvasScrollTop: this.canvasScroll.top
      })

      let elementId = target.getAttribute(SelectorAttrId)
      if (type === 'component') {
        const componentName = target.getAttribute(SelectorAttrComponent)
        elementId = Uno.getComponentItem(componentName)._id
        this.enableDragComponent(elementId)
      }

      this.enableDragElement({
        id: elementId,
        force: type === 'component'
      })
      this.hideLeftPanels()
    },

    mousedown (event) {
      const { target, currentTarget, which } = event

      if (which === 3) {
        return false
      }

      const element = target.getAttribute(SelectorAttrId)
      const elementObj = this.elementHelpers.getElementObject(element)
      if (
        elementObj && elementObj.kind &&
        target === currentTarget &&
        this.editable !== element
      ) {
        this.interval = setInterval(() => {
          if (this.dragState.intervalCount > 2) {
            this.resetInterval()
            this.dragStart(event)
          }
          this.dragState.intervalCount++
        }, 100)
      }
    },

    mousemove (event) {
      if (this.interval) {
        this.dragState.intervalCount = 3
      }

      if (this.elementDragging || this.componentDragging) {
        const { target, pageX: x, pageY: y } = event
        this.dragState.x = x
        this.dragState.y = y

        const targetId = target.getAttribute(SelectorAttrId)
        const dropline = {
          index: 0,
          element: targetId,
          target: targetId,
          position: {},
          offset: {},
          coords: {
            x,
            y
          }
        }
        const targetBounds = target.getBoundingClientRect()
        let { left, top } = targetBounds
        const { width, height } = targetBounds

        const remains = {
          left: x - left,
          top: (y - top) + this.canvasScroll.top
        }

        // const isLeft = remains.left < width - 10
        const isTop = remains.top < height - 10

        const iframeOffset = this.iframeWindow.frameElement.getBoundingClientRect()
        // Horizontal
        if (isTop) {
          dropline.position.top = true
          top += iframeOffset.top
          left += iframeOffset.left
        } else {
          dropline.position.bottom = true
          top += iframeOffset.top + height
          left += iframeOffset.left
        }
        dropline.offset = {
          top,
          left,
          height,
          width
        }

        this.setDropline(dropline)

        // Move element UI
        dragElement(this.dragState.element, {
          iframeWindow: this.iframeWindow,
          state: this.dragState,
          canvasScrollTop: this.canvasScroll.top
        })
      }
    },

    resetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
        this.dragState.intervalCount = 0
        this.resetDropline()
      }
    }
  },

  data () {
    return {
      interval: null,
      dragState: {
        intervalCount: 0,
        element: null,
        x: 0,
        y: 0
      }
    }
  }
}
