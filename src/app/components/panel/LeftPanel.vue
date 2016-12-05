<template lang="pug">
// Left panel
.left-panel(
:class="resizeCursor"
)
    // Black overlay
    .left-panel__blackout(@click="$root.closeAllPanels()")

    // Panel buttons
    .left-panel__buttons
        a.toggle-button(
        :class="{active: isActivePanel(panelName)||panel.selected}",
        v-for="(panelName, panel) in panels",
        @click="setPanel(panelName, panel)"
        )
            i(class="{{panel.icon}}")
    // End of panel buttons

    // Components Panel
    .element-chooser-panel.animated(
    transition="slide-left-panel",
    v-show="isActivePanel('component')"
    )
        // Close component panel
        .title
            | Add Elements
            a.uk-icon-x(@click="setPanel('component')")

        // Search component panel
        .search
            input.input-text.full(
            type="text",
            v-model="search",
            placeholder="Search Elements"
            )

        // Component List
        accordion(v-if="componentLoaded", v-ref:accordion)
            accordion-item(v-for="(groupName, items) in components|filterBy search", :title="groupName")
                component-item(
                v-for="component in items|orderBy component.$id -1|filterBy search",
                :component="component",
                :class="componentClass(component.settings.id, $index)")
// End of left panel
</template>

<script>
import _each from 'lodash/each'
import _size from 'lodash/size'
import accordion from '../accordion/Wrapper.vue'
import accordionItem from '../accordion/Item.vue'
import componentItem from './LeftPanelComponent.vue'
import utils from '../../utils.js'
import client from '../../client.js'
export default {
    name: 'leftPanel',

    components: {
        accordion,
        accordionItem,
        componentItem
    },

    data () {
        return {
            search: null,
            components: {},
            dragComponent: false,
            componentLoaded: false,
            panels: {
                component: {
                    icon: 'uk-icon-plus',
                    selected: true,
                    active: false
                },

                cssEditor: {
                    icon: 'icon-code-editor',
                    active: false
                }
            }
        }
    },

    computed: {
        /**
         * Get active panel
         * @return {String}
         */
        activePanel () {
            for (let name in this.panels) {
                if (this.panels[name].active) {
                    return name
                }
            }
        }
    },

    methods: {
        /**
         * Toggle panel
         * @param {String} panelName
         */
        setPanel (panelName) {
          // If panel
          if (this.panels[panelName].selected !== undefined &&
            ! this.panels[panelName].selected) {
            return
          }

          // Toggle panel state
          this.panels[panelName].active = !this.panels[panelName].active

          // If panel is css editor, set component unselected
          if (panelName === 'cssEditor') {
            this.panels.component.selected = !this.panels[panelName].active
            if (this.panels[panelName].active) {
                this.panels.component.active = !this.panels[panelName].active
            }
          }

          /**
           * Broadcast an event
           * Tell taht leftPanel has been changed
           */
          this.$root.$broadcast('leftPanel', this.activePanel)
        },

        /**
         * Check whether panel name is active
         * @param {String} panelName
         * @return {Boolean}
         */
        isActivePanel (panelName) {
            return this.panels[panelName].active
        },

        /**
         * Hide panel
         */
        hide () {
          if (this.isActivePanel('component')) {
            this.setPanel('component')
          }
        },

        /**
         * Generate component class
         * @param  {String} id
         * @param  {Number} index
         * @return {Array}
         */
        componentClass (id, index) {
          let klass = [`component-${utils.slugify(id)}`]

          // Only 3 item in one row
          if ((index + 1) % 3 === 0) {
              klass.push('no-space-right')
          }

          return klass
        }
    },

    ready () {
        /**
         * Event when add component called
         */
        client.on('componentAdded', (component) => {
            this.componentLoaded = false
            this.$nextTick(() => {
                // Create new group if not defined
                if (! this.components[component.settings.group]) {
                    this.components[component.settings.group] = []
                }

                // Push component to group of components
                this.components[component.settings.group].push(component)

                // Component is ready
                component.ready && component.ready.apply(component)
                this.componentLoaded = true
            })
        })
    }
}
</script>
