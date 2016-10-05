<template lang="pug">
.accordion-expand-view(transition="fade")
	slot
</template>

<script>
export default {
	name: 'accordionExpandView',
	props: {}
}
</script>
