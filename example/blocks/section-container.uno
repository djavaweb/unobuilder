<template>
  <section kind="section">
    <div class="uk-container" kind="container"></div>
  </section>
</template>

<script>
  {
    props: {},
    settings: {
      "id": "section-container",
      "label": "Section + Container",
      "icon": "/example/blocks/icons/section-container.svg",
      "group": "Structures"
    },
    data: {},
    events: {
      dblclick: function () {
        console.log('section container hit double click')
      },
      ready: function () {
        console.log('section container ready')
      },
      beforeInit: function () {
        console.log('before init section')
      },
      afterInit: function () {
        console.log('after init section')
      },
      added: function () {
        console.log('section-container has been added to canvas')
      }
    }
  }
</script>