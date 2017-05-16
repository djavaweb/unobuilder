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
  uno.addBlock('/example/blocks/section.uno')
  uno.addBlock('/example/blocks/section-container.uno')

  // Grid components
  uno.addComponent('/example/components/column-1.uno')
  uno.addComponent('/example/components/column-2.uno')
  uno.addComponent('/example/components/column-3.uno')
  uno.addComponent('/example/components/column-4.uno')
  uno.addComponent('/example/components/column-5.uno')
  uno.addComponent('/example/components/column-6.uno')

  // Basic component
  uno.addComponent('/example/components/text.uno')
  uno.addComponent('/example/components/heading.uno')
  uno.addComponent('/example/components/button.uno')
  uno.addComponent('/example/components/image.uno')
  uno.addComponent('/example/components/video.uno')
  uno.addComponent('/example/components/map.uno')
})
