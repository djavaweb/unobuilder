<script>
/* eslint-disable no-unused-vars */
import { ClassPrefix, Labels } from '../../const'

const mainClass = `${ ClassPrefix.FIELDS }--select`
const selectedClass = `${ mainClass }__selected`
const inputClass = `${ mainClass }__input`
const optionsClass = `${ mainClass }__options`

export default {
  name: 'select',
  props: {
    typehead: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: () => [{ value: Labels.NO_ITEMS }]
    }
  },
  data () {
    return {
      selected: '',
      inputValue: '',
      displayOptions: false
    }
  },
  mounted () {
    this.options.forEach(item => {
      if (item.selected) {
        this.selected = item
      }
    })
  },
  methods: {
    setSelected (option) {
      this.selected = option
      this.inputValue = ''
      if (this.typehead) {
        this.$refs.input.value = ''
      }
      this.$nextTick(() => {
        this.displayOptions = false
      })
    },
    setInputValue (event) {
      this.inputValue = event.target.value
    },
    toggleOptions (event) {
      this.displayOptions = !this.displayOptions
      if (this.typehead) {
        this.$refs.input.focus()
      }
    }
  },
  render (h) {
    let selectedEl
    if (this.inputValue.length === 0) {
      selectedEl = <span class={ selectedClass }>{ this.selected.value }</span>
    }

    let inputEl
    if (this.typehead) {
      inputEl = <input type='text' ref='input' onInput={ this.setInputValue } />
    }

    const options = this.options.filter(item => {
      const inputLength = this.inputValue.length
      if (inputLength > 0) {
        const hasValue = item.value.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1
        return hasValue
      }

      return true
    }).map(item => {
      return <li onClick={ () => this.setSelected(item) }>{ item.value }</li>
    })

    let optionsEl
    if (this.displayOptions) {
      optionsEl = <div class={ optionsClass }>
        <ul>{ options }</ul>
      </div>
    }

    const inputClasses = {
      'input--open': this.displayOptions,
      'input--close': !this.displayOptions
    }

    return (
      <div class={ mainClass }>
        <div class={ [inputClasses, inputClass] } onClick={ this.toggleOptions }>
          { selectedEl }
          { inputEl }
        </div>
        { optionsEl }
      </div>
    )
  }
}
</script>
