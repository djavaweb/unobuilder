<script>
import $ from 'jquery'
import Uno from 'uno'
import { mapGetters, mapActions } from 'vuex'
import DnDMixin from '../../mixin/dnd'
import {
  ClassName
} from '../../utils'
import {
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
  mixins: [DnDMixin],
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
      'previewMode'
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
      'setDefaultStyle',
      'selectElement',
      'setAttrsElement',
      'removeAttrsElement',
      'editContent',
      'saveEditable'
    ]),

    setAttrs (options) {
      if (!options.id) return false

      return Promise.resolve(this.setAttrsElement(options))
    },

    removeAttrs (options) {
      if (!options.id && !options.name) return false

      return Promise.resolve(this.removeAttrsElement(options))
    }
  },

  render (createElement) {
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
        click: this.click,
        mouseover: this.mouseover,
        mouseup: this.mouseup,
        mousedown: this.mousedown,
        mousemove: this.mousemove,
        contextmenu: this.click
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
