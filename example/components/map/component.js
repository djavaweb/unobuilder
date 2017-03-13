uno.registerComponent('map', {
	data: {},
    events: {
		beforeInit: function () {
            // uno.registerScript('https://maps.googleapis.com/maps/api/js?key=' + this.settings.api_key + '&callback=initMap')
        },
        afterInit: function () {},
        dragStart: function () {},
        dragMove: function (coords) {},
        dragEnd: function () {},
        ready: function () {
            // new google.maps.Map(this.el, {
            //     center: {lat: this.settings.coords.lat, lng: this.settings.coords.lng},
            //     zoom: this.settings.zoom
            // })
        }
    }
})
