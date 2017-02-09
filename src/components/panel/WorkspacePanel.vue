<script>
import {mapGetters, mapActions} from 'vuex'
import {ClassPrefix} from '../../const'

/* eslint-disable no-unused-vars */
import CanvasTools from './CanvasTools'

export default {
  name: 'workspace',
  computed: {
    ...mapGetters([
      'screenSize'
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

    return (
      <div onClick={onClick} class={ClassPrefix.WORKSPACE}>
        <CanvasTools />
      </div>
    )
  }
}
</script>
