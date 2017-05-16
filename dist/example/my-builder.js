/* eslint-disable no-undef */
uno.builder('#uno-builder').loadCanvas({
  url: '/unobuilder/example/page.html',
  element: '.entry-content'
}).on('ready', function () {
  /**
   * Add native components by defaults
   * You can remove or edit your own components
   */

  // Basic Blocks
  uno.addBlock('/unobuilder/example/blocks/section.uno')
  uno.addBlock('/unobuilder/example/blocks/section-container.uno')

  // Grid components
  uno.addComponent('/unobuilder/example/components/column-1.uno')
  uno.addComponent('/unobuilder/example/components/column-2.uno')
  uno.addComponent('/unobuilder/example/components/column-3.uno')
  uno.addComponent('/unobuilder/example/components/column-4.uno')
  uno.addComponent('/unobuilder/example/components/column-5.uno')
  uno.addComponent('/unobuilder/example/components/column-6.uno')

  // Basic component
  uno.addComponent('/unobuilder/example/components/text.uno')
  uno.addComponent('/unobuilder/example/components/heading.uno')
  uno.addComponent('/unobuilder/example/components/button.uno')
  uno.addComponent('/unobuilder/example/components/image.uno')
  uno.addComponent('/unobuilder/example/components/video.uno')
  uno.addComponent('/unobuilder/example/components/map.uno')
})
