<template>
    <div class="link-editor" :style="positionStyle"
    @mousedown="dragStart($event)"
    @mousemove="dragMove($event)"
    @mouseup="dragEnd($event)"
    @mouseleave="dragEnd($event)">
        <div class="link-editor-close">
            <a class="uk-icon-close" @click="close"></a>
        </div>
        <div class="link-editor-tab">
            <div class="uk-grid uk-grid-small">
			<div class="uk-width-2-5">
				<label class="input-label"><strong>Link Settings</strong></label>
			</div>
			<div class="uk-width-3-5">
				<div class="button-group right">
                    <rect-button class="link-url"
                    :active="isTab('url')" @click="setTab('url')"></rect-button>
                    <rect-button class="link-post"
                    :active="isTab('post')" @click="setTab('post')"></rect-button>
                    <rect-button class="link-page"
                    :active="isTab('page')" @click="setTab('page')"></rect-button>
                    <rect-button class="link-email"
                    :active="isTab('email')" @click="setTab('email')"></rect-button>
                    <rect-button class="link-phone"
                    :active="isTab('phone')" @click="setTab('phone')"></rect-button>
				</div>
			</div>
		</div>
        </div>
        <div class="link-editor-content">
            <div class="uk-grid uk-grid-small" v-if="isTab('url')">
                <label class="input-label input-align-right uk-width-3-10" for="link-url">URL</label>
                <div class="uk-width-7-10">
                    <input type="text" class="input-text input-space-bottom full" placeholder="e.g http://builder.uno" v-model="linkProp.href" />
                    <input type="checkbox" class="input-checkbox" id="link-url" v-model="linkProp.newTab" :checked="linkProp.newTab" />
                    <label class="input-label" for="link-url">Open in new tab</label>
                </div>
            </div>
            <div class="uk-grid uk-grid-small" v-if="isTab('phone')">
                <label class="input-label input-align-right uk-width-3-10" for="link-url">Phone</label>
                <div class="uk-width-7-10">
                    <input type="text" class="input-text input-space-bottom full" placeholder="e.g +62081900000000" v-model="linkProp.phone" />
                </div>
            </div>
            <div v-if="isTab('email')">
                <div class="uk-grid uk-grid-small">
                    <label class="input-label input-align-right uk-width-3-10" for="link-url">Email</label>
                    <div class="uk-width-7-10">
                        <input type="email" class="input-text input-space-bottom full" placeholder="e.g email@builder.uno" v-model="linkProp.email.address" />
                    </div>
                </div>
                <div class="uk-grid uk-grid-small">
                    <label class="input-label input-align-right uk-width-3-10" for="link-url">Subject</label>
                    <div class="uk-width-7-10">
                        <input type="text" class="input-text input-space-bottom full" placeholder="e.g Hello" v-model="linkProp.email.subject" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import "../../css/colors.less";
.link-editor {
    pointer-events: all;
    background: @charcoal-grey-four;
    width: 240px;
    position: absolute;
    z-index: 999;

    .uk-align-right {
        margin: 0
    }
    &-close {
        padding: 10px;
        text-align: right;
        cursor: default;
    }
    &-tab {
        clear: both;
        .input-label {
            padding-left: 10px;
            margin-top: 10px;
        }
        .rect-button {
            width: 30px;
            height: 30px;
            &.link {
                &-url {
                    background-image: url('../../img/link.svg');
                }
                &-post {
                    background-image: url('../../img/link-post.svg')
                }
                &-page {
                    background-image: url('../../img/link-page.svg')
                }
                &-email {
                    background-image: url('../../img/link-email.svg')
                }
                &-phone {
                    background-image: url('../../img/link-phone.svg')
                }
            }
        }
    }
    &-content {
        clear: both;
        background-color: @charcoal-semi-dark;
        padding: 20px 15px;
    }
}
</style>

<script>
import rectButton from '../misc/rect-button.vue'
export default {
    name: 'linkEditor',
    props: {
        link: {
            required: true
        },
        position: {
            default: {
                x: 0,
                y: 0
            }
        }
    },

    data () {
        return {
            dragging: false,
            drag: {
                x: 0,
                y: 0
            },

            delta: {
                x: 0,
                y: 0
            },

            linkProp: {}
        }
    },

    methods: {
        getCoord (axis, event) {
            if (axis === 'x') {
                axis = document.all? window.event.clientX: event.pageX
            } else {
                axis = document.all? window.event.clientY: event.pageY
            }

            return axis
        },

        dragStart (event) {
            let rect = this.$el.getBoundingClientRect()
            this.drag.x = this.getCoord('x', event) - rect.left + 40
            this.drag.y = this.getCoord('y', event) - rect.top + 40
            this.dragging = true
        },

        dragMove (event) {
            if (this.dragging && event.target.classList.contains('link-editor-close')) {
                let offset = this.$el.getBoundingClientRect()
                this.delta.x = this.getCoord('x', event) - this.drag.x
                this.delta.y = this.getCoord('y', event) - this.drag.y
                this.position.x = this.delta.x
                this.position.y = this.delta.y
            }
        },

        mouseleave (event) {
            this.dragEnd(event)
        },

        dragEnd (event) {
            if (this.dragging) {
                this.dragging = false
            }
        },

        isTab (type) {
            return this.linkProp.type === type
        },

        setTab (type) {
            this.$set('linkProp.type', type)
        },

        close () {
            this.$root.$broadcast('closeLinkPopup')
        }
    },

    ready () {
        this.linkProp = this.link.$get('link')
    },

    watch: {
        'linkProp': {
            handler (val) {
                this.link.$set('link', val)
            },
            deep: true
        }
    },

    components: {
        rectButton
    },

    computed: {
        positionStyle () {
            let style = {}
            style.top = '0px'
            style.left = '0px'
            style.transform = `translate(${this.position.x}px, ${this.position.y}px)`

            return style
        }
    }
}
</script>
