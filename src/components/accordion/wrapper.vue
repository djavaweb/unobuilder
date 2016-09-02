<template>
<div class="accordion-panel uk-accordion" data-uk-accordion="{collapse: false}" :id="id">
    <slot></slot>
</div>
</template>

<script>
export default {
    name: 'accordionWrapper',
    data () {
        return {
            id: null,
            accordion: null
        }
    },
    ready () {
        this.id = this.$root.generateId('accordion')
    }
}
</script>
