uno.component.add({
    data: {
        column: 1
    },
    methods: {
        test: function (arg1, args2) {
            console.log('chuck testa', args1, args2)
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
            this.test('hello', 'world')
        },
    }
})
