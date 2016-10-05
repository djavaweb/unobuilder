<template lang="pug">
.right-panel-container
    accordion
        prop-display(v-ref:display)
        prop-position(v-ref:position)
        prop-attr(v-ref:attribute)
        prop-typography(v-ref:typography)
        prop-background(v-ref:background)
</template>

<script>
import accordion from '../accordion/Wrapper.vue'
import propDisplay from '../properties/Display.vue'
import propPosition from '../properties/Position.vue'
import propSize from '../properties/Size.vue'
import propAttr from '../properties/Attr.vue'
import propTypography from '../properties/Typography.vue'
import propBackground from '../properties/Background.vue'

export default {
    name: 'rightPanelPropertiesItem',
    components: {
        accordion,
        propDisplay,
        propPosition,
        propSize,
        propAttr,
        propTypography,
        propBackground
    },

    data () {
        return {
            ready: true
        }
    },

    methods: {
        hasProps () {
            return true
        }
    }
}
</script>
