<template>
<div class="accordion uk-accordion" data-uk-accordion>
	<div class="uk-accordion-title">{{label}} <info :text="info"></info> <a class="uk-align-right"><i class="collapse"></i><i class="expand"></i></a></div>
	<div class="uk-accordion-content">
		<div class="properties" v-for="(key, attr) in props" v-if="key!=='grow'&&key!=='shrink'&&key!=='basis'">
			<div class="uk-grid uk-grid-collapse">
				<label class="uk-width-6-10">{{attr.label}}<info :text="attr.help" v-if="attr.help"></info></label>
				<div class="uk-width-4-10">
					<div v-if="key==='order'" class="uk-align-right">
						<number :value.sync="attr.value" :min="0" :max="9999" :step="1" :suffix="false" :prefix="false"></number>
					</div>

					<div v-if="key==='align'" class="uk-align-right">
						<select v-model="attr.value">
							<option v-for="align in Flex.align" :value="align.value">{{align.label}}</option>
						</select>
					</div>

					<div v-if="key==='direction'" class="uk-align-right">
						<select v-model="attr.value">
							<option v-for="direction in Flex.direction" :value="direction.value">{{direction.label}}</option>
						</select>
					</div>

					<div v-if="key==='wrap'" class="uk-align-right">
						<select v-model="attr.value">
							<option v-for="wrap in Flex.wrap" :value="wrap.value">{{wrap.label}}</option>
						</select>
					</div>
				</div>
			</div>
		</div>


		<div v-if="props" class="label-blocks">
			<label><input type="radio" :value="false" v-model="props.override.value"> None</label>
			<label><input type="radio" :value="true" v-model="props.override.value"> Enter property value</label>
			<tree v-show="props.override.value===true" transition="expand">
				<div class="properties">
					<div class="uk-grid uk-grid-collapse">
						<label class="uk-width-4-10">{{props.grow.label}}</label>
						<div class="uk-width-6-10">
							<div class="uk-align-right"><number :value.sync="props.grow.value" :min="0" :max="100" :step="1" :suffix="false" :prefix="false"></number></div>
						</div>
					</div>
				</div>

				<div class="properties">
					<div class="uk-grid uk-grid-small">
						<label class="uk-width-4-10">{{props.shrink.label}}</label>
						<div class="uk-width-6-10">
							<div class="uk-align-right"><number :value.sync="props.shrink.value" :min="0" :max="100" :step="1" :suffix="false" :prefix="false"></number></div>
						</div>
					</div>
				</div>

				<div class="properties">
					<div class="uk-grid uk-grid-small">
						<label class="uk-width-4-10">{{props.basis.label}}</label>
						<div class="uk-width-6-10">
							<div class="uk-align-right"><number :value.sync="props.basis.value" :min="0" :max="100" :step="1" :suffix="false" :prefix="false"></number></div>
						</div>
					</div>
				</div>
			</tree>
			<label><input type="radio" :value="'inherit'" v-model="props.override.value"> Inherit</label>
		</div>
	</div>
</div>
</template>

<script>
/** JSON Data **/
import Flex from '../../data/flex.json';

/* Number spinner */
import Number from '../number.vue'

/* Switcher */
import Switch from '../switch.vue'

/* Info, little help button */
import Info from '../info.vue'

/* Tree View */
import Tree from '../tree.vue'

export default {
	name: 'propertiesFlex',
	components: {Number, Switch, Info, Tree},
	props: {
		name: {default: ''},
		label: {default: ''},
		info: {default: ''},
		props: {default: {}}
	},
	data() {
		return {
			Flex: Flex,
			unit: [
				{label: 'px', value: 'px'},
				{label: '%', value: '%'}
			]
		}
	}
}
</script>