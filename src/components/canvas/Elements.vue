<script>
import $ from 'jquery'
import {mapGetters, mapActions} from 'vuex'
import {ClassName} from '../../utils'
import {DomType, VoidElements} from '../../const'

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
      'previewMode'
    ])
  },

  methods: {
    ...mapActions([
      'selectElement',
      'hoverElement',
      'hideBlockPanel'
    ])
  },

  render (createElement) {
    const click = event => {
      if (this.previewMode) {
        return
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
      const emptyNodes = !innerHTML && childNodes.length < 1 || innerHTML && innerHTML.length < 1

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
        mouseover
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