<script>
import {ClassPrefix} from '../../const'
import uno from '../../client'

const mainClass = `${ClassPrefix.CANVAS}-block-component`

export default {
  name: 'canvasBlockComponent',
  render (h) {
    const blockList = uno.getBlockList()
    const blockNavList = []

    Object.values(blockList).forEach(item => {
      if (!blockNavList.includes(item.settings.group)) {
        blockNavList.push(item.settings.group)
      }
    })

    const blockNav = blockNavList.map(item => {
      const onClick = event => {
      }
      return <li><a onClick={onClick}>{item}</a></li>
    })

    return (
      <div class={mainClass}>
        <ul>{blockNav}</ul>
      </div>
    )
  }
}
</script>
