<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import Canvas from '../canvas/Container'

const mainClass = ClassPrefix.WORKSPACE

export default {
  name: 'workspace',
  computed: {
    ...mapGetters([
      'screenSize',
      'previewMode'
    ])
  },
  methods: {
    ...mapActions([
      'hideAllPanels'
    ])
  },
  render (h) {
    const onClick = event => {
      this.hideAllPanels()
    }

    const classes = {
      'preview--mode': this.previewMode
    }

    return (
      <div onClick={onClick} class={[mainClass, classes]}>
        <Canvas />
      </div>
    )
  }
}
</script>
