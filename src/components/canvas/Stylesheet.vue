<script>
export default {
  name: 'stylesheet',
  props: {
    content: {
      type: String
    }
  },
  render (h) {
    return (
      <style scoped>{this.content}</style>
    )
  }
}
</script>
