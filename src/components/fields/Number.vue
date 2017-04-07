<script>
import { mapGetters, mapActions } from 'vuex'
import { ClassPrefix, Labels, Tooltips, Units, Icons } from '../../const'
import { RandomUID, SVGIcon } from '../../utils'

/* eslint-disable no-unused-vars */
import Textbox from './Textbox'

const mainClass = `${ ClassPrefix.FIELDS }--input-number`
const unitClass = `${ mainClass }__unit`
const unitSelectorClass = `${ mainClass }__unit-selector`
const counterClass = `${ mainClass }__counter`

export default {
  name: 'inputNumber',
  props: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: Units.PX
    },
    max: {
      type: Number,
      default: 1000
    },
    min: {
      type: Number,
      default: 0
    },
    excludeUnit: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'openInputPanel'
    ]),
    inputId () {
      return RandomUID()
    },
    previewUnit () {
      return this._value
    }
  },
  methods: {
    ...mapActions([
      'toggleInputPanel'
    ])
  },
  data () {
    return {
      _value: 0,
      _unit: ''
    }
  },
  created () {
    this._value = this.value
    this._unit = this.unit
  },
  render (h) {
    let unitSelectorEl
    if (this.openInputPanel === this.inputId) {
      const units = Object.keys(Units).filter(item => {
        if (this.excludeUnit) {
          return !this.excludeUnit.includes(Units[item])
        }
        return true
      }).map(key => {
        const anchorClass = {
          'unit--selected': this.unit === Units[key]
        }

        const anchorAttrs = {
          title: Tooltips[`UNIT_${ key }`],
          'uk-tooltip': 'pos: left'
        }

        const anchorClick = event => {
          this.toggleInputPanel(this.inputId)
        }

        return <a class={ anchorClass } onClick={ anchorClick }
          {...{ attrs: anchorAttrs }}>{ Units[key] }</a>
      })

      unitSelectorEl = <div class={ unitSelectorClass }>{ units }</div>
    }

    const unitClasses = [unitClass, {
      'unit-selector--visible': this.openInputPanel === this.inputId
    }]

    const toggleUnit = event => {
      this.toggleInputPanel(this.inputId)
    }

    const inputChange = event => {
      this._value = event.target.value
      const intval = parseInt(event.target.value)
      this._unit = isNaN(intval) ? Labels.UNIT_AUTO : this.unit
      this.$forceUpdate()
    }

    return (
      <div class={ mainClass } onInput={ inputChange }>
        <Textbox id={ this.inputId } value={ this._value } />
        <a class={ unitClasses } onClick={ toggleUnit }>{ this._unit }</a>
        { unitSelectorEl }
        <div class={ counterClass }>
          <span domPropsInnerHTML={ SVGIcon(Icons.ARROW_UP) }></span>
          <span domPropsInnerHTML={ SVGIcon(Icons.ARROW_DOWN) }></span>
        </div>
      </div>
    )
  }
}
</script>
