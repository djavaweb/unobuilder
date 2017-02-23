<script>
import uno from 'uno'
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix, Labels} from '../const'

/* eslint-disable no-unused-vars */
import ScreenDetector from './tools/ScreenDetector'
import ScreenLoader from './tools/ScreenLoader'
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
      'hideLoaderMessage',
      'canvasReady',
      'hidePreview',
      'refreshScroll',
      'setLoaderMessage'
    ])
  },
  created () {
    uno.on('finish', () => {
      this.hidePreview()
      setTimeout(() => {
        this.canvasReady()
        this.hideLoaderMessage()
      }, 1000)
      setTimeout(() => this.refreshScroll(), 100)
      setTimeout(() => this.setLoaderMessage(Labels.NOOP), 1250)
    })
  },
  beforeMount () {
    this.$nextTick(() => {
      uno.emit('ready')
    })
  },
  render (h) {
    return (
      <div class={ClassPrefix.MAIN}>
        <ScreenLoader ref="screenLoader" />
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
