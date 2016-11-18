<template lang="pug">
.breadcrumbs(v-if="list.length>0", :class="class")
    .edit-tools
        // Breadcrumb list
        .selector
            a(
            track-by="$index",
            v-for="item in list",
            :class="{active: $index === 0 || expand}",
            @mouseover="showOutline(item, $index)",
            @click="breadcrumbAction(item, $index)"
            ) {{item.label}}

        // Copy and link editor
        a.copy(v-if="shouldDisplay", @click="$parent.copyElement()")
        a.options.options--link(v-if="shouldDisplay && elementLink", @click="$parent.editLink()")
        a.options.options--default(v-if="shouldDisplay && elementOptions && !elementLink", @click="$parent.editOptions()")

    a.remove.uk-icon-remove(
    v-if="shouldDisplay",
    @mouseover="$parent.removeOver()"
    @mouseleave="$parent.removeLeave()"
    @click="$parent.removeElement()"
    )
</template>

<script>
export default {
    name: 'breadcrumb',
    props: {
        list: {
            required: true,
            type: Array,
            default: () => []
        },

        state: {
            type: String,
            default: ''
        },

        class: {
            type: Array,
            default: () => []
        }
    },

    data () {
        return {
            expand: false
        }
    },

    computed: {
        shouldDisplay () {
            return this.state === 'select' &&
            this.$parent.elementKind !== 'body'
        },

        elementLink () {
          return this.$parent.elementKind === 'link'
        },

        elementOptions () {
          return this.$parent.elementOptions
        }
    },

    methods: {
        /**
         * Hover outline in canvas builder
         * @param  {Object} breadcrumb
         */
        showOutline (breadcrumb) {
            this.$root.canvasBuilder().layout().elementHover(breadcrumb)
        },

        /**
         * Action when breadcrumb is clicked,
         * If breadcrumb is collapse, expands breadcrumbs
         * If item in expands breadcrumb clicked, select element
         * @param  {Object} breadcrumb
         * @param  {Number} index
         */
        breadcrumbAction (breadcrumb, index) {
            if (! this.expand && this.state === 'select') {
                this.$root.canvasBuilder('contextMenu').hide()
                this.expand = true
            } else {
    			      this.$root.canvasBuilder().layout().elementSelect(breadcrumb)
            }
        }
    }
}
</script>
