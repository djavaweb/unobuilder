<template lang="pug">
// Right panel navigation bar
.right-panel-navbar
    a.edit(
    @click="setTab(tab.id)",
    :class="{active: isTab(tab.id)}",
    v-for="tab in optionTab",
    v-html="tab.label"
    )
// End of right panel navigation bar
</template>

<script>
export default {
    name: 'rightPanelTab',
    methods: {
        setTab (tabId) {
            this.activeTab = tabId
            this.$root.canvasBuilder().layout().$set('propertyState', tabId)
        },

        isTab (tabId) {
            return this.activeTab === tabId
        }
    },

    data () {
        return {
            activeTab: 'global',
            optionTab: [
                {
                    id: 'page',
                    label: 'Page Options'
                },

                {
                    id: 'global',
                    label: 'Global Options'
                }
            ]
        }
    }
}
</script>
