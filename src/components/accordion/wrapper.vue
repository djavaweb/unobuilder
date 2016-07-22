<template>
<div class="accordion-panel uk-accordion" :id="id">
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

        // Init accordion
        this.$nextTick(function () {
            this.accordion = UIkit.accordion('#' + this.id, {
                collapse: false
            })
        })
    }
}
</script>
