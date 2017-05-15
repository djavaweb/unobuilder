<script>
import { ClassPrefix } from '../../const'
import DnDMixin from '../../mixin/dnd'
const mainClass = `${ ClassPrefix.LEFT_PANEL }-component-items`
const itemClass = `${ ClassPrefix.MAIN }__grid-item`

export default {
  name: 'leftPanelComponentItem',
  mixins: [DnDMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  render (h) {
    const itemEls = this.items.map(item => {
      const styles = {
        backgroundImage: `url(${ item.settings.icon })`
      }

      const imageClass = {
        'image': true,
        'no-image': !item.settings.icon
      }

      const mousedown = (event) => {
        this.dragStart(event, 'component')
      }

      const key = `${ itemClass }--${ item._id }`

      return <div
        class={ itemClass }
        onMousedown={ mousedown }
        data-uno-component={ item.settings.id }
        key={ key }
        >
        <div class={ imageClass } style={ styles } />
        <div class='label'>{ item.settings.label }</div>
      </div>
    })

    const classes = {
      'margin-auto': this.items.length % 3 !== 0
    }

    return (
      <div class={ [mainClass, classes] }>{ itemEls }</div>
    )
  }
}
</script>
