<template>
<div class="accordion uk-accordion" id="panel-{{key}}-{{Id}}" data-uk-accordion v-for="(key, attr) in props">
	<div class="uk-accordion-title">{{attr.label}} <info :text="attr.help" v-if="attr.help"></info> <a class="uk-align-right"><i class="collapse"></i><i class="expand"></i></a> </div>
	<switch :value.sync="attr._.all" v-if="key==='padding'||key==='border'" style="position:absolute;top:1px;right:20px;"></switch>
	<div class="uk-accordion-content">
		<div class="properties">
			<div v-if="key==='margin'">
				<div class="label-blocks">
					<label><input type="radio" :value="'inherit'" v-model="attr._.type"> Inherited from <a href="#customizer">customizer</a></label>
					<label><input type="radio" :value="'custom'" v-model="attr._.type"> Custom</label>

					<tree v-show="attr._.type==='inherit'" transition="expand">
						<label><input type="radio" :value="15" v-model="attr._.tbValue"> Standard:15px</label>
						<label><input type="radio" :value="25" v-model="attr._.tbValue"> Larger:25px</label>
						<label><input type="radio" :value="10" v-model="attr._.tbValue"> Smaller:10px</label>

						<tree>
							<label class="block"><input type="checkbox" v-model="attr._.tb"> Margin top + bottom</label>
							<label class="block"><input type="checkbox" :disabled="attr._.tb" v-model="attr.include.t"> Margin top</label>
							<label class="block"><input type="checkbox" :disabled="attr._.tb" v-model="attr.include.b"> Margin bottom</label>
							<label class="block"><input type="checkbox" :disabled="attr._.tb" v-model="attr.include.l"> Margin left</label>
							<label class="block"><input type="checkbox" :disabled="attr._.tb" v-model="attr.include.r"> Margin right</label>
						</tree>
					</tree>

					<div style="margin-top: 5px;" v-show="attr._.type==='custom'" transition="expand">
						<div class="uk-grid uk-grid-collapse">
								<div class="uk-width-5-10">
									<number :enable="!attr._.all" :value.sync="attr._.allValue" label="All"></number>
								</div>
								<div class="uk-width-5-10">
									<switch :value.sync="attr._.all"></switch>
								</div>
							</div>

							<div v-show="attr._.all" transition="expand" style="margin-top: 5px;">
								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-5-10">
										<number :enable="attr._.all" :value.sync="attr.styles[0]" label="Top"></number>
									</div>
									<div class="uk-width-5-10">
										<number :enable="attr._.all" :value.sync="attr.styles[1]" label="Right"></number>
									</div>
								</div>

								<div class="uk-grid uk-grid-collapse">
									<div class="uk-width-5-10">
										<number :enable="attr._.all" :value.sync="attr.styles[3]" label="Left"></number>
									</div>
									<div class="uk-width-5-10">
										<number :enable="attr._.all" :value.sync="attr.styles[2]" label="Bottom"></number>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="key==='padding'">
				<div class="label-blocks">
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-6-10">
							<label>All Sides</label>
						</div>
						<div class="uk-width-4-10">
							<div class="uk-align-right"><number :enable="!attr._.all" :value.sync="attr._.allValue" :prefix="false" :suffix="false"></number></div>
						</div>
					</div>
					<div v-show="attr._.all" transition="expand" style="margin-top:5px">
						<div class="uk-grid uk-grid-collapse">
							<div class="uk-width-5-10">
								<number :enable="attr._.all" :value.sync="attr.styles[0]" label="Top"></number>
							</div>
							<div class="uk-width-5-10">
								<number :enable="attr._.all" :value.sync="attr.styles[1]" label="Right"></number>
							</div>
						</div>

						<div class="uk-grid uk-grid-collapse">
							<div class="uk-width-5-10">
								<number :enable="attr._.all" :value.sync="attr.styles[3]" label="Left"></number>
							</div>
							<div class="uk-width-5-10">
								<number :enable="attr._.all" :value.sync="attr.styles[2]" label="Bottom"></number>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="key==='border'">
				<div class="uk-grid uk-grid-collapse">
					<div class="uk-width-1-1">
						<number :enable="!attr._.all" :value.sync="attr._.allValue.width" :inline="true" label="All Sides"></number>
						<border-style :enable="!attr._.all" :value.sync="attr._.allValue.style"></border-style>
						<color-picker :enable="!attr._.all" :color.sync="attr._.allValue.color"></color-picker>
					</div>
				</div>

				<div v-show="attr._.all" transition="expand">
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-1-1">
							<number :enable="attr._.all" :value.sync="attr.styles.width[0]" :inline="true" label-width="40" label="Top"></number>
							<border-style :enable="attr._.all" :value.sync="attr.styles.style[0]"></border-style>
							<color-picker :enable="attr._.all" :color.sync="attr.styles.color[0]"></color-picker>
						</div>
					</div>
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-1-1">
							<number :enable="attr._.all" :value.sync="attr.styles.width[2]" :inline="true" label-width="40" label="Bottom"></number>
							<border-style :enable="attr._.all" :value.sync="attr.styles.style[2]"></border-style>
							<color-picker :enable="attr._.all" :color.sync="attr.styles.color[2]"></color-picker>
						</div>
					</div>
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-1-1">
							<number :enable="attr._.all" :value.sync="attr.styles.width[1]" :inline="true" label-width="40" label="Right"></number>
							<border-style :enable="attr._.all" :value.sync="attr.styles.style[1]"></border-style>
							<color-picker :enable="attr._.all" :color.sync="attr.styles.color[1]"></color-picker>
						</div>
					</div>
					<div class="uk-grid uk-grid-collapse">
						<div class="uk-width-1-1">
							<number :enable="attr._.all" :value.sync="attr.styles.width[3]" :inline="true" label-width="40" label="Left"></number>
							<border-style :enable="attr._.all" :value.sync="attr.styles.style[3]"></border-style>
							<color-picker :enable="attr._.all" :color.sync="attr.styles.color[3]"></color-picker>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
/* Switcher */
import Switch from '../switch.vue';

/* Border Style */
import borderStyle from '../border-style.vue';

/* Color Picker */
import colorPicker from '../color-picker.vue';

/* Dropable */
import Number from '../number.vue';

/* Info */
import Info from '../info.vue';

/* Tree View */
import Tree from '../tree.vue';

export default {
	name: 'propertiesLayout',
	components: {Switch, borderStyle, colorPicker, Number, Info, Tree},
	props: {
		name: {default: ''},
		props: {default: {}}
	},
	data () {
		return {Id: null, loaded: false}
	},
	ready() {
		let self = this

		self.$set('Id', self.$root.generateId(''))
		self.$watch('props', function (val) {
			if (val && !self.loaded) {
				for (let key in val) UIkit.accordion('#panel-'.concat(key, '-', self.Id));
				self.$set('loaded', true)
			}
		})
	}
}
</script>