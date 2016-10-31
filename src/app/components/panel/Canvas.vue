<template lang="pug">
.canvas-builder(v-el:canvas-builder)
    .tools(:style="[scrollValue, viewerWidth]")
        context-menu(v-ref:context-menu)
        element-selector(v-ref:element-selector)
        block(v-ref:block)

    iframe(
    src="about:blank",
    v-el:iframe,
    :class="viewerClass",
    :style="viewerWidth"
    )
</template>

<script>
import Vue from 'vue'
import contextMenu from '../tools/screen/ContextMenu.vue'
import elementSelector from '../tools/selector/ElementSelector.vue'
import block from '../tools/block/Block.vue'
import utils from '../../utils.js'
import unoViewer from '../../viewer.js'

export default {
    name: 'canvasBuilder',
    components: {
        block,
        contextMenu,
        elementSelector,
    },

    data () {
        return {
            canvasInstance: null,
            bodyBoundRect: null
        }
    },

    computed: {
        /**
         * Generated viewer class
         * @return {Array}
         */
        viewerClass () {
            let klass = []

            /**
             * Change screensize
             */
            let screenSize = this.$root.ref('centerPanel.topbarPanel').screenSize
            klass.push(screenSize)

            return klass
        },

        /**
         * Generated viewer width
         * @return {Array}
         */
        viewerWidth () {
            let style = {},
            screenSize = this.$root
            .ref('centerPanel.topbarPanel')
            .screenSize

            switch (screenSize) {
                case 'medium':
                    style.width = `${728}px`
                break

                case 'small':
                    style.width = `${600}px`
                break

                case 'mini':
                    style.width = `${480}px`
                break
            }

            return style
        },

        scrollValue () {
            let style = {}

            if (this.bodyBoundRect) {
                style.top = `${this.bodyBoundRect.top}px`
            }

            return style
        }
    },

    methods: {
        /**
         * Get canvas builder size
         * @return {Number}
         */
        size () {
			return this.$els.iframe.getBoundingClientRect().width
        },

        /**
         * Canvas top position
         * @return {Number} [description]
         */
        positionFromTop () {
            return this.$els.iframe.getBoundingClientRect().top
        },

        /**
         * Space position between canvas and left panel
         * @return {Number} [description]
         */
        leftSpace () {
            return this.$els.iframe.getBoundingClientRect().left
        },

        /**
        * Space position between canvas and right panel
        * @return {Number} [description]
        */
       rightSpace () {
           return this.$els.iframe.getBoundingClientRect().right
       },

        /**
         * Get DOM of viewer
         */
        layoutDOM (query) {
            let win = this.$els.iframe.contentWindow
            if (typeof query !== 'undefined') {
                if (query === null) {
                    win = this.$els.iframe
                } else {
                    win = win.document.querySelector(query)
                }
            }

            return win
        },

        /**
         * Get layout object
         * @param {String} ref
         * @param {String} el
         * @return {Object}
         */
        layout (ref, el) {
            return this.canvasInstance.ref(ref, el)
        },

        /**
         * Get canvas viewer width and height
         * @return {Number}
         */
        viewerSize (dimension) {
            let size = 0,
            html = this.layoutDOM(null),
            body = this.layoutDOM('body')

            if (dimension === 'height') {
                size = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                )
            } else {
                size = body.getBoundingClientRect().width
            }

            return size
        },

        /**
         * Get canvas builder offset
         * @param {Number} offset
         */
        offset (offset) {
            return this.$els.canvasBuilder.getBoundingClientRect()[offset]
        }
    },

    ready () {
        // Onload
        utils.addEvent(this.layoutDOM(null), 'load', () => {

            // Window on scroll
            utils.addEvent(this.layoutDOM(), 'scroll', (e) => {
                let bodyBoundRect = this.layoutDOM('body').getBoundingClientRect()
                this.bodyBoundRect = bodyBoundRect
            })

            // Attach Vue Events
            this.layoutDOM('body').outerHTML = `<body @mouseleave="leave($event)" @mouseover="over($event)" @mousedown="click($event)" @dblclick="dblclick($event)" @contextmenu="rightclick($event)" :class="{'uno--dragging': dragElementState.move}">${this.layoutDOM('body').innerHTML}</body>`

            // Viewer stylesheet
            let viewerElement = document.createElement('css-renderer')
            this.layoutDOM('body').appendChild(viewerElement)
            viewerElement.outerHTML = '<css-renderer v-ref:css-renderer></css-renderer>'

            // Google webfont
            let webfont = document.createElement('script')
            webfont.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js'
            this.layoutDOM('body').appendChild(webfont)

            // Attach important js modules to iframe
            unoViewer.window = this.layoutDOM()
            unoViewer.window.jQuery = require('jquery')
            unoViewer.window.UIKit = require('uikit')
            unoViewer.element = window.__uno__.element

            // UIKit CSS
            let uikitCss = document.createElement('style')
            this.layoutDOM('head').appendChild(uikitCss)
            uikitCss.innerHTML = require('raw!uikit/dist/css/uikit.min.css?hack') +
            require('raw!sass!../../../assets/scss/canvas.scss')

            this.canvasInstance = new Vue({
                el: this.layoutDOM('body'),
                mixins: [unoViewer.mixins]
            })
        })

        // Set source based on uno url
        this.layoutDOM(null).src = window.__uno__.url


        // Copy element
		Mousetrap(document.body).bind(['ctrl+c', 'command+c'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('copy')
		})

		// Paste element
		Mousetrap(document.body).bind(['ctrl+v', 'command+v'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('paste')
		})

		// Delete element
		Mousetrap(document.body).bind('del', (e) => {
			e.preventDefault()
			this.layout().keyCapture('delete')
		})

		// Copy element style
		Mousetrap(document.body).bind(['ctrl+shift+c', 'command+shift+c'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('copyStyle')
		})

		// Paste element style
		Mousetrap(document.body).bind(['ctrl+shift+v', 'command+shift+v'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('pasteStyle')
		})

		// Clear element style
		Mousetrap(document.body).bind(['ctrl+shift+del', 'command+shift+del'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('clearStyle')
		})

		// Select using left and up
		Mousetrap(document.body).bind(['left', 'up'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('selectUp')
		})

		// Select using right and down
		Mousetrap(document.body).bind(['right', 'down'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('selectDown')
		})

		// Select childs using space
		Mousetrap(document.body).bind(['space', 'enter'], (e) => {
			e.preventDefault()
			this.layout().keyCapture('enter')
		})
    }
}
</script>
