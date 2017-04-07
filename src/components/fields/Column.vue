<script>
/* eslint-disable no-unused-vars */
import Label from './Label'
import { ClassPrefix } from '../../const'
import { SVGIcon } from '../../utils'

const mainClass = `${ ClassPrefix.FIELDS }--column`

export default {
  name: 'column',
  props: {
    label: {
      type: Object
    },
    icon: {
      type: String
    },
    width: {
      type: Number | String
    }
  },
  render (h) {
    let { labelEl, icon } = {}
    const slot = this.$slots.default ? this.$slots.default : null

    if (this.label) {
      labelEl = <Label class='label' {...{ props: this.label }} />
    }

    if (this.icon) {
      icon = <label class='icon' domPropsInnerHTML={ SVGIcon(this.icon) } />
    }

    const styles = {}
    if (this.width) {
      if (typeof this.width === 'number' && this.width > 0) {
        styles.width = `${ this.width }px`
      } else if (typeof this.width === 'string') {
        styles.width = `${ this.width }`
      }
    }

    return (
      <div class={ mainClass } style={ styles }>
        { labelEl } { icon } { slot }
      </div>
    )
  }
}
</script>
