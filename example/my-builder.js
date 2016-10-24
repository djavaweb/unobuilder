uno.loadCanvas({
    url: './example/page.html',
    element: '.entry-content'
}).on('ready', function () {

    /**
     * Add native components
     */

    // Grid components
    uno.addComponent('./example/components/column-1/component.js')
    uno.addComponent('./example/components/column-2/component.js')
    uno.addComponent('./example/components/column-3/component.js')
    uno.addComponent('./example/components/column-4/component.js')
    uno.addComponent('./example/components/column-5/component.js')
    uno.addComponent('./example/components/column-6/component.js')

    // Basic component
    uno.addComponent('./example/components/text/component.js')
    uno.addComponent('./example/components/heading/component.js')
    uno.addComponent('./example/components/button/component.js')
    uno.addComponent('./example/components/image/component.js')
    uno.addComponent('./example/components/video/component.js')
    uno.addComponent('./example/components/map/component.js')
})
