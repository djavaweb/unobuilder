uno.loadCanvas({
    url: './example/index.html',
    element: '.entry-content'
}).on('ready', function () {

    /**
     * Add native components
     */

    // Grid components
    uno.addComponent('../components/column-1/component.js')
    uno.addComponent('../components/column-2/component.js')
    uno.addComponent('../components/column-3/component.js')
    uno.addComponent('../components/column-4/component.js')
    uno.addComponent('../components/column-5/component.js')
    uno.addComponent('../components/column-6/component.js')

    // Basic component
    uno.addComponent('../components/text/component.js')
    uno.addComponent('../components/heading/component.js')
    uno.addComponent('../components/button/component.js')
    uno.addComponent('../components/image/component.js')
    uno.addComponent('../components/video/component.js')
    uno.addComponent('../components/map/component.js')
})
