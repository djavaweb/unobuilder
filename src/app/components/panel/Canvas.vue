<template lang="pug">
.canvas-builder(v-el:canvas-builder)
    .tools(:style="scrollValue,viewerWidth")
        context-menu(v-ref:context-menu)
        element-selector(v-ref:element-selector)
        block(v-ref:block)

    iframe(
    v-el:iframe,
    src="./viewer.html",
    :class="viewerClass",
    :style="viewerWidth"
    )
</template>

<script>
import contextMenu from '../tools/screen/ContextMenu.vue'
import elementSelector from '../tools/selector/ElementSelector.vue'
import block from '../tools/block/Block.vue'
import utils from '../../utils.js'
export default {
    name: 'canvasBuilder',
    components: {
        contextMenu,
        elementSelector,
        block
    },

    data () {
        return {
            scrollValue: {}
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
    },

    methods: {
        /**
         * Get DOM of viewer
         */
        viewerDOM (query) {
            let doc = this.$els.iframe.contentWindow.document
            if (typeof query !== 'undefined') {
                if (query === null) {
                    doc = this.$els.iframe
                } else {
                    doc = doc.querySelector(query)
                }
            }

            return doc
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
    }
}
</script>
