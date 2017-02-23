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
      'canvasScroll',
      'toggleBlockPanel',
      'rootElement',
      'blockIndex',
      'blockPosition'
    ])
  },
  methods: {
    ...mapActions([
      'toggleBlock',
      'hideBlockPanel',
      'addElement'
    ])
  },
  render (h) {
    const blockList = uno.getBlockList()
    const blockNavList = []
    const blockItemList = []

    const blockStyles = {
      top: `${this.canvasScroll.top}px`
    }

    Object.values(blockList).forEach(item => {
      blockItemList.push(item)
      if (!blockNavList.includes(item.settings.group)) {
        blockNavList.push(item.settings.group)
      }
    })

    const blockNav = blockNavList.map(item => {
      const onClick = event => {}

      const classes = {
        'active': true
      }
      return <li><a onClick={onClick} class={classes}>{item}</a></li>
    })

    const blockItem = blockItemList.map(item => {
      const onClick = event => {
        this.addElement({
          markupText: item.template,
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

    return (
      <div class={mainClass} style={blockStyles}>
        <a class={addClass} onClick={this.toggleBlock}
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
