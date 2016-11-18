<template lang="pug">
.popup(:style="positionStyle")
  .popup-window.link-editor
    .popup-inner
      a.popup-close.uk-icon-x(@click="hide()")
      .popup-title
      .popup-html
        .link-editor-tab
          .uk-grid.uk-grid-small
            .uk-width-2-5
              label.input-label
                strong Link Settings

            .uk-width-3-5
              .button-group.right
                rect-button.link-url(:active="isTab('url')", @click="setTab('url')")
                rect-button.link-post(:active="isTab('post')", @click="setTab('post')")
                rect-button.link-page(:active="isTab('page')", @click="setTab('page')")
                rect-button.link-email(:active="isTab('email')", @click="setTab('email')")
                rect-button.link-phone(:active="isTab('phone')", @click="setTab('phone')")

        .link-editor-content
          .uk-grid.uk-grid-small(v-if="isTab('url')")
            .uk-width-3-10
              label.input-label(for="link-url") URL
            .uk-width-7-10
              input.input-text.input-space-bottom.full(type="text", placeholder="e.g http://builder.uno", v-model="linkProp.href")
              input#link-url.input-checkbox(type="checkbox", v-model="linkProp.newTab", :checked="linkProp.newTab")
              label.input-label(for="link-url") Open in new tab

          .uk-grid.uk-grid-small(v-if="isTab('phone')")
            .uk-width-3-10
              label.input-label(for="link-url") Phone
            .uk-width-7-10
              input.input-text.input-space-bottom.full(type="text", placeholder="e.g +62081900000000", v-model="linkProp.phone")

          div(v-if="isTab('email')")
            .uk-grid.uk-grid-small
              .uk-width-3-10
                label.input-label(for="link-url") Email
              .uk-width-7-10
                input.input-text.input-space-bottom.full(type="email", placeholder="e.g email@builder.uno", v-model="linkProp.emailAddress")

            .uk-grid.uk-grid-small
              .uk-width-3-10
                label.input-label(for="link-url") Subject
              .uk-width-7-10
                  input.input-text.input-space-bottom.full(type="text", placeholder="e.g Hello", v-model="linkProp.emailSubject")
</template>

<script>
import rectButton from '../form/RectButton.vue'
export default {
    name: 'linkEditor',
    components: {
      rectButton
    },

    props: {
        element: {
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
      this.linkProp = this.element.$get('link')
    },

    watch: {
        'linkProp': {
          handler (val) {
            console.log(val);
            // this.link.$set('link', val)
          },
          deep: true
        }
    },

    computed: {
        positionStyle () {
          let style = {}
          style.top = '0px'
          style.left = '0px'
          style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
          style.position = 'absolute'
          style.zIndex = 999

          return style
        }
    }
}
</script>
