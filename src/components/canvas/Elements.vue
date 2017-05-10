<script>
import $ from 'jquery'
import Uno from 'uno'
import { mapGetters, mapActions } from 'vuex'
import {
  addEvent,
  removeEvent,
  ClassName,
  SelectorAttrId,
  dragElement
} from '../../utils'
import {
  MoveAction,
  VoidElements
} from '../../const'

const className = {
  SELECTED: ClassName('selected'),
  AFFECTED: ClassName('affected'),
  RICH_TEXT_ELEMENT: ClassName('rich-text-element'),
  EMPTY: ClassName('empty')
}

export default {
  name: 'elements',
  props: {
    node: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapGetters([
      'toggleBlockPanel',
      'canvasScroll',
      'previewMode',
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
      'selectElement',
      'reselectElement',
      'hoverElement',
      'hideBlockPanel',
      'showContextMenu',
      'hideContextMenu',
      'setContextCoords',
      'disableDragComponent',
      'addElement',
      'enableDragElement',
      'disableDragElement',
      'moveElement',
      'setDropline',
      'setDefaultStyle',
      'selectElement',
      'setAttrsElement',
      'removeAttrsElement',
      'editContent',
      'saveEditable'
    ]),

    resetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
        this.dragState.intervalCount = 0
      }
    },

    setAttrs (options) {
      if (!options.id) return false

      return Promise.resolve(this.setAttrsElement(options))
    },

    removeAttrs (options) {
      if (!options.id && !options.name) return false

      return Promise.resolve(this.removeAttrsElement(options))
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
  },

  render (createElement) {
    const click = event => {
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
    }

    const mouseover = event => {
      if (!this.previewMode && !this.toggleBlockPanel) {
        this.hoverElement(event.target)
      }
    }

    const mouseup = event => {
      this.resetInterval()
      const { target, currentTarget } = event
      // what we do when component (from left panel) dropped
      if (this.componentDragging) {
        if (target === currentTarget) {
          const item = Uno.getComponentItem(this.componentActive)
          this.addElement({
            name: this.componentActive,
            object: item.template,
            appendTo: target.getAttribute(SelectorAttrId),
            index: 0
          }).then(object => {
            this.selectElement(object.id).then(() => this.$forceUpdate())
            this.setDefaultStyle(object)
          })
        }
      }
      // what we do when element (from builder canvas it self) dropped
      if (this.elementDragging) {
        this.dragState.element.remove()

        if (target === currentTarget && target !== this.dragState.element) {
          const id = this.dropline.target
          if (!id) return false

          removeEvent(this.iframeDocument, 'mousemove', mousemove, false)
          removeEvent(this.iframeDocument, 'mouseup', mouseup, false)

          const stateElId = this.dragState.element.getAttribute(SelectorAttrId)
          if (stateElId !== id) {
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

        this.disableDragElement()
      }
    }

    const dragStart = event => {
      const { target, pageX, pageY } = event

      this.dragState.element = target.cloneNode(true)
      this.dragState.element.style.position = 'absolute'
      this.dragState.element.classList.add('element-dragged')

      document.body.appendChild(this.dragState.element)

      addEvent(this.iframeDocument, 'mousemove', mousemove, false)
      addEvent(this.iframeDocument, 'mouseup', mouseup, false)

      this.dragState.x = pageX
      this.dragState.y = pageY

      // Move element UI
      dragElement(this.dragState.element, {
        iframeWindow: this.iframeWindow,
        state: this.dragState,
        canvasScrollTop: this.canvasScroll.top
      })

      this.enableDragElement(target.getAttribute(SelectorAttrId))
    }

    const mousedown = event => {
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
            dragStart(event)
          }
          this.dragState.intervalCount++
        }, 100)
      }
    }

    const mousemove = event => {
      if (this.interval) {
        this.dragState.intervalCount = 3
      }

      if (this.elementDragging) {
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
    }

    const renderElement = node => {
      if (typeof node === 'string') {
        return node
      }

      let { dataObject, childNodes } = node

      childNodes = childNodes.map(
        item => typeof item === 'string' ? $.trim(item) : item
      ).filter(item => item)

      const { tagName, selected, editable } = node
      const { innerHTML } = dataObject.domProps

      const notVoidElements = !VoidElements.includes(tagName)
      const emptyNodes = (!innerHTML && childNodes.length < 1) || (innerHTML && innerHTML.length < 1)

      const classEvents = {
        IS_CHILD_NODES_EMPTY: {
          occurs: emptyNodes && notVoidElements,
          className: [className.EMPTY]
        },
        IS_SELECTED: {
          occurs: selected,
          className: [className.SELECTED, className.AFFECTED]
        },
        IS_EDIT_MODE: {
          occurs: dataObject.attrs.contenteditable,
          className: [className.RICH_TEXT_ELEMENT]
        },
        UK_GRID_LARGE: {
          occurs: dataObject.domProps.gutter && dataObject.domProps.gutter.large,
          className: ['uk-grid-large']
        },
        UK_GRID_MEDIUM: {
          occurs: dataObject.domProps.gutter && dataObject.domProps.gutter.medium,
          className: ['uk-grid-medium']
        },
        UK_GRID_SMALL: {
          occurs: dataObject.domProps.gutter && dataObject.domProps.gutter.small,
          className: ['uk-grid-small']
        },
        UK_GRID_COLLAPSE: {
          occurs: dataObject.domProps.gutter && dataObject.domProps.gutter.none,
          className: ['uk-grid-collapse']
        }
      }

      const classes = {}
      for (const i in classEvents) {
        classEvents[i].className.forEach(className => {
          classes[className] = classEvents[i].occurs
        })
      }

      dataObject = Object.assign({}, dataObject)
      if (Object.keys(classes).length > 0 && node.kind) {
        dataObject.class = Object.assign(dataObject.class, classes)
      }

      const dataObjectEvents = {
        click,
        mouseover,
        mouseup,
        mousedown,
        mousemove,
        contextmenu: click
      }

      if (editable) {
        dataObjectEvents.dblclick = event => {
          this.editContent(node.id).then(() => {
            this.$forceUpdate()
          })
        }

        dataObjectEvents.input = event => {
          this.selectElement(node.id).then(() => this.$forceUpdate())
        }

        dataObjectEvents.keydown = event => {
          if (!event.target.getAttribute('contenteditable')) {
            return
          }

          const keyCode = {
            ENTER: 13
          }

          switch (event.keyCode) {
            case keyCode.ENTER:
              this.iframeDocument.execCommand('insertHTML', false, '<br>')
              event.preventDefault()
              event.stopPropagation()
              break
            default:
              break
          }
        }
      }

      if (node.name) {
        const { events } = Uno.getComponentItem(node.name) || Uno.getBlockItem(node.name)
        dataObject.on = Object.assign(events, dataObjectEvents)
      } else {
        dataObject.on = dataObjectEvents
      }

      if (childNodes.length === 1 && !childNodes[0].kind) {
        dataObject.domProps.innerHTML = childNodes[0]
      } else {
        childNodes = childNodes.map(
          item => renderElement(item)
        )
      }

      if (!node.kind) {
        delete dataObject.attrs['data-uno-id']
        delete dataObject.class
      }

      return createElement(tagName, dataObject, childNodes)
    }

    return renderElement(this.node)
  }
}
</script>
