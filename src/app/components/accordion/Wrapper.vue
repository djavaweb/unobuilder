<template lang="pug">
.accordion-panel.uk-accordion(v-el:accordion-wrapper)
    slot
</template>

<script>
import UIKitAccordion from 'uikit/dist/js/components/accordion'
export default {
    name: 'accordionWrapper',
    attached () {
        UIKitAccordion(this.$els.accordionWrapper, {
            collapse: false
        })
    }
}
</script>
