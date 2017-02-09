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
    let panel

    if (!this.previewMode) {
      panel = <div class={ClassPrefix.RIGHT_PANEL}>
        <RightPanelSwitcher />
        <PropertiesPanels />
      </div>
    }

    return panel
  }
}
</script>
