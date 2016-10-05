<template lang="pug">
.center-panel
    topbar-panel(v-ref:topbar-panel)
    canvas-builder(v-ref:canvas-builder)
</template>

<script>
import topbarPanel from './TopbarPanel.vue'
import canvasBuilder from './Canvas.vue'
export default {
    name: 'centerPanel',
    components: {
        topbarPanel,
        canvasBuilder
    }
}
</script>
