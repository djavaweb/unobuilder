<script>
import { ClassPrefix } from '../../const'

const mainClass = `${ ClassPrefix.FIELDS }--label`

export default {
  name: 'label',
  props: {
    text: {
      type: String,
      default: ''
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  render (h) {
    const classes = {
      'label--upper': this.uppercase,
      'label--bold': this.bold,
      'label--inline': this.inline
    }

    return (
      <label class={ [mainClass, classes] } for={ this.target }>{ this.text }</label>
    )
  }
}
</script>
