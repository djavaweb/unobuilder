<template>
<div class="accordion uk-accordion" data-uk-accordion>
	<div class="uk-accordion-title">{{label}} <a class="uk-align-right"><i class="collapse"></i><i class="expand"></i></a></div>
	<div class="uk-accordion-content">
		<div class="properties">
			<div class="label-blocks" v-if="props">
				<label class="block"><input type="radio" v-model="props.value" :value="false"> None</label>
				<label class="block"><input type="radio" v-model="props.value" :value="true">Yes: This container and it's content</label>
				<label class="block"><input type="radio" v-model="props.value" :value="'yes'">Yes: Only this container</label>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'propertiesExpand',
	props: {
		label: {default: ''},
		props: {default: null}
	}
}
</script>