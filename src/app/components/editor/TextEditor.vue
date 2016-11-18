<template lang="pug">
.text-editor(:style="style")
  .text-editor__wrapper
    button(
    id="{{btn.id}}",
    :class="{active: btn.toggle}",
    v-for="btn in defaultButtons",
    @click="command(btn)",
    title="{{{btn.title}}}") {{{btn.label}}}

  color-picker(v-if="displayColorPicker", :colors.sync="colors", scheme="dark")
</template>

<script>
import _extend from 'lodash/extend'
import rectButton from '../form/RectButton.vue'
import utils from '../../utils.js'
import colorPicker from 'vue-sketch-color-picker'

export default {
    name: 'editor',
    components: {rectButton, colorPicker},
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
            displayColorPicker: false,
            colors: {
              hex: '#000000',
              hsl: {
                h: 150,
                s: 0.5,
                l: 0.2,
                a: 1
              },
              hsv: {
                h: 150,
                s: 0.66,
                v: 0.30,
                a: 1
              },
              rgba: {
                r: 25,
                g: 77,
                b: 51,
                a: 1
              },
              a: 1
            },
            defaultButtons: _extend([
                {
                    id: 'bold',
                    label: '<i class="text-editor-bold"></i>',
                    title: 'Bold',
                    command: 'bold'
                },
                {
                    id: 'italic',
                    label: '<i class="text-editor-italic"></i>',
                    title: 'Italic',
                    command: 'italic'
                },
                {
                    id: 'link',
                    label: '<i class="text-editor-link"></i>',
                    title: 'Insert Link',
                    command: 'fn',
                    fn () {
                        let layout = this.$root.canvasBuilder().layout()
                        this.getSelection((selection, selector, editor) => {
                            selector().removeAllRanges()
                            selector().addRange(selection.range)

                            layout.createElement({
                                tag: 'a',
                                kind: 'link',
                                type: 'component',
                                html: selection.word,
                                options: 'link',
                                wrapper: false,
                                selectable: true,
                                dropable: 'section,container,row,column,content'
                            }, (link) => {
                                let tmp = editor.createElement('div')
                                tmp.id = utils.generateId('tmp')
                                this.exec('insertHTML', tmp.outerHTML)

                                // Then replace temporary element
                                // with link
                                let tmpEl = editor.querySelector(`#${tmp.id}`)
                                tmpEl.parentNode.replaceChild(link, tmpEl)

                                layout.applyEditor(false)
                                selector().removeAllRanges()
                                link.$select()
                            })
                        })
                    }
                },
                {
                    id: 'remove',
                    label: '<i class="text-editor-clear"></i>',
                    title: 'Clear Style',
                    command: 'fn',
                    fn () {
                        let layout = this.$root.canvasBuilder().layout()
                        this.getSelection((selection, selector, editor) => {
                            selector().removeAllRanges()
                            selector().addRange(selection.range)
                            this.exec('insertHTML', selection.word)
                            // Todo. Remove Link from layout.elements
                        })
                    }
                },
                {
                    id: 'color-picker',
                    label: '<i class="text-editor-color"></i>',
                    title: 'Color',
                    command: 'fn',
                    fn () {
                      this.displayColorPicker = !this.displayColorPicker
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
            if (this.element && this.$root.canvasBuilder().layoutDOM()) {
                let editor = this.element.ownerDocument
                callback && callback.call(this, editor, this.$root.canvasBuilder().layoutDOM())
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
                    button.fn && button.fn.apply(this, [button, editor])
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
                    let div = doc.createElement('div')
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
                    textNode = doc.createTextNode(range.text)

                    selected = {
                        range: range,
                        text: textNode,
                        html: range.htmlText
                    }
                    selected.word = range.expand('word').text
                }

                callback && callback.call(this, selected, getSelection, editor)
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
