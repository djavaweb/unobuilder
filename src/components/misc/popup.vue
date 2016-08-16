<template>
<div class="popup" :style="style">
    <div class="popup-inner">
        <a class="popup-close uk-icon-close" @click="closePopup()"></a>
        <div class="popup-title" v-html="title"></div>
        <div class="popup-html"><slot></slot></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'popup',
    props: {
        title: {
            required: true,
            type: String,
            default: ''
        },

        position: {
            required: false,
            type: Object,
            default: null
        },

        close: {
            required: false,
            type: Function,
            default: null
        }
    },

    computed: {
        style () {
            if (this.position) {
                return this.position
            }

            return {position: 'relative'}
        }
    },

    methods: {
        closePopup () {
            this.close && typeof this.close === 'function' && this.close.call(this)
        }
    }
}
</script>

<style lang="less">
@import "../../css/colors.less";
@import "../../css/button.less";

.popup {
    padding: 10px;
    background-color: @charcoal-grey-four;
    box-shadow: 0 1px 2px 5px rgba(0,0,0,0.2);
    border-radius: 3px;

    &-inner {
        position: relative;
    }

    &-title {
        text-transform: capitalize;
        text-align: center;
        color: #ffffff;
        font-size: 11px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    &-close {
        position: absolute;
        color: @white;
        right: 0;
        top: 0;
        font-size: 11px;

        &:hover {
            color: @white;
        }
    }

    &-html {

        .uk-grid {
            margin-top: 5px;
        }

        label {
            font-size: 11px;
            color: @white;
            margin-right: 10px;
            width: 90px;
            display: inline-block;
            text-transform: capitalize;
        }
        button {
            .button;
            line-height: normal;
            outline: none;
            width: 100%;
            color: @white;
            margin-top: 15px;
            padding-top: 8px;
            padding-bottom: 8px;
        }
        select {
            margin-bottom: 5px;
            width: 60px;
        }
    }
}
</style>
