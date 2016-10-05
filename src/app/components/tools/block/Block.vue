<template lang="pug">
// Blocks
a.add-block(
:style="buttonPosition",
@click="toggle()"
)

.canvas-block(
:style="blockPosition",
:class="{active: showBlock}"
)
	.canvas-block-wrapper
		ul
			li(v-for="tab in tabs")
				a(
				@click="showTab(tab.id)",
				:class="{selected: isTab(tab.id)}"
				) {{tab.label}}

		.block-items
			a.block-item(
			v-for="item in blocks",
			v-if="isTab(item.type)",
			:class="[item.kind]",
			transition="fade",
			@click="addBlock(item.structure)"
			)
// End of blocks
</template>

<style lang="sass">
@import "../../../scss/block.scss"
</style>

<script>
export default {
	name: 'block',
	data () {
		return {
			position: 0,
			showBlock: false,
			selectedTab: 'structure',
			tabs: [
				{id: 'structure', label: 'Structure'},
				{id: 'headers', label: 'Headers'},
				{id: 'blog', label: 'Blog'},
				{id: 'features', label: 'Features'},
				{id: 'team', label: 'Team'},
				{id: 'gallery', label: 'Gallery'}
			],
			blocks: [
				{
					type: 'structure',
					kind: 'section',
					structure: {
						tag: 'section',
						type: 'section',
						kind: 'section',
						append: 'body',
						dropable: 'body',
						resizable: {height: true}
					}
				},

				{
					type: 'structure',
					kind: 'container',
					structure: {
						tag: 'section',
						type: 'section',
						kind: 'section',
						append: 'body',
						dropable: 'body',
						resizable: {height: true},
						elements: [{
							tag: 'div',
							type: 'section',
							kind: 'container',
							dropable: 'body,section',
							wrapper: true,
							selectable: false,
							attrs: {
								class: 'uk-container uk-container-center'
							},
							elements: [{
								tag: 'div',
								type: 'child',
								kind: 'container'
							}]
						}]
					}
				}
			]
		}
	},

	computed: {
		buttonPosition () {
			let style = {}
			style.top = `${this.position}px`
			return style
		},

		blockPosition () {
			let style = {}
			style.top = `${this.position+30}px`
			return style
		}
	},

	methods: {
		isTab (tab) {
			return  this.selectedTab === tab
		},

		showTab (tab) {
			this.selectedTab = tab
		},

		addBlock (block) {
			let canvasBuilder = this.$root.ref('centerPanel.canvasBuilder')
			canvasBuilder.viewer().addBlock(block)
			this.hide()
		},

		toggle () {
			this.$root.ref('centerPanel.canvasBuilder.contextMenu').hide()
			this.showBlock = !this.showBlock
		},

		show () {
			this.showBlock = true
		},

		hide () {
			this.showBlock = false
		}
	}
}
</script>
