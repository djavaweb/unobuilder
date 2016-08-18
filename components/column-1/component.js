uno.component.add({
    data: {
        column: 1
    },
    methods: {
        test: function (arg1, arg2) {
            console.log('chuck testa', this.join(arg1, arg2))
        },

        join: function (arg1, arg2) {
            return arg1 + ':' + arg2 + '>' + this.column
        }
    },
    events: {
        init: function () {
            console.log('column count', this.column)
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

        ready: function () {
            console.log('ready')
        }
    }
})
