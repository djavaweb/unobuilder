<script>
import {mapGetters} from 'vuex'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import RightPanelSwitcher from './rightPanelSwitcher'
import PropertiesPanels from './rightPanelProperties'

export default {
  name: 'rightPanel',
  computed: {
    ...mapGetters([
      'previewMode'
    ])
  },
  render (h) {
    let classes = {}
    classes['animate--slide-out-right'] = this.previewMode
    classes['animate--slide-in-right'] = !this.previewMode

    return (
      <div class={[ClassPrefix.RIGHT_PANEL, classes]}>
        <RightPanelSwitcher />
        <PropertiesPanels />
      </div>
    )
  }
}
</script>
