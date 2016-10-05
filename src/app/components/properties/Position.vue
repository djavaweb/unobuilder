<template lang="pug">
accordion-item(title="Position, Border & Spacings", :mouse-state.sync="mouseState")
</template>

<script>
import accordionItem from '../accordion/Item.vue'
export default {
    name: 'Position',
    components: {accordionItem},
    data () {
        return {
            mouseState: 'none'
        }
    }
}
</script>
