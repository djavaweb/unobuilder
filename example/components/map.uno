<template>
  <div kind="map"></div>
</template>

<script>
  {
    props: {},
    settings: {
      "id": "map",
      "label": "Map",
      "icon": "/unobuilder/example/components/icons/map.svg",
      "group": "Component"
    },
    data: {},
    events: {
      beforeInit: function () {},
      afterInit: function () {},
      added: function () {
        // https://maps.googleapis.com/maps/api/js?key=AIzaSyBlj_G7213Lb1PIMYKHrT2jsQmhQH-H4f0&callback=initMap
        var googlemap = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBlj_G7213Lb1PIMYKHrT2jsQmhQH-H4f0&callback=initMap'
        console.log('Load => ', googlemap)
      },
      dragStart: function () {},
      dragMove: function (coords) {},
      dragEnd: function () {},
      ready: function () {}
    }
  }
</script>
