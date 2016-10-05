<template lang="pug">
// Left panel
.left-panel(
:class="resizeCursor"
)
    // Black overlay
    .blackout

    // Panel buttons
    .left-panel-buttons
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
            a.uk-icon-close(@click="setPanel('component')")

        // Search component panel
        .search
            input.input-text.full(
            type="text",
            v-model="search",
            placeholder="Search Elements"
            )
// End of left panel
</template>

<script>
export default {
    name: 'leftPanel',

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

    data () {
        return {
            search: null,
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
    }
}
</script>
