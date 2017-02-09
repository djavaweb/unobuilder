<script>
/* eslint-disable no-unused-vars */
import Select from '../fields/Select'
export default {
  name: 'backgroundProperties',
  render (h) {
    const options = ['hello world']
    return (
      <div><Select options={options} /></div>
    )
  }
}
</script>
