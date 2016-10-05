<template lang="pug">
.right-panel
    right-panel-tab(v-ref:tab)
    right-panel-properties(v-ref:properties)
</template>

<script>
import rightPanelTab from './RightPanelTab.vue'
import rightPanelProperties from './RightPanelProperties.vue'
export default {
    name: 'rightPanel',
    components: {
        rightPanelTab,
        rightPanelProperties
    }
}
</script>
