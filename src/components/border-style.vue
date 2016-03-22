<template>
<select :disabled="!enable" class="select" v-model="value">
<option v-for="option in options" :value="option.value">{{option.label}}</option>
</select>
</template>

<style lang="less">
.select {
	height: 23px;
	outline: none;
	vertical-align: top
}
</style>

<script>
export default {
	name: 'borderStyle',
	props: ['enable', 'value'],
	data() {
		return {
			options: [
				{label: 'Solid', value: 'solid'},
				{label: 'Dot', value: 'dotted'},
				{label: 'Dash', value: 'dashed'},
				{label: 'Double', value: 'double'},
				{label: 'Groove', value: 'groove'},
				{label: 'Ridge', value: 'ridge'},
				{label: 'In', value: 'inset'},
				{label: 'Out', value: 'outset'}
			]
		}
	}
}
</script>