<template>
<div class="accordion uk-accordion" data-uk-accordion>
	<div class="uk-accordion-title">{{label}} <a class="uk-align-right"><i class="collapse"></i><i class="expand"></i></a></div>
	<div class="uk-accordion-content">
		<div class="properties">
			<div class="label-blocks" v-if="props">
				<label class="block"><input type="radio" v-model="props.type.value" :value="'none'"> None</label>
				<label class="block"><input type="radio" v-model="props.type.value" :value="'img'"> Image</label>
				<tree v-show="props.type.value==='img'" transition="expand">
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-1-1"><a href="#">Add Image</a></div>
					</div>

					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-5-10">
							<label>Background Type</label>
						</div>
						<div class="uk-width-5-10">
							<select v-model="props.style.value">
								<option v-for="type in bgType" :value="type.value">{{type.label}}</option>
							</select>
						</div>
					</div>
				</tree>
				<label class="block"><input type="radio" v-model="props.type.value" :value="'color'"> Color</label>
				<tree v-show="props.type.value==='color'" transition="expand">
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-8-10">
							<label>Pick a Color</label>
						</div>
						<div class="uk-width-2-10">
							<color-picker :color.sync="props.color.value"></color-picker>
						</div>
					</div>
				</tree>
				<label class="block"><input type="radio" v-model="props.type.value" :value="'video'"> Video</label>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import bgType from '../../data/bgtype.json'

/* Color Picker */
import colorPicker from '../color-picker.vue';

/* Tree View */
import Tree from '../tree.vue';

export default {
	name: 'propertiesBackground',
	components: {colorPicker, Tree},
	props: {
		name: {default: ''},
		props: {default: {}},
		label: {default: {}}
	},
	data () {
		return {bgType: bgType}
	}
}
</script>