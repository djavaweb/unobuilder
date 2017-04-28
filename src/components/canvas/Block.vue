<script>
import { mapGetters, mapActions } from 'vuex'
import { ClassPrefix, Icons } from '../../const'
import { SVGIcon } from '../../utils'
import uno from 'uno'

const mainClass = `${ ClassPrefix.CANVAS }-block-component`
const addClass = `${ mainClass }__add-button`
const boxClass = `${ mainClass }__box`
const itemClass = `${ mainClass }__block-item`
const blockItemsClass = `${ mainClass }__block-items`

export default {
  name: 'canvasBlockComponent',
  computed: {
    ...mapGetters([
      'toggleBlockPanel',
      'rootElement',
      'blockIndex',
      'blockPosition',
      'openBlockPanel'
    ])
  },
  methods: {
    ...mapActions([
      'noop',
      'toggleBlock',
      'hideContextMenu',
      'hideBlockPanel',
      'addElement',
      'selectElement',
      'switchBlockItem',
      'setDefaultStyle'
    ])
  },
  data () {
    return {
      init: false
    }
  },
  render (h) {
    const blockList = uno.getBlockList()
    const blockNavList = []
    const blockItemList = []

    for (const id in blockList) {
      const item = uno.getBlockItem(id)
      const { group } = item.settings

      blockItemList.push(item)

      if (!this.init) {
        this.switchBlockItem(group)
      }

      if (!blockNavList.includes(group)) {
        blockNavList.push(group)
      }
    }

    const blockNav = blockNavList.map(item => {
      const onClick = event => {
        this.switchBlockItem(item)
      }
      const classes = {
        'active': this.openBlockPanel === item
      }
      return <li>
        <a onClick={ onClick } class={ classes }>{ item }</a>
      </li>
    })

    const blockItem = blockItemList.map((item, itemIndex) => {
      if (item.settings.group !== this.openBlockPanel) {
        return
      }

      const onClick = event => {
        this.addElement({
          name: Object.keys(blockList)[itemIndex],
          object: item.template,
          appendTo: this.rootElement.id,
          index: this.blockIndex
        }).then(object => {
          this.selectElement(object.id)
          this.setDefaultStyle(object)
          this.hideBlockPanel()
        })
      }

      const styles = {
        backgroundImage: `url(${ item.settings.icon })`
      }

      const imageClass = {
        'image': true,
        'no-image': !item.settings.icon
      }

      return <div class={ itemClass }>
        <div class={ imageClass } style={ styles } onClick={ onClick } />
        <div class='label'>{ item.settings.label }</div>
      </div>
    })

    const boxClasses = {
      'show': this.toggleBlockPanel
    }

    const addBlockStyles = {
      top: `${ this.blockPosition - 15 }px`
    }

    const boxStyles = {
      top: `${ this.blockPosition }px`
    }

    const addOnClick = event => {
      this.toggleBlock()
      this.hideContextMenu()
    }

    return (
      <div class={ mainClass }>
        <a class={ addClass }
          onClick={ addOnClick }
          onContextmenu={ this.noop }
          domPropsInnerHTML={ SVGIcon(Icons.ADD_BLOCK) }
          style={ addBlockStyles } />
        <div class={ [boxClass, boxClasses] } style={ boxStyles }>
          <ul>{ blockNav }</ul>
          <div class={ blockItemsClass }>
            { blockItem }
          </div>
        </div>
      </div>
    )
  }
}
</script>
