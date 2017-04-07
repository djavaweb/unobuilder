<script>
import { ClassPrefix } from '../../const'
import { mapGetters, mapActions } from 'vuex'

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
      'hideAllPanels',
      'hideBlockPanel'
    ])
  },
  render (h) {
    const previewClasses = {
      'preview--enabled': this.previewMode
    }

    const onClick = event => {
      this.hideAllPanels()
      this.hideBlockPanel()
    }

    return (
      <div onClick={ onClick } class={ [ClassPrefix.TOP_PANEL, previewClasses] }>
        <ScreenSwitcher />
        <StateTools />
      </div>
    )
  }
}
</script>
