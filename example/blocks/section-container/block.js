uno.registerBlock('section-container', {
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
