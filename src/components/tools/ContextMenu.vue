<script>
import { mapActions, mapGetters } from 'vuex'
import { ClassPrefix } from '../../const'

const mainClass = `${ ClassPrefix.CANVAS }-context-menu`

const contextMenus = [
  {
    id: 'cut',
    label: 'Cut',
    shortcut: '&#8984;+x'
  },

  {
    id: 'copy',
    label: 'Copy',
    shortcut: '&#8984;+c'
  },

  {
    id: 'paste',
    label: 'Paste',
    shortcut: '&#8984;+v'
  },

  {
    id: 'delete',
    label: 'Delete',
    shortcut: 'del'
  },

  '-',

  {
    id: 'copy-style',
    label: 'Copy Style',
    shortcut: '&#8984;+&#8679;+c'
  },

  {
    id: 'paste-style',
    label: 'Paste Style',
    shortcut: '&#8984;+&#8679;+v'
  },

  {
    id: 'clear-style',
    label: 'Clear Style',
    shortcut: '&#8984;+&#8679;+del'
  },

  '-',

  {
    id: 'undo',
    label: 'Undo',
    shortcut: '&#8679;+z'
  },

  {
    id: 'redo',
    label: 'Redo',
    shortcut: '&#8679;+y'
  }
]

export default {
  name: 'contextMenu',
  computed: {
    ...mapGetters([
      'contextMenu',
      'contextMenuCoords'
    ])
  },
  methods: {
    ...mapActions([
      'noop'
    ])
  },
  render (h) {
    const { x, y } = this.contextMenuCoords
    const styles = {
      left: `${ x }px`,
      top: `${ y }px`
    }

    const contextMenuEls = contextMenus.map(item => {
      if (item === '-') {
        return <span class='separator'></span>
      }

      return <a onContextmenu={ this.noop }>
        <span class='label'>{ item.label }</span>
        <span class='shortcut' domPropsInnerHTML={ item.shortcut }></span>
      </a>
    })

    return (
      <div class={ mainClass } style={ styles }>{ contextMenuEls }</div>
    )
  }
}
</script>
