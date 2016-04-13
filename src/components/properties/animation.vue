<template>
<div class="properties attribute" :class="{first: $index===0}" v-for="(key, attr) in props">
	<div class="uk-grid uk-grid-small">
		<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
		<div class="uk-width-4-5" transition="fade">
			<div v-if="key==='reveal'">
				<switch :value.sync="attr.value" float="left"></switch>
			</div>
			<div v-if="key==='transition'">
				<select v-model="attr.value" style="width:110px">
					<option v-for="anime in Animation" :value="anime.value">{{anime.label}}</option>
				</select>
			</div>
			<div v-if="key==='offset'">
				<number :value.sync="attr.value" label="pixel" :suffix="true" :prefix="false"></number>
			</div>
			<div v-if="key==='delay'">
				<number :value.sync="attr.value" label="ms" :min="1000" :max="10000" :step="100" :suffix="true" :prefix="false"></number>
			</div>
			<div v-if="key==='repeat'">
				<switch :value.sync="attr.value" float="left"></switch>
			</div>
		</div>
	</div>
</div>
</template>

<script>
/** JSON Data **/
import Animation from '../../data/animation.json'

/* Color Picker */
import Number from '../number.vue'

/* Color Picker */
import Switch from '../switch.vue'

export default {
	name: 'propertiesAnimation',
	components: {Switch, Number},
	props: {
		name: {default: ''},
		props: {default: {}}
	},
	data () {
		return {Animation: Animation}
	}
}
</script>