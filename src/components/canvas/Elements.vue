<script>
import $ from 'jquery'
import Uno from 'uno'
import {mapGetters, mapActions} from 'vuex'
import {
  addEvent,
  removeEvent,
  ClassName,
  SelectorAttrId,
  dragElement
} from '../../utils'
import {
  MoveAction,
  DomType,
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
      'elementDragging'
    ])
  },

  methods: {
    ...mapActions([
      'selectElement',
      'hoverElement',
      'hideBlockPanel',
      'showContextMenu',
      'hideContextMenu',
      'setContextCoords',
      'disableDragComponent',
      'addElement',
      'enableDragElement',
      'disableDragElement',
      'moveElement'
    ])
  },

  data () {
    return {
      dragState: {
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

      let {x, y, which} = event

      if (which === 3) {
        y += Math.abs(this.canvasScroll.top)
        this.setContextCoords({x, y})
        this.showContextMenu()
      } else if (which === 1) {
        this.hideContextMenu()
      }

      this.selectElement(event.target)
      if (this.toggleBlockPanel) {
        this.hideBlockPanel()
      }
    }

    const mouseover = event => {
      if (!this.previewMode && !this.toggleBlockPanel) {
        this.hoverElement(event.target)
      }
    }

    const mouseup = event => {
      const {target, currentTarget} = event
      if (this.componentDragging) {
        if (target === currentTarget) {
          const item = Uno.getComponentItem(this.componentActive)
          this.addElement({
            object: item.template,
            appendTo: target.getAttribute(SelectorAttrId),
            index: 0
          })
        }
      }
      if (this.elementDragging) {
        if (target === currentTarget && target !== this.dragState.element) {
          let id = target.getAttribute(SelectorAttrId)
          if (!id) return false

          this.dragState.element.remove()
          this.disableDragElement()

          removeEvent(this.iframeDocument, 'mousemove', mousemove, false)
          removeEvent(this.iframeDocument, 'mouseup', mouseup, false)

          const stateElId = this.dragState.element.getAttribute(SelectorAttrId)
          if (stateElId !== id) {
            console.log(`
            ${MoveAction.CUT} Element with id: ${stateElId}, moved to element with id: ${id}
            `)
            this.moveElement({
              action: MoveAction.CUT,
              appendTo: id,
              id: stateElId
            })
          }
        }
      }
    }

    const mousedown = event => {
      const {target, currentTarget, pageX, pageY} = event
      if (target === currentTarget) {
        this.dragState.element = target.cloneNode(true)
        this.dragState.element.style.position = 'absolute'
        this.dragState.element.classList.add('element-dragged')

        document.body.appendChild(this.dragState.element)

        addEvent(this.iframeDocument, 'mousemove', mousemove, false)
        addEvent(this.iframeDocument, 'mouseup', mouseup, false)

        this.dragState.x = pageX
        this.dragState.y = pageY

        this.enableDragElement(target.getAttribute(SelectorAttrId))
      }
    }

    const mousemove = event => {
      let {pageX, pageY} = event
      if (this.elementDragging) {
        this.dragState.x = pageX
        this.dragState.y = pageY

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

      const { tagName, selected } = node
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
      for (let i in classEvents) {
        classEvents[i].className.forEach(className => {
          classes[className] = classEvents[i].occurs
        })
      }

      dataObject = Object.assign({}, dataObject)
      dataObject.class = Object.assign(dataObject.class, classes)
      dataObject.on = {
        click,
        mouseover,
        mouseup,
        mousedown,
        mousemove,
        contextmenu: click
      }

      childNodes = childNodes.map(
        item => item.domType === DomType.TEXT
          ? item.dataObject.domProps.innerHTML
          : renderElement(item)
      )

      return createElement(tagName, dataObject, childNodes)
    }

    return renderElement(this.node)
  }
}
</script>
