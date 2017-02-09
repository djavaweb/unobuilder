<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../../const'

export default {
  name: 'canvasBuilder',
  components: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels'
    ])
  },
  mounted () {
    const {ownerDocument: document} = this.$el
    const head = document.querySelector('head')

    const styles = document.createElement('style')
    styles.innerHTML = require('!raw-loader!assets/uikit/css/uikit.min.css')
    styles.innerHTML += require('!raw-loader!sass-loader!assets/scss/canvas.scss')
    head.appendChild(styles)

    const jquery = document.createElement('script')
    jquery.src = require('url-loader!jquery')
    document.body.appendChild(jquery)

    const uikit = document.createElement('script')
    uikit.src = require('url-loader!uikit/js/uikit.min.js')
    document.body.appendChild(uikit)
  },
  render (h) {
    const onClick = event => {
      // this.hideAllPanels()
    }

    return (
      <div class={ClassPrefix.MAIN} onClick={onClick}>
        {this.elements}
      </div>
    )
  }
}
</script>
