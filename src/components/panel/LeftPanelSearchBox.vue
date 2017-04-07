<script>
import { mapActions } from 'vuex'
import { ClassPrefix, Labels, InputType } from '../../const'
import { RandomUID } from '../../utils'

/* eslint-disable no-unused-vars */
import Label from '../fields/Label'
import Textbox from '../fields/Textbox'

const mainClass = `${ ClassPrefix.MAIN }__component-search-box`
const textboxId = `input-${ RandomUID() }`

export default {
  name: 'LeftPanelSearchBox',
  methods: {
    ...mapActions([
      'findComponent'
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
      value: this.searchComponents,
      placeholder: Labels.SEARCH_ELEMENT
    }

    const onInput = event => {
      this.findComponent(event.target.value)
    }

    return (
      <div class={ mainClass }>
        <Label {...{ props: labelProps }} />
        <Textbox nativeOnInput={ onInput } props={ { type: InputType.SEARCH } } { ...{ attrs: textAttrs } } />
      </div>
    )
  }
}
</script>
