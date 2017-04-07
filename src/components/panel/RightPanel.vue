<script>
import { mapGetters } from 'vuex'
import { ClassPrefix } from '../../const'

/* eslint-disable no-unused-vars */
import RightPanelSwitcher from './RightPanelSwitcher'
import PropertiesPanels from './RightPanelProperties'

export default {
  name: 'rightPanel',
  computed: {
    ...mapGetters([
      'previewMode'
    ])
  },
  render (h) {
    const classes = {
      'animate--slide-out-right': this.previewMode,
      'animate--slide-in-right': !this.previewMode
    }

    return (
      <div class={ [ClassPrefix.RIGHT_PANEL, classes] }>
        <RightPanelSwitcher />
        <PropertiesPanels />
      </div>
    )
  }
}
</script>
