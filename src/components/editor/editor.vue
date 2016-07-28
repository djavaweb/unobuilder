<template>
<div class="ed-btn--wrapper" :style="style">
    <button v-for="btn in defaultButtons" @click="command(btn)" title="{{{btn.title}}}" id="{{btn.id}}" :class="{'active': btn.toggle}">{{{btn.label}}}</button>
    <div class="ed-btn--tools">
        <!--<div class="ed-btn--tools-link" v-if="toggle === 'link'">
            <input class="input-text" placeholder="http://" v-model="button.link" /> <rect-button class="group" @click="createLink()"><span>OK</span></rect-button>
        </div>-->
    </div>
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

            this.toggle = ''
            this.button = {}
        }
    },

    data () {
        return {
            editor: null,
            toggle: '',
            button: {},
            defaultButtons: _.extend([
                {id: 'bold', label: '<i class="uk-icon-bold"></i>', title: 'Bold', command: 'bold'},
                {id: 'italic', label: '<i class="uk-icon-italic"></i>', title: 'Italic', command: 'italic'},
                {id: 'link', label: '<i class="link"></i>', title: 'Insert Link', toggle: false, command: 'fn', fn () {
                    this.getSelection((selection, selector, editor, window) => {
                        selector().removeAllRanges()
                        selector().addRange(selection.range)
                        console.log(editor)
                        //this.exec('insertHTML', '{{data|json}}')
                        //this.exec('insertHTML', '<span class="uno-el uno-link">' + selection.word +'</span>')
                        selector().removeAllRanges()
                        this.$dispatch('disableEditor')
                    })
                }},
                {id: 'remove', label: '<i class="remove-style"></i>', title: 'Clear Style', command: 'removeFormat'},
                {id: 'color-picker', label: '<i class="color-picker"></i>', title: 'Color', command: 'fn', fn () {

                }}
            ], this.buttons)
        }
    },

    methods: {
        getEditor (callback) {
            if (this.element && this.window) {
                let editor = this.element.ownerDocument
                callback && callback.call(this, editor, this.window)
            }
        },

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
                if (window.getSelection || window.document.getSelection) {
                    getSelection = window.document.getSelection
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

                callback && callback.call(this, selected, getSelection, editor, window)
            })
        },


        setSelection (start, end) {

        },

        createLink () {
            this.exec('CreateLink', this.button.link)
            this.$dispatch('disableEditor')
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

.ed-btn--tools {
    position: relative;
    &-link {
        position: absolute;
        top: 2px;
        background: @charcoal-grey;
        border-radius: 2px;
        padding: 5px;
        width: 200px;
        input {
            width: 85%;
        }
    }
}
</style>
