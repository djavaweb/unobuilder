<script>
import {mapGetters} from 'vuex'
import {ClassPrefix, Labels, InputType} from '../../const'
import * as common from '../../utils/common'

/* eslint-disable no-unused-vars */
import Label from '../fields/Label'
import Textbox from '../fields/Textbox'

const mainClass = `${ClassPrefix.MAIN}__component-search-box`
const textboxId = `input-${common.RandomUID()}`

export default {
  name: 'LeftPanelSearchBox',
  computed: {
    ...mapGetters([
      'searchComponentResults'
    ])
  },
  render (h) {
    const labelProps = {
      text: Labels.ADD_ELEMENT,
      bold: true,
      uppercase: true,
      target: textboxId
    }

    const textAttrs = {
      id: textboxId,
      placeholder: Labels.SEARCH_ELEMENT
    }

    return (
      <div class={mainClass}>
        <Label {...{props: labelProps}} />
        <Textbox props={{type: InputType.SEARCH}} {...{attrs: textAttrs}} />
      </div>
    )
  }
}
</script>
