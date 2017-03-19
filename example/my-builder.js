/* eslint-disable no-undef */
uno.builder('#uno-builder').loadCanvas({
  url: '/example/page.html',
  element: '.entry-content'
}).on('ready', function () {
  /**
   * Add native components by defaults
   * You can remove or edit your own components
   */

  // Basic Blocks
  uno.addBlock([
    '/example/blocks/section/block.js',
    '/example/blocks/section-container/block.js'
  ])

  uno.addComponent([
    // Grid components
    '/example/components/column-1/component.js',
    '/example/components/column-2/component.js',
    '/example/components/column-3/component.js',
    '/example/components/column-4/component.js',
    '/example/components/column-5/component.js',
    '/example/components/column-6/component.js',
    // Basic component
    '/example/components/text/component.js',
    '/example/components/heading/component.js',
    '/example/components/button/component.js',
    '/example/components/image/component.js',
    '/example/components/video/component.js',
    '/example/components/map/component.js'
  ])
})
