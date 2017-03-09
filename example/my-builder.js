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
  uno.addBlock('/example/blocks/section/block.js')
  uno.addBlock('/example/blocks/section-container/block.js')

  // Grid components
  uno.addComponent('/example/components/column-1/component.js')
  uno.addComponent('/example/components/column-2/component.js')
  uno.addComponent('/example/components/column-3/component.js')
  uno.addComponent('/example/components/column-4/component.js')
  uno.addComponent('/example/components/column-5/component.js')
  uno.addComponent('/example/components/column-6/component.js')

  // Basic component
  uno.addComponent('/example/components/text/component.js')
  uno.addComponent('/example/components/heading/component.js')
  uno.addComponent('/example/components/button/component.js')
  uno.addComponent('/example/components/image/component.js')
  uno.addComponent('/example/components/video/component.js')
  uno.addComponent('/example/components/map/component.js')
})
