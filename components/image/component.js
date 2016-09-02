uno.component.add('image', {
	data: {},
    events: {
        init: function () {},
        dragstart: function () {},
        dragmove: function (coords) {},
        dragend: function () {},
        ready: function () {
			console.log('image ready');
		}
    }
})
