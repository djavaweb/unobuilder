<script>
import {ClassPrefix} from '../../const'
import {mapGetters, mapActions} from 'vuex'

/* eslint-disable no-unused-vars */
import ScreenSwitcher from './TopPanelScreenSwitcher'
import StateTools from './TopPanelStateToolbar'

export default {
  name: 'topPanel',
  computed: {
    ...mapGetters([
      'previewMode'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels'
    ])
  },
  render (h) {
    const previewClasses = {
      'preview--enabled': this.previewMode
    }

    return (
      <div onClick={this.hideAllPanels} class={[ClassPrefix.TOP_PANEL, previewClasses]}>
        <ScreenSwitcher />
        <StateTools />
      </div>
    )
  }
}
</script>
