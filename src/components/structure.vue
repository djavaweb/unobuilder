<template>
<div class="draggable structure" data-width="{{joinWidth()}}">
	<div class="uk-grid uk-grid-small">
		<div v-for="item in width" class="uk-width-{{item}}" track-by="$index">
			<div class="uk-panel uk-panel-space uk-panel-box">{{dividedWidth($index)}}</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "Structure",
	props: ['width'],
	methods: {
		joinWidth () {
			return this.width.join(',')
		},
		dividedWidth (index) {
			let width = this.width[index]
			return width
		}
	}
}
</script>

<style lang="less">
@import "../css/vars.less";

.structure {
	display: block;
	background: @warm-grey-six;
	padding: 10px;
	margin-bottom: 15px;

	&:hover {
		border-color: #ffffff;
	    box-shadow: 0 4px 15px 1px rgba(0, 0, 0, 0.3);
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
		padding: 5px;
		margin: 0;
		background: @white;
		display: block;
		position: relative;
		border: none;
		text-align: center;
		font-size: 12px;
		font-weight: bold;
	}

	.uk-grid-small {
		margin-left: -6px;
		> * {
			padding-left: 6px;
		}
	}
}
</style>