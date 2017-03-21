<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Icons} from '../../const'
import {SVGIcon} from '../../utils'
import uno from '../../client'

const mainClass = `${ClassPrefix.CANVAS}-block-component`
const addClass = `${mainClass}__add-button`
const boxClass = `${mainClass}__box`
const itemClass = `${mainClass}__block-item`
const blockItemsClass = `${mainClass}__block-items`

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
      'switchBlockItem'
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

    for (let id in blockList) {
      const item = uno.getBlockItem(id)
      const {group} = item.settings

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
        <a onClick={onClick} class={classes}>{item}</a>
      </li>
    })

    const blockItem = blockItemList.map(item => {
      if (item.settings.group !== this.openBlockPanel) {
        return
      }

      const onClick = event => {
        this.addElement({
          object: item.template,
          appendTo: this.rootElement.id,
          index: this.blockIndex
        })
        this.hideBlockPanel()
      }

      const styles = {
        backgroundImage: `url(${item.settings.icon})`
      }

      const imageClass = {
        'image': true,
        'no-image': !item.settings.icon
      }

      return <div class={itemClass}>
        <div class={imageClass} style={styles} onClick={onClick} />
        <div class="label">{item.settings.label}</div>
      </div>
    })

    const boxClasses = {
      'show': this.toggleBlockPanel
    }

    const addBlockStyles = {
      top: `${this.blockPosition - 15}px`
    }

    const boxStyles = {
      top: `${this.blockPosition}px`
    }

    const addOnClick = event => {
      this.toggleBlock()
      this.hideContextMenu()
    }

    return (
      <div class={mainClass}>
        <a class={addClass}
          onClick={addOnClick}
          onContextmenu={this.noop}
          domPropsInnerHTML={SVGIcon(Icons.ADD_BLOCK)}
          style={addBlockStyles} />
        <div class={[boxClass, boxClasses]} style={boxStyles}>
          <ul>{blockNav}</ul>
          <div class={blockItemsClass}>
            {blockItem}
          </div>
        </div>
      </div>
    )
  }
}
</script>
