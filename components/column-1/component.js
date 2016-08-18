uno.component.add({
    data: {
        column: 1
    },
    methods: {
        test: function () {
            console.log('chuck testa')
        }
    },
    events: {
        ready: function () {
            console.log(this.column)
        },

        dragstart: function () {
            console.log('start')
        },

        dragmove: function (coords) {
            console.log(coords)
        },

        dragend: function () {
            console.log('end')
            this.test()
        },
    }
})
