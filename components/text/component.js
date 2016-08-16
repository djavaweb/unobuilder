uno.component.add({
	data: {
		hello: 'world',
		test: 'haha'
	},

	init: function () {},
	ready: function () {},

	onchange: function (key, value, oldValue) {
		/*switch (key) {
			case 'font_family':
				uno.do('custom_action', 'hello', 'world')
			break
		}*/
	},

	dragstart: function () {
		//console.log('drag start')
	},

	dragmove: function (coords) {
		//console.log('dragging', coords)
	},

	dragend: function () {
		//console.log('dragged')
	},
})
