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
        contextMenu,
        elementSelector,
        block
    },

    data () {
        return {
            bodyBoundRect: null
        }
    },

    computed: {
        /**
         * Generated viewer class
         * @return {Array}
         */
        viewerClass () {
            let klass = [],

            /**
             * Change screensize
             */
            screenSize = this.$root
            .ref('centerPanel.topbarPanel')
            .screenSize

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
         * Get DOM of viewer
         */
        viewerDOM (query) {
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
         * Get viewer object
         * @return {Object}
         */
        viewer () {
            return this.viewerDOM('body').__vue__.ref()
        },

        /**
         * Get canvas viewer width and height
         * @return {Number}
         */
        viewerSize (dimension) {
            let size = 0,
            html = this.viewerDOM(null),
            body = this.viewerDOM('body')

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
        utils.addEvent(this.viewerDOM(null), 'load', () => {

            // Window on scroll
            utils.addEvent(this.viewerDOM(), 'scroll', (e) => {
                let bodyBoundRect = this.viewerDOM('body').getBoundingClientRect()
                this.bodyBoundRect = bodyBoundRect
            })

            // Attach Vue Events
            this.viewerDOM('body').outerHTML = '<body @mouseleave="leave($event)" @mouseover="over($event)" @click="click($event)" @dblclick="dblclick($event)" @contextmenu="rightclick($event)">'+ this.viewerDOM('body').innerHTML +'</body>'

            // Viewer stylesheet
            let viewerElement = document.createElement('viewer')
            this.viewerDOM('body').appendChild(viewerElement)
            viewerElement.outerHTML = '<viewer v-ref:viewer></viewer>'

            // Google webfont
            let webfont = document.createElement('script')
            webfont.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js'
            this.viewerDOM('body').appendChild(webfont)

            // Attach important js modules
            unoViewer.window = this.viewerDOM()
            unoViewer.window.jQuery = require('jquery')
            unoViewer.window.UIKit = require('uikit')
            unoViewer.element = window.__uno__.element

            // UIKit CSS
            let uikitCss = document.createElement('style')
            this.viewerDOM('head').appendChild(uikitCss)
            uikitCss.innerHTML = require('raw!uikit/dist/css/uikit.min.css?hack') +
            require('raw!sass!../../../assets/scss/canvas.scss')

            new Vue({
                el: this.viewerDOM('body'),
                mixins: [unoViewer.mixins]
            })
        })

        // Set source based on uno url
        this.viewerDOM(null).src = window.__uno__.url
    }
}
</script>
