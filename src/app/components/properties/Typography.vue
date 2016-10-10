<template lang="pug">
// Typography
accordion-item(title="Typography", :mouse-state.sync="mouseState", :advanced.sync="advanced")
    // Font family
    accordion-item-view
        .uk-grid.uk-grid-collapse
            .uk-width-1-10
                label.icon
                    i.font-family

            .uk-width-9-10
                multi-select(:multiple="false",
                :show-labels="false",
                :max-height="250",
                :selected="fontFamily",
                @update="setFontFamily",
                :options="fontFamilies|orderBy 1",
                placeholder="Font Family")
                    span(slot="noResult") No fonts have been found!
    // End of font family

    // Font size
    accordion-item-view
        .uk-grid.uk-grid-small
            .uk-width-3-10
                .uk-grid.uk-grid-collapse
                    .uk-width-3-10
                        label.icon
                            i.font-weight

                    .uk-width-7-10(style="padding-left:5px")
                        multi-select(:multiple="false",
                        :searchable="false",
                        :show-labels="false",
                        :selected="fontWeight",
                        @update="setFontWeight",
                        :max-height="250",
                        :options="[100, 200, 300, 400, 500, 600, 700, 800]"
                        placeholder="400")

            .uk-width-2-6
                .uk-grid.uk-grid-collapse
                    .uk-width-3-10
                        label.icon
                            i.font-size

                    .uk-width-7-10
                        input-number(:width="18",
                        :value.sync="fontSize",
                        :unit.sync="fontSizeUnit",
                        :min="0")

            .uk-width-2-6
                .uk-grid.uk-grid-collapse
                    .uk-width-3-10
                        label.icon
                            .line-height

                    .uk-width-7-10
                        input-number(:width="20",
                        :value.sync="lineHeight",
                        :unit.sync="lineHeightUnit",
                        :min="0")
    // End of font size

    // Font style
    accordion-item-view
        .uk-grid.uk-grid-small
            .uk-width-3-10
                .uk-grid.uk-grid-collapse
                    .uk-width-3-10
                        label.icon
                            i.font-color

                    .uk-width-7-10(style="padding-left:5px")
                        color-box(:color="fontColorHex", @click="$refs.fontColorPopup.show()")

            .uk-width-3-10
                .uk-grid.uk-grid-small
                    .uk-width-3-10
                        label.icon
                            i.font-style

                    .uk-width-7-10
                        buttons(:items="[{icon: 'text-style-normal', active: isFontStyle('normal'), click: setFontStyle('normal')}, {icon: 'text-style-italic', active: isFontStyle('italic'), click: setFontStyle('italic')}]")

            .uk-width-4-10
                .uk-grid.uk-grid-small
                    .uk-width-2-10
                        label.icon
                            i.text-decoration

                    .uk-width-8-10
                        buttons(:items="[{icon: 'x', active: isTextDecoration('none'), click: setTextDecoration('none')}, {icon: 'text-decoration-underline', active: isTextDecoration('underline'), click: setTextDecoration('underline')}, {icon: 'text-decoration-strikethrough', active: isTextDecoration('line-through'), click: setTextDecoration('line-through')}]")
    // End of font style

    // Font Align
    accordion-item-view
        .uk-grid.uk-grid-small
            .uk-width-5-10
                .uk-grid.uk-grid-collapse
                    .uk-width-2-10
                        label.icon
                            i.text-align

                    .uk-width-8-10
                        buttons(:items="[{icon: 'text-align-left', active: isTextAlign('left'), click: setTextAlign('left')}, {icon: 'text-align-center', active: isTextAlign('center'), click: setTextAlign('center')}, {icon: 'text-align-right', active: isTextAlign('right'), click: setTextAlign('right')}, {icon: 'text-align-justify', active: isTextAlign('justify'), click: setTextAlign('justify')}]")

            .uk-width-4-10.uk-push-1-10
                .uk-grid.uk-grid-collapse
                    .uk-width-3-10
                        label.icon
                            i.letter-spacing

                    .uk-width-7-10
                        input-number(:width="20",
                        :value.sync="letterSpacing",
                        :unit.sync="letterSpacingUnit",
                        :min="-100")
    // End of font align
// End of typography

// Popup: Font color picker
popup-color-picker(
:colors.sync="fontColor",
:overlay="true",
button="OK",
v-ref:font-color-popup)
</template>

<script>
import _ from 'underscore'
import multiSelect from 'vue-multiselect'
import config from '../../config.js'
import accordionItem from '../accordion/Item.vue'
import accordionItemView from '../accordion/ItemView.vue'
import inputNumber from '../form/InputNumber.vue'
import buttons from '../form/Buttons.vue'
import colorBox from '../tools/element/ColorBox.vue'
import popupColorPicker from '../tools/screen/PopupColorPicker.vue'

export default {
    name: 'Typography',
    components: {
        accordionItem,
        popupColorPicker,
        accordionItemView,
        multiSelect,
        inputNumber,
        colorBox,
        buttons
    },

    data () {
        return {
            fonts: config.NATIVE_FONTS,
            googleFonts: [],
            mouseState: '',
            advanced: true
        }
    },

    ready () {
        // Get fonts from google fonts
        let url = config.GOOGLE.endpointUrl.concat(config.GOOGLE.apiKey)
		$.getJSON(url, (response) => {
			if (response.items && response.items.length > 0) {
                let googleFonts = []
				_.each(response.items, (item) => {
					googleFonts.push(item.family)
				})
                this.googleFonts = googleFonts
			}
		})
    },

    methods: {
        setFontFamily (value) {
            this.fontFamily = value
        },

        setFontWeight (value) {
            this.fontWeight = value
        },

        isFontStyle (value) {
            return this.fontStyle === value
        },

        setFontStyle (value) {
            return () => this.fontStyle = value
        },

        isTextDecoration (value) {
            return this.textDecoration === value
        },

        setTextDecoration (value) {
            return () => this.textDecoration = value
        },

        isTextAlign (value) {
            return this.textAlign === value
        },

        setTextAlign (value) {
            return () => this.textAlign = value
        }
    },

    computed: {
        /**
         * Get font families from google fonts
         * @return {Array}
         */
        fontFamilies () {
            return this.fonts.concat(this.googleFonts)
        },

        fontColor: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontColor', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontColor', val, this.mouseState)
            }
        },

        fontColorHex () {
            if (this.fontColor) {
                return this.fontColor.hex
            }
        },

        fontFamily: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontFamily.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontFamily.value', val, this.mouseState)
            }
        },

        fontWeight: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontWeight.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontWeight.value', val, this.mouseState)
            }
        },

        fontWeightUnit: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontWeight.unit', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontWeight.unit', val, this.mouseState)
            }
        },

        fontSize: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontSize.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontSize.value', val, this.mouseState)
            }
        },

        fontSizeUnit: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontSize.unit', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontSize.unit', val, this.mouseState)
            }
        },

        lineHeight: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('lineHeight.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('lineHeight.value', val, this.mouseState)
            }
        },

        lineHeightUnit: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('lineHeight.unit', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('lineHeight.unit', val, this.mouseState)
            }
        },

        fontStyle: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('fontStyle.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('fontStyle.value', val, this.mouseState)
            }
        },

        textDecoration: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('textDecoration.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('textDecoration.value', val, this.mouseState)
            }
        },

        textAlign: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('textAlign.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('textAlign.value', val, this.mouseState)
            }
        },

        letterSpacing: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('letterSpacing.value', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('letterSpacing.value', val, this.mouseState)
            }
        },

        letterSpacingUnit: {
            get () {
                return this.$root
                .elementSelector()
                .getProp('letterSpacing.unit', this.mouseState)
            },

            set (val) {
                this.$root
                .elementSelector()
                .setProp('letterSpacing.unit', val, this.mouseState)
            }
        },
    }
}
</script>
