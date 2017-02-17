<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, Labels, ScreenSize} from '../../const'

const mediaToolsClass = `${ClassPrefix.CANVAS}-media-tools`

export default {
  name: 'mediaQueryStatus',
  computed: {
    ...mapGetters([
      'screenSize'
    ])
  },
  render (h) {
    const sizeConst = this.screenSize.toUpperCase()

    return (
      <div class={mediaToolsClass}>
        <div class="label">{Labels[`SCREEN_${sizeConst}`]}</div>
        <div class="size">Affects {ScreenSize[sizeConst]}px and below</div>
      </div>
    )
  }
}
</script>
