<template>
<div class="properties" v-if="type==='layout'" v-for="(prop, value) in props">
	<div class="uk-grid uk-grid-small">
		<label class="uk-width-1-5 uk-text-right">{{value.label}}</label>

		<div class="uk-width-4-5" transition="fade">
			<div v-if="prop==='margin'">
				<label><input type="radio" name="{{name}}-margin-type" value="inherit" v-model="value._.type"> Inherited from <a href="#customizer">customizer</a></label>
				<label class="block br"><input type="radio" name="{{name}}-margin-type" value="custom" v-model="value._.type"> Custom</label>

				<div v-if="value._.type==='inherit'">
					<label><input type="radio" name="{{name}}-margin-size" value="15" v-model="value._.tbValue"> Standard:15px</label>
					<label><input type="radio" name="{{name}}-margin-size" value="25" v-model="value._.tbValue"> Larger:25px</label>
					<label class="block br"><input type="radio" name="{{name}}-margin-size" value="10" v-model="value._.tbValue"> Smaller:10px</label>

					<label class="block"><input type="checkbox" v-model="value._.tb"> Margin top + bottom</label>
					<label class="block"><input type="checkbox" :disabled="value._.tb" v-model="value.include.t"> Margin top</label>
					<label class="block"><input type="checkbox" :disabled="value._.tb" v-model="value.include.b"> Margin bottom</label>
					<label class="block"><input type="checkbox" :disabled="value._.tb" v-model="value.include.l"> Margin left</label>
					<label class="block"><input type="checkbox" :disabled="value._.tb" v-model="value.include.r"> Margin right</label>
				</div>
				<div v-if="value._.type==='custom'" style="margin-top: 15px">
					<div class="uk-grid">
						<div class="uk-width-3-5">
							<number :enable="value._.all" :value.sync="value._.allValue" label="All Sides"></number>
						</div>
						<div class="uk-width-2-5">
							<switch :value.sync="value._.all"></switch>
						</div>
					</div>

					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-3-6">
							<number :enable="! value._.all" :value.sync="value.styles[0]" label="Top"></number>
						</div>
						<div class="uk-width-3-6">
							<number :enable="! value._.all" :value.sync="value.styles[1]" label="Right"></number>
						</div>
					</div>

					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-3-6">
							<number :enable="! value._.all" :value.sync="value.styles[3]" label="Left"></number>
						</div>
						<div class="uk-width-3-6">
							<number :enable="! value._.all" :value.sync="value.styles[2]" label="Bottom"></number>
						</div>
					</div>
				</div>
			</div>
			<div v-if="prop==='padding'">
				<div class="uk-grid">
					<div class="uk-width-3-5">
						<number :enable="value._.all" :value.sync="value._.allValue" label="All Sides"></number>
					</div>
					<div class="uk-width-2-5">
						<switch :value.sync="value._.all"></switch>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="! value._.all" :value.sync="value.styles[0]" label="Top"></number>
					</div>
					<div class="uk-width-3-6">
						<number :enable="! value._.all" :value.sync="value.styles[1]" label="Right"></number>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="! value._.all" :value.sync="value.styles[3]" label="Left"></number>
					</div>
					<div class="uk-width-3-6">
						<number :enable="! value._.all" :value.sync="value.styles[2]" label="Bottom"></number>
					</div>
				</div>
			</div>
			<div v-if="prop==='border'">
				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="value._.all" :value.sync="value._.allValue.width" label="All Sides"></number>
					</div>
					<div class="uk-width-2-6">
						<border-style :enable="value._.all" :value.sync="value._.allValue.style"></border-style>
						<color-picker :enable="value._.all" :color.sync="value._.allValue.color"></color-picker>
					</div>
					<div class="uk-width-1-6">
						<switch :value.sync="value._.all"></switch>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="!value._.all" :value.sync="value.styles.width[0]" label="Top"></number>
					</div>
					<div class="uk-width-3-6">
						<border-style :enable="!value._.all" :value.sync="value.styles.style[0]"></border-style>
						<color-picker :enable="!value._.all" :color.sync="value.styles.color[0]"></color-picker>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="!value._.all" :value.sync="value.styles.width[1]" label="Right"></number>
					</div>
					<div class="uk-width-3-6">
						<border-style :enable="!value._.all" :value.sync="value.styles.style[1]"></border-style>
						<color-picker :enable="!value._.all" :color.sync="value.styles.color[1]"></color-picker>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="!value._.all" :value.sync="value.styles.width[3]" label="Left"></number>
					</div>
					<div class="uk-width-3-6">
						<border-style :enable="!value._.all" :value.sync="value.styles.style[3]"></border-style>
						<color-picker :enable="!value._.all" :color.sync="value.styles.color[3]"></color-picker>
					</div>
				</div>

				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-3-6">
						<number :enable="!value._.all" :value.sync="value.styles.width[2]" label="Bottom"></number>
					</div>
					<div class="uk-width-3-6">
						<border-style :enable="!value._.all" :value.sync="value.styles.style[2]"></border-style>
						<color-picker :enable="!value._.all" :color.sync="value.styles.color[2]"></color-picker>
					</div>
				</div>
			</div>
			<div v-if="prop==='width'">
				<label class="block"><input type="radio" name="{{name}}-width-type" value="bg" v-model="value._.type"> Background <a href="#" style="margin-left:15px">Goto Background Settings</a></label>
				<label><input type="radio" name="{{name}}-width-type" value="content" v-model="value._.type"> Content</label>
			</div>
		</div>
	</div>
</div>

<div class="properties attribute" v-if="type==='attribute'" v-for="(key, attr) in props">
	<div class="uk-grid uk-grid-small">
		<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
		<div class="uk-width-4-5" transition="fade">
			<div v-if="key==='class'">
				<input v-model="attr.value" type="text">
			</div>
			<div v-if="key==='id'">
				<input v-model="attr.value" type="text">
			</div>
			<div v-if="key==='css'">
				<textarea v-model="attr.value" cols="40" rows="10"></textarea>
			</div>
		</div>
	</div>
</div>

<div v-if="type=='background'" v-for="(key, attr) in props">
	<div class="properties attribute" v-if="key==='type'">
		<div class="uk-grid uk-grid-small">
			<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
			<div class="uk-width-4-5" transition="fade">
				<label><input type="radio" name="{{name}}-background-type" v-model="attr.value" value="img"> Image</label>
				<label><input type="radio" name="{{name}}-background-type" v-model="attr.value" value="color"> Color</label>
				<label><input type="radio" name="{{name}}-background-type" v-model="attr.value" value="video"> Video</label>
			</div>
		</div>
	</div>
	<div class="properties attribute" v-if="key==='image' && props.type.value==='img'">
		<div class="uk-grid uk-grid-small">
			<label class="uk-width-1-5 uk-text-right">{{props.image.label}}</label>
			<div class="uk-width-4-5" transition="fade">
				<a>Add Image</a>
			</div>
		</div>
	</div>
	<div class="properties attribute" v-if="key=='color' && props.type.value==='color'">
		<div class="uk-grid uk-grid-small">
			<label class="uk-width-1-5 uk-text-right">{{attr.label}}</label>
			<div class="uk-width-4-5" transition="fade">
				<color-picker :color.sync="attr.value" position="right" :show-hex="true"></color-picker>
			</div>
		</div>
	</div>
	<div class="properties attribute" v-if="key==='style' && props.type.value==='img'">
		<div class="uk-grid uk-grid-small">
			<label class="uk-width-1-5 uk-text-right">{{props.style.label}}</label>
			<div class="uk-width-4-5">
				<select v-model="attr.value">
					<option v-for="type in bgType" :value="type.value">{{type.label}}</option>
				</select>
			</div>
		</div>
	</div>
</div>
</template>

<script>
/* Color Picker */
import Switch from './switch.vue';

/* Border Style */
import borderStyle from './border-style.vue';

/* Color Picker */
import colorPicker from './color-picker.vue';

/* Dropable */
import Number from './number.vue';

export default {
	name: 'Properties',
	components: {Switch, borderStyle, colorPicker, Number},
	props: {
		type: {default: ''},
		name: {default: ''},
		props: {default: {}}
	}
}
</script>