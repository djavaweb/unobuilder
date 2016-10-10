<template lang="pug">
.popup(v-if="display")
    .popup-window.color-picker
        .popup-inner
            .popup-html
                color-picker(:colors.sync="colors", scheme="dark", v-ref:color-picker)

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

        onClose: {
            type: Function
        }
    },

    data () {
        return {
            display: false
        }
    },

    methods: {
        show () {
            this.display = true
        },

        hide () {
            this.display = false
        }
    }
}
</script>
