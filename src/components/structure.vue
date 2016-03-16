<template>
<div class="draggable structure" data-width="{{width}}">
	<div class="uk-grid uk-grid-collapse">
		<div v-for="item in getWidth()" class="uk-width-{{item}}" track-by="$index">
			<div class="uk-panel uk-panel-space uk-panel-box"></div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "Structure",
	props: ['width'],
	methods: {
		getWidth: function () {
			let columns = this.width.split('-'), suffix = '10'
			if (columns[0] === columns[1] && columns[0] < 5) {
				columns = [columns[0]]
				suffix = columns[0]
			}
			columns = columns.map(item => item + '-' + suffix);
			return columns
		}
	}
}
</script>

<style lang="less">
.structure {
	display: block;
	background: #FFFFFF;
	border: 1px solid #DDDDDD;
	padding: 10px;
	margin-bottom: 15px;
	height: 42px;

	&.move {
		.uk-grid {
			display: none
		}
	}

	&:before {
		content: ' ';
		background: #E0E0E0;
	}

	.item {
		padding: 10px;
		background: #E0E0E0;
	}

	.uk-panel {
		padding: 10px;
		margin: 0;
		&:before {
			background: #D3D3D3;
			content: ' ';
			display: block;
			position: relative;
			height: 20px;
			border: 1px dashed #BEBEBE;
		}
	}
}
</style>