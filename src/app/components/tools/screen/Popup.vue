<template lang="pug">
.popup(v-if="display", v-el:popup)
    .popup-window(:class="class", :style="positionStyle")
        .popup-inner
            a.popup-close.uk-icon-close(@click="hide()")
            .popup-title(v-if="title", v-html="title")
            .popup-html
                slot
                button(v-if="button", @click="hide()") {{button}}

    .popup-overlay(v-if="overlay", @click="hide()")
</template>

<script>
export default {
    name: 'popup',
    props: {
        title: {
            type: String,
            default: 'Untitled Popup'
        },

        class: {
            type: String,
        },

        overlay: {
            type: Boolean,
            default: false
        },

        button: {
            type: String
        },

        onClose: {
            type: Function
        }
    },

    data () {
        return {
            display: false,
            position: {x: 0, y: 0}
        }
    },

    computed: {
        positionStyle () {
            let transform = [],
            x = (! this.position.x) ? '50%': `${this.position.x}%`,
            y = (! this.position.y) ? '50%': `${this.position.y}%`

            return {
                top: y,
                left: x
            }
        }
    },

    methods: {
        /**
         * Show popup
         * @param  {Object} obj
         */
        show (obj) {
            this.display = true

            this.$nextTick(() => {
                if (obj && this.$els.popup) {
                    let parent = this.$els.popup.parentElement,
                    parentWidth = parent.offsetWidth,
                    parentHeight = parent.offsetHeight

                    if (obj.x) {
                        if (obj.dependOnScroll) {
                            obj.x += obj.dependOnScroll.scrollLeft
                        }
                        this.position.x = (parseFloat(obj.x/parentWidth) * 100).toFixed(2)
                    }

                    if (obj.y) {
                        if (obj.dependOnScroll) {
                            obj.y += obj.dependOnScroll.scrollTop
                        }
                        this.position.y = (parseFloat(obj.y/parentHeight) * 100).toFixed(2)
                    }
                }
            })
        },

        /**
         * Hide popup
         */
        hide () {
            this.display = false
            this.onClose && this.onClose()
        }
    }
}
</script>
