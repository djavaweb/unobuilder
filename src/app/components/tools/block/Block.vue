<template lang="pug">
// Blocks
a.add-block(
:style="buttonPosition",
@click="toggle()"
)

.canvas-block(
:style="blockPosition",
:class="{active: showBlock, 'canvas-block--animation': animation}"
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

<script>
export default {
	name: 'block',
	data () {
		return {
			position: -1000,
			insertAt: null,
			showBlock: false,
			animation: true,
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
		/**
		 * Check current selected tab
		 * @param  {String} tab
		 * @return {Boolean}
		 */
		isTab (tab) {
			return  this.selectedTab === tab
		},

		/**
		 * Change selected tab
		 * @param  {String} tab
		 * @return {void}
		 */
		showTab (tab) {
			this.selectedTab = tab
		},

		/**
		 * Add block to canvas
		 * @param {void}
		 */
		addBlock (block) {
			this.hide(true)
			this.$root.canvasBuilder().layout().addBlock(block, this.insertAt)
		},

		/**
		 * Toggle block container
		 * @return {void}
		 */
		toggle () {
			this.$root.canvasBuilder('contextMenu').hide()
			if (!this.showBlock) {
				this.animation = true
			}
			this.showBlock = !this.showBlock
		},

		/**
		 * Show block
		 * @return {void}
		 */
		show () {
			this.animation = true
			this.showBlock = true
		},

		/**
		 * Hide block
		 * @param {Boolean} forceHide
		 * @return {void}
		 */
		hide (forceHide = false) {
			if (forceHide) {
				this.animation = false
			}
			this.showBlock = false
		}
	}
}
</script>
