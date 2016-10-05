<template lang="pug">
// Custom Attributes
accordion-item(title="Attributes")
    accordion-item-view
        .uk-grid.uk-grid-small
            .uk-width-2-10
                label.input-label Class
            .uk-width-8-10
                input.input-text.uk-width-1-1(v-model="klass")

        .uk-grid.uk-grid-small(v-if="propertyState('page')")
            .uk-width-2-10
                label.input-label ID
            .uk-width-8-10
                input.input-text.uk-width-1-1(v-model="id")
// End of custom attributes
</template>

<script>
import utils from '../../utils.js'
import accordionItem from '../accordion/Item.vue'
import accordionItemView from '../accordion/ItemView.vue'
export default {
    name: 'Attr',
    components: {
        accordionItem,
        accordionItemView
    },
    computed: {
        klass: {
            get () {
                let selector = this.$root.elementSelector()
                if (selector.activeElement) {
                    return selector.activeElement.$get('klass', '')
                }
            },

            set (val) {
                let selector = this.$root.elementSelector()
                if (selector.activeElement) {
                    val = val.split(/\s/)
                    .map(item => utils.slugify(item))
                    .join(' ')
                    selector.activeElement.$set('klass', val, '')
                }
            }
        },

        id: {
            get () {
                let selector = this.$root.elementSelector()
                if (selector.activeElement) {
                    return selector.activeElement.$get('id', '')
                }
            },

            set (val) {
                let selector = this.$root.elementSelector()
                if (selector.activeElement) {
                    selector.activeElement.$set('id', utils.slugify(val), '')
                }
            }
        }
    },

    methods: {
        propertyState (state) {
            return this.$root.ref('rightPanel.tab').isTab(state)
        }
    }
}
</script>
