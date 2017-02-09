<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Labels, Icons, Tooltips, ButtonType} from '../../const'
/* eslint-disable no-unused-vars */
import Button from '../fields/Button'

const mainClass = `${ClassPrefix.TOP_PANEL}-state-toolbar`

export default {
  name: 'topPanelState',
  computed: {
    ...mapGetters([
      'previewMode'
    ])
  },
  methods: {
    ...mapActions([
      'togglePreview'
    ])
  },
  render (h) {
    const undo = {
      attrs: {
        title: Tooltips.UNDO_CHANGES,
        'uk-tooltip': true
      },
      props: {
        icon: Icons.UNDO,
        type: ButtonType.BORDERED,
        disabled: this.previewMode
      }
    }

    const redo = {
      attrs: {
        title: Tooltips.REDO_CHANGES,
        'uk-tooltip': true
      },
      props: {
        icon: Icons.REDO,
        type: ButtonType.BORDERED,
        disabled: this.previewMode
      }
    }

    const preview = {
      attrs: {
        title: Tooltips.PREVIEW,
        'uk-tooltip': true
      },
      props: {
        icon: Icons.PREVIEW
      }
    }

    const previewClick = event => {
      this.togglePreview()
    }

    const save = {
      attrs: {
        title: Tooltips.SAVE_CHANGES,
        'uk-tooltip': true
      },
      props: {
        icon: Icons.SAVE,
        label: Labels.SAVE,
        disabled: this.previewMode
      }
    }

    return (
      <div class={mainClass}>
        <Button {...{attrs: undo.attrs, props: undo.props}} />
        <Button {...{attrs: redo.attrs, props: redo.props}} />
        <Button nativeOnClick={previewClick}
          {...{attrs: preview.attrs, props: preview.props}} />
        <Button {...{attrs: save.attrs, props: save.props}} />
      </div>
    )
  }
}
</script>
