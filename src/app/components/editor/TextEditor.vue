<template>
<div class="ed-btn--wrapper" :style="style">
    <button v-for="btn in defaultButtons" @click="command(btn)" title="{{{btn.title}}}" id="{{btn.id}}" :class="{'active': btn.toggle}">{{{btn.label}}}</button>
</div>
</template>

<script>
import _ from 'underscore'
import rectButton from '../misc/rect-button.vue'

export default {
    name: 'editor',
    components: {rectButton},
    props: {
        buttons: {
            default: null,
            required: false,
            type: Object
        },

        element: {
            default: null,
            required: true
        },

        window: {
            default: null,
            required: true
        },

        style: {
            default: null,
            required: false,
            type: Object
        }
    },

    ready () {
        if (!this.style) {
            this.style = {left: 0, top: 0}
        }

        if (this.element) {
            if ('spellcheck' in this.element.ownerDocument.body) {
                this.element.ownerDocument.body.spellcheck = false
            }
        }
    },

    data () {
        return {
            editor: null,
            toggle: '',
            button: {},
            defaultButtons: _.extend([
                {
                    id: 'bold',
                    label: '<i class="uk-icon-bold"></i>',
                    title: 'Bold',
                    command: 'bold'
                },
                {
                    id: 'italic',
                    label: '<i class="uk-icon-italic"></i>',
                    title: 'Italic',
                    command: 'italic'
                },
                {
                    id: 'link',
                    label: '<i class="link"></i>',
                    title: 'Insert Link',
                    toggle: false,
                    command: 'fn',
                    fn () {
                        this.getSelection((selection, selector, editor, vue) => {
                            selector().removeAllRanges()
                            selector().addRange(selection.range)
                            vue.createElement({
                                tag: 'a',
                                kind: 'link',
                                type: 'component',
                                selectable: true,
                                wrapper: false,
                                dropable: 'section,container,row,column,content',
                                html: selection.word
                            }, (link) => {
                                // Little tricky here -_-
                                // Create new temporary element
                                // Insert as text replacement
                                let tmp = editor.createElement('div')
                                tmp.id = this.$root.generateId('tmp')
                                this.exec('insertHTML', tmp.outerHTML)

                                // Then replace temporary element
                                // with link
                                let tmpEl = editor.querySelector(`#${tmp.id}`)
                                tmpEl.parentNode.replaceChild(link, tmpEl)

                                this.$dispatch('disableEditor')
                                selector().removeAllRanges()
                                link.$select()
                            })
                        })
                    }
                },
                {
                    id: 'remove',
                    label: '<i class="remove-style"></i>',
                    title: 'Clear Style',
                    command: 'removeFormat'
                },
                {
                    id: 'color-picker',
                    label: '<i class="color-picker"></i>',
                    title: 'Color',
                    command: 'fn',
                    fn () {

                    }
                }
            ], this.buttons)
        }
    },

    methods: {
        /**
         * Get editor instance
         * @param  {Function} callback
         */
        getEditor (callback) {
            if (this.element && this.window) {
                let editor = this.element.ownerDocument
                callback && callback.call(this, editor, this.window)
            }
        },

        /**
         * Command button
         * @param  {String|Function} button
         */
        command (button) {
            if (button.command !== 'fn') {
                this.exec(button.command)
            } else {
                this.getEditor((editor) => {
                    button.toggle = !button.toggle
                    if (button.toggle) {
                        this.toggle = button.id
                        this.button = button
                        button.fn && button.fn.apply(this, [button, editor])
                    } else {
                        this.toggle = ''
                        this.button = {}
                    }
                })
            }
        },

        /**
         * Execute editor command
         */
        exec (command, content) {
            if (this.element) {
                this.getEditor((editor) => {
                    if (content === undefined) {
                        content = null
                    }

                    editor.execCommand(command, false, content)
                })
            }
        },

        /**
         * Get selection range
         * @param  {Function} callback
         * @return {void}
         */
        getSelection (callback) {
            const expandWord = (range) => {
                if (range.startOffset === range.endOffset) {
                    let startOffset = range.startOffset
                    while (startOffset--) {
                        if (range.startContainer.data[startOffset].match(/\s+/g) !== null) {
                            break
                        }
                    }

                    let endOffset = range.endOffset
                    while (endOffset++) {
                        if (range.endContainer.data[endOffset].match(/\s+/g) !== null) {
                            break
                        }
                    }

                    /* Set position */
                    range.setStart(range.startContainer, startOffset + 1)
                    range.setEnd(range.endContainer, endOffset)

                    return range.toString()
                    .replace(/\r?\n/g, " ")
                    .replace(/\s+/g, " ")
                    .replace(/^\W+|\W+$/g, '')
                }

                return range.toString()
            }


            this.getEditor((editor, window) => {
                let selected, doc = window.document, getSelection

                /**
                 * Modern browser with window.getSelection
                 * Firefox with multi tabs open with document.getSelection
                 */
                if (window.getSelection || doc.getSelection) {
                    getSelection = doc.getSelection
                    if (window.getSelection) {
                        getSelection = window.getSelection
                    }

                    let range = getSelection().getRangeAt(0),
                    content = range.cloneContents()

                    // HTML selection
                    let div = document.createElement('div')
                    div.appendChild(content)

                    selected = {
                        range: range,
                        text: range.toString(),
                        html: div.innerHTML
                    }
                    selected.word = expandWord(range)
                // Old browser IE8
                } else if (doc.selection && doc.selection.type != "Control") {
                    getSelection = doc.selection

                    let range = getSelection.createRange(),
                    textNode = document.createTextNode(range.text)

                    selected = {
                        range: range,
                        text: textNode,
                        html: range.htmlText
                    }
                    selected.word = range.expand('word').text
                }

                let vue = doc.body.__vue__
                callback && callback.call(this, selected, getSelection, editor, vue)
            })
        },

        /**
         * Set range selection
         * @param {Number} start
         * @param {Number} end
         */
        setSelection (start, end) {},

        /**
         * Create link
         * @return {[type]} [description]
         */
        createLink () {
            this.exec('CreateLink', this.button.link)
            this.$dispatch('disableEditor')
        },


        /**
         * Keyboard listener
         */
        keyboardListener (event) {
            this.element.$select()
        }
    }
}
</script>

<style lang="less">
@import "../../css/colors.less";
.ed-btn--wrapper {
    pointer-events: all;
    background: @dark-grey;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 5px 1px @transparent-black;
    border-radius: 2px;
    button {
        color: #dadada;
        display: inline-block;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
        background-color: @dark-grey;
        border: 0;
        font-size: 16px;
        width: 35px;
        height: 30px;
        border-right: 1px solid rgba(255, 255, 255, 0.14);
        border-top: 1px solid #2d3233;
        outline: none;
        border-radius: 2px;
        &:last {
            border-right: 0;
        }
        &:hover {
            border-top-color: lighten(#2d3233, 5%);
            background-color: lighten(@dark-grey, 5%);
        }

        &.active {
            background-color: darken(@dark-grey, 10%);
        }

        i {
            height: 16px;
            display: block;
            background-repeat: no-repeat;
            background-position: 50% 50%;

            &.link {
                background-image: url('../../img/link.svg');
            }

            &.remove-style {
                background-image: url('../../img/remove-style.svg');
            }

            &.color-picker {
                background-image: url('../../img/palette.svg');
            }
        }
    }
}
</style>
