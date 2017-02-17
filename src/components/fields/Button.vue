<script>
import {ButtonType, ClassPrefix} from '../../const'
import {SVGIcon} from '../../utils'

const mainClass = `${ClassPrefix.FIELDS}--button`

export default {
  name: 'button',
  props: {
    icon: {
      type: String
    },
    label: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ButtonType.PRIMARY
    },
    active: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String
    }
  },
  render (h) {
    const stateClasses = {
      'button--disabled': this.disabled,
      'button--secondary': this.type === ButtonType.SECONDARY,
      'button--bordered': this.type === ButtonType.BORDERED,
      'button--icon': this.icon,
      'button--label': this.label,
      'button--active': this.active && !this.disabled
    }

    const attrs = {}

    if (this.tooltip) {
      attrs.title = this.tooltip
      attrs['uk-tooltip'] = true
    }

    let {iconEl, labelEl} = {}

    if (this.icon) {
      iconEl = <span class="icon" domPropsInnerHTML={SVGIcon(this.icon)} />
    }

    if (this.label) {
      labelEl = <span class="label">{this.label}</span>
    }

    return (
      <button class={[mainClass, stateClasses]} {...{attrs: attrs}}>
        {iconEl} {labelEl}
      </button>
    )
  }
}
</script>
