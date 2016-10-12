<template lang="pug">
.popup(v-if="display")
    .popup-window.color-picker(:style="positionStyle")
        .popup-inner
            .popup-html
                color-picker(:colors.sync="colors", scheme="dark", v-ref:color-picker)
                button(v-if="button", @click="hide()") {{button}}

    .popup-overlay(v-if="overlay", @click="hide()")
</template>

<script>
import colorPicker from 'vue-sketch-color-picker'
import popup from '../screen/Popup.vue'
export default {
    name: 'popupColorPicker',
    components: {
        colorPicker,
        popup
    },
    props: {
        colors: {
            required: true,
            type: Object,
            default: () => {
                return {
        			hex: '#000000',
        			hsl: {
        				h: 0,
        				s: 0,
        				l: 0,
        				a: 1
        			},
        			hsv: {
        				h: 0,
        				s: 0,
        				v: 0,
        				a: 1
        			},
        			rgba: {
        				r: 0,
        				g: 0,
        				b: 0,
        				a: 1
        			},
        			a: 1
        		}
            }
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

        hide () {
            this.display = false
        }
    }
}
</script>
