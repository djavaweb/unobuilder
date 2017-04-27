<template>
  <section kind="section" prop="abc"></section>
</template>

<script>
  {
    props: {
      abc: {
        display: false
      }
    },
    settings: {
      "id": "section",
      "label": "Section",
      "icon": "/example/blocks/icons/section.svg",
      "group": "Structures"
    },
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
  }
</script>