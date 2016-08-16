uno.component.add({
    data: {
        column: 1
    },
    events: {
        ready: function () {
            console.log(this.column)
        }
    }
})
