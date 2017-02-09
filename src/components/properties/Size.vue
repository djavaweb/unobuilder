<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, Labels, Units} from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import Column from '../fields/Column'
import InputNumber from '../fields/Number'

const mainClass = `${ClassPrefix.MAIN}__properties--size`

export default {
  name: 'sizeProperties',
  computed: {
    ...mapGetters([
      'advancedPanels'
    ])
  },
  render (h) {
    let {minSizeRow, maxSizeRow} = {}

    if (this.advancedPanels.size) {
      minSizeRow = <Row>
        <Column {...{props: {label: {text: Labels.MIN}}}}>
            <InputNumber value={10} excludeUnit={[Units.VH]} />
        </Column>
        <Column {...{props: {label: {text: Labels.MIN}}}}>
          <InputNumber value={10} excludeUnit={[Units.VW]} />
        </Column>
      </Row>

      maxSizeRow = <Row>
        <Column {...{props: {label: {text: Labels.MAX}}}}>
            <InputNumber value={10} excludeUnit={[Units.VH]} />
        </Column>
        <Column {...{props: {label: {text: Labels.MAX}}}}>
          <InputNumber value={10} excludeUnit={[Units.VW]} />
        </Column>
      </Row>
    }

    return (
      <div class={mainClass}>
        <Row>
          <Column {...{props: {label: {text: Labels.WIDTH}}}}>
            <InputNumber value={10} excludeUnit={[Units.VH]} />
          </Column>
          <Column {...{props: {label: {text: Labels.HEIGHT}}}}>
            <InputNumber value={10} excludeUnit={[Units.VW]} />
          </Column>
        </Row>
        {minSizeRow}
        {maxSizeRow}
      </div>
    )
  }
}
</script>
