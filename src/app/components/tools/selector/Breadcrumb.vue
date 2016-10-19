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
        a.copy.uk-icon-copy(v-if="state==='select'", @click="$parent.copyElement()")
        a.link.uk-icon-link(v-if="state==='select' && link", @click="editLink()")

    a.remove.uk-icon-remove(
    v-if="displayRemove",
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

        link: {
            type: Boolean,
            default: false
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
        displayRemove () {
            return this.state === 'select' && this.$parent.elementKind !== 'body'
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
        },

        isLink () {}
    }
}
</script>
