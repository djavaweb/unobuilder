<template>
<div id="ed-btn-wrapper" :style="style">
    {{baba}}
    <button v-for="btn in defaultButtons" @click="command(btn)" title="{{{btn.title}}}" id="{{btn.id}}">{{{btn.label}}}</button>
</div>
</template>

<script>
import _ from 'underscore'

export default {
    name: 'editor',
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
            defaultButtons: _.extend([
                {label: '<i class="uk-icon-bold"></i>', title: 'Bold', command: 'bold'},
                {label: '<i class="uk-icon-italic"></i>', title: 'Italic', command: 'italic'},
                {label: '<i class="link"></i>', title: 'Insert Link', command: 'fn', fn () {

                }},
                {label: '<i class="remove-style"></i>', title: 'Clear Style', command: 'removeFormat'},
                {label: '<i class="color-picker"></i>', title: 'Color', command: 'fn', fn () {

                }}
            ], this.buttons)
        }
    },

    methods: {
        command (button) {
            if (this.element) {
                let editor = this.element.ownerDocument

                if (button.command !== 'fn') {
                    editor.execCommand(button.command, false, null)
                } else {
                    button.fn && button.fn.apply(this, [button, editor])
                }
            }
        }
    }
}
</script>

<style lang="less">
@import "../../css/colors.less";
#ed-btn-wrapper {
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
        border-right: 1px solid @black;
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
