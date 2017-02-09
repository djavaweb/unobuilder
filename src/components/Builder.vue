<script>
import uno from 'uno'
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../const'

/* eslint-disable no-unused-vars */
import ScreenDetector from './tools/ScreenDetector'
import LeftPanel from './panel/LeftPanel'
import TopPanel from './panel/TopPanel'
import RightPanel from './panel/RightPanel'
import Workspace from './panel/WorkspacePanel'

export default {
  name: 'builder',
  computed: {
    ...mapGetters([
      'hoverStatus'
    ])
  },
  methods: {
    ...mapActions([
      'hoverLeftPanel',
      'hoverTopPanel',
      'hoverRightPanel',
      'hoverCenterPanel',
      'togglePreview'
    ])
  },
  created () {
    this.$nextTick(() => {
      uno.emit('ready')
      this.togglePreview()
    })
  },
  render (h) {
    return (
      <div class={ClassPrefix.MAIN}>
        <ScreenDetector ref="screenDetector" />
        <TopPanel ref="topPanel" onMouseOver={this.hoverTopPanel} />
        <LeftPanel ref="leftPanel" onMouseOver={this.hoverLeftPanel} />
        <Workspace ref="workspace" onMouseOver={this.hoverCenterPanel} />
        <RightPanel ref="rightPanel" onMouseOver={this.hoverRightPanel} />
      </div>
    )
  }
}
</script>
