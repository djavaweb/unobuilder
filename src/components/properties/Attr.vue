<script>
import { Labels } from '../../const'

/* eslint-disable no-unused-vars */
import Row from '../fields/Row'
import Textbox from '../fields/Textbox'

export default {
  name: 'attributeProperties',
  render (h) {
    /* eslint-disable */
    return (
      <div>
        <Row { ...{ props: { label: { text: Labels.ATTR_ID } } } }>
          <Textbox />
        </Row>
        <Row { ...{ props: { label: { text: Labels.ATTR_CLASS } } } }>
          <Textbox />
        </Row>
      </div>
    )
    /* eslint-enable */
  }
}
</script>
