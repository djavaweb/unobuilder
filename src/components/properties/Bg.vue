<script>
/* eslint-disable no-unused-vars */
import Select from '../fields/Select'
export default {
  name: 'backgroundProperties',
  render (h) {
    const options = [
      {
        value: 'Hello world'
      },

      {
        value: 'Test Abcdef',
        selected: true
      },

      {
        value: 'Abrakadabra'
      },

      {
        value: 'God is supreme being'
      },

      {
        value: 'Your mind is above supreme being below the god of power'
      },

      {
        value: 'Eternal in your mind'
      },

      {
        value: 'Goodluck my friend'
      },

      {
        value: 'Eliminate everything'
      }
    ]
    return (
      <div><Select options={options} /></div>
    )
  }
}
</script>
