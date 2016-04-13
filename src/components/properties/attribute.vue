<template>
<div class="accordion uk-accordion" data-uk-accordion>
	<div class="uk-accordion-title">{{label}} <a class="uk-align-right"><i class="collapse"></i><i class="expand"></i></a> </div>
	<div class="uk-accordion-content">
		<div class="properties" v-for="(key, attr) in props">
			<label >{{attr.label}}</label>
			<div v-if="key==='class'">
				<input v-model="attr.value" type="text" class="uk-width-1-1">
			</div>
			<div v-if="key==='id'">
				<input v-model="attr.value" type="text" class="uk-width-1-1">
			</div>
			<div v-if="key==='css'">
				<textarea v-model="attr.value" cols="40" rows="10" class="uk-width-1-1"></textarea>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'propertiesAttribute',
	props: {
		name: {default: ''},
		props: {default: {}},
		label: {default: ''}
	}
}
</script>