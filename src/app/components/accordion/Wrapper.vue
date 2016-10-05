<template lang="pug">
.accordion-panel.uk-accordion(data-uk-accordion="{collapse: false}")
    slot
</template>

<script>
export default {
    name: 'accordionWrapper'
}
</script>
