<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, Labels, Icons} from '../../const'
import {SVGIcon} from '../../utils'

const mainClass = `${ClassPrefix.SCREEN}-loader`

export default {
  name: 'screenLoader',
  computed: {
    ...mapGetters([
      'screenLoader',
      'loaderMessage'
    ])
  },
  render (h) {
    if (this.loaderMessage === Labels.NOOP) {
      return
    }

    const classes = {
      'animate--fade-out': !this.screenLoader
    }

    return (
      <div class={[mainClass, classes]}>
        <div domPropsInnerHTML={SVGIcon(Icons.LOGO)} />
        <div class="loading-message">{this.loaderMessage}</div>
      </div>
    )
  }
}
</script>
