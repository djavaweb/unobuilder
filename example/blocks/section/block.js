uno.registerBlock('section', {
  data: {},
  events: {
    beforeInit: function () {
      console.log('before init section')
    },
    afterInit: function () {
      console.log('after init section')
    },
    added: function () {}
  }
})
