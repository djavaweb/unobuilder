uno.component.add({
    data: {
        column: 1
    },
    events: {
        ready: function () {
            console.log(this.column)
        },

        dragstart: function () {
            console.log('start')
        },

        dragmove: function (coords) {
            console.log(coords, this)
        },

        dragend: function () {
            console.log('end')
        },
    }
})
