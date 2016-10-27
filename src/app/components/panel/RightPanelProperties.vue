<template lang="pug">
.right-panel-container
    accordion(v-ref:accordion-wrapper)
        prop-display(v-ref:display)
        prop-box-properties(v-ref:box)
        prop-attr(v-ref:attribute)
        prop-typography(v-ref:typography)
        prop-background(v-ref:background)
</template>

<script>
import accordion from '../accordion/Wrapper.vue'
import propDisplay from '../properties/Display.vue'
import propBoxProperties from '../properties/BoxProperties.vue'
import propSize from '../properties/Size.vue'
import propAttr from '../properties/Attr.vue'
import propTypography from '../properties/Typography.vue'
import propBackground from '../properties/Background.vue'

export default {
    name: 'rightPanelPropertiesItem',
    components: {
        accordion,
        propDisplay,
        propBoxProperties,
        propSize,
        propAttr,
        propTypography,
        propBackground
    }
}
</script>
