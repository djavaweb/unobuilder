<script>
import {mapGetters} from 'vuex'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import SearchBox from './LeftPanelSearchBox'
const mainClass = `${ClassPrefix.LEFT_PANEL}-components`

export default {
  name: 'leftPanelComponents',
  computed: {
    ...mapGetters([
      'openLeftPanel',
      'defaultPanel'
    ])
  },
  render (h) {
    if (!this.defaultPanel.open) {
      return null
    }

    let classes = {}
    classes['animate--slide-in'] = this.defaultPanel.initiated
    classes['animate--slide-out'] = this.defaultPanel.initiated

    console.log(this.defaultPanel)

    return (
      <div class={[mainClass, classes]}>
        <SearchBox />
      </div>
    )
  }
}
</script>
