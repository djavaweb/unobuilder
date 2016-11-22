<template lang="pug">
.right-panel(@click="closeAllPanels($event)")
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
    },
    methods: {
      closeAllPanels (e) {
        let element = e.target
        if (element.tagName.toLowerCase() === 'dt') {
          this.$root.closeAllPanels(['context', 'leftpanel', 'block'])
        } else {
          this.$root.closeAllPanels()
        }
      }
    }
}
</script>
