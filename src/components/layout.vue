<template>
<div class="uk-grid uk-grid-collapse">
	<div class="uk-width-7-10">
		<div id="layout">
			<div class="layout-item uk-flex uk-flex-wrap uk-flex-wrap-space-between uk-grid-match" v-for="element in $parent.elements" track-by="$index" @hover="inspectHover" data-uk-grid-match>
				<div class="uk-width-{{container}} uk-grid-match" v-for="container in element.containers" track-by="$index">
					<empty v-if="empty(element.items)"></empty>
				</div>
				<drop v-if="!empty(element.containers)"></drop>
			</div>
			<drop></drop>
		</div>
	</div>

	<div class="uk-width-3-10">
		<ul id="toolbar-tab" class="uk-tab uk-tab-grid" data-uk-switcher="{connect:'#tab'}">
			<li class="uk-width-1-4"><a><i class="uk-icon-th"></i> Content</a></li>
			<li class="uk-width-1-4 uk-active"><a><i class="uk-icon-columns"></i> Structure</a></li>
			<li class="uk-width-1-4"><a><i class="uk-icon-wrench"></i> Body</a></li>
			<li class="uk-width-1-4"><a><i class="uk-icon-code"></i> Custom CSS</a></li>
		</ul>

		<ul id="tab" class="uk-switcher">
			<li class="tab-content">
				<div class="source contents uk-grid uk-grid-small">
					<content width="1-3" label="Text"></content>
					<content width="1-3" label="Image"></content>
					<content width="1-3" label="Button"></content>
				</div>
			</li>
			<li class="tab-content">
				<div class="source structures">
					<structure width="1-1"></structure>
					<structure width="5-5"></structure>
					<structure width="3-7"></structure>
					<structure width="7-3"></structure>
					<structure width="2-8"></structure>
					<structure width="8-2"></structure>
					<structure width="6-4"></structure>
					<structure width="4-6"></structure>
				</div>
			</li>
			<li class="tab-content">
				Body
			</li>
		</ul>
	</div>
</div>
</template>

<style lang="less">
@import "../css/uikit.min.css";
@import "../css/dragula.min.css";

@bluegray: #455A64;

body {
	padding: 10px 0;
	&.overflow-hidden {
		overflow: hidden;
	}
}

#app {
	color: @bluegray;
}

#toolbar-tab {
	margin-bottom: 10px;

	.uk-active {
		a {
			background-color: #F9F9F9;
			color: #516167;
			&:hover {
				background: #F9F9F9;
				color: #516167;
			}
		}
	}

	a {
		padding: 15px 5px;
		background: #D6D9DC;
		color: #93989A;
		margin: 0;
		border: none;
		font-size: 12px;
		font-weight: bold;
		&:hover {
			background: #c0c5c9;
			color: #505659;
		}
	}
}

#layout {
	padding: 10px 10px 50px;
	min-height: 200px;
	height: auto;
	position: relative;
}

.tab-content {
	padding: 5px
}

.source>div,.draggable.move {
	cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

.source>div:active,[draggable="true"] { 
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

.draggable {
	height: auto;
}

.draggable .item {
	border: 1px solid #cccccc;
}
.draggable .item:hover {
	box-shadow: 0 5px 12px 3px rgba(0, 0, 0, 0.2);
	border: none
}
.layout-item {
	border: 2px solid white;
	&:hover {
		border: 2px solid #3498db
	}
}
</style>

<script>
import Empty from './empty.vue';
import Drop from './drop.vue';

export default {
	name: 'Layout',
	data() {},
	components: {Empty, Drop},
	methods: {
		inspectHover: function () {
			this.$el.addClass()
		},
		empty: function (item) {
			return item.length === 0
		}
	}
}
</script>