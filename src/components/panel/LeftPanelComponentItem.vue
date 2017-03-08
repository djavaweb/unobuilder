<script>
import {ClassPrefix} from '../../const'

const mainClass = `${ClassPrefix.LEFT_PANEL}-component-items`
const itemClass = `${ClassPrefix.MAIN}__grid-item`

export default {
  name: 'leftPanelComponentItem',
  props: {
    items: {
      type: Array,
      default: () => []
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

      // Vue 2.2.1 must provide unique key to each list
      // https://vuejs.org/v2/guide/list.html#key
      const itemKey = 'left-panel-component-item--' + item._id

      return <div class={itemClass} key={itemKey}>
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
