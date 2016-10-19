<template lang="pug">
.canvas-contextmenu(v-show="display", :style="position")
	ul.cm(v-el:list, @contextmenu.capture="noop($event)")
		li(v-for="menu in menus")
			span.cm-delimiter(v-if="menu.delimiter")
			a(
			v-else
			@click="click(menu.click)",
			@mouseover="over(menu.over)"
			@mouseleave="leave(menu.leave)"
			)
				span.cm-label {{menu.label}}
				span.cm-shortcut {{{menu.shortcut}}}
</template>

<script>
export default {
	name: 'contextMenu',
	data () {
		return {
			display: false,
			position: {left: '0px', top: '0px'},
			menus: [
				{
					label: 'Copy',
					shortcut: '&#8984;+c',
					click: 'copy'
				},

				{
					label: 'Paste',
					shortcut: '&#8984;+v',
					click: 'paste'
				},

				{
					label: 'Delete',
					shortcut: 'del',
					click: 'remove',
					over: 'remove',
					leave: 'remove'
				},

				{
					delimiter: true
				},

				{
					label: 'Copy Style',
					shortcut: '&#8984;+&#8679;+c',
					click: 'copyStyle'
				},

				{
					label: 'Paste Style',
					shortcut: '&#8984;+&#8679;+c',
					click: 'pasteStyle'
				},

				{
					label: 'Clear Style',
					shortcut: '&#8679;+del',
					click: 'clearStyle'
				}
			]
		}
	},

	methods: {
		setPosition (position) {
			// Get gutter between canvas and iframe
			let canvasBuilder = this.$root.canvasBuilder(),
			viewerWidth = canvasBuilder.viewerSize('width'),
			viewerHeight = canvasBuilder.viewerSize('height'),
			gutter = canvasBuilder.offset('width') - viewerWidth,
			height = this.$els.list.offsetHeight,
			leftOrRight, topOrBottom,
			stylePosition = {}

			// Get top and left position
			let x = position.x,
			y = position.y

			// Set left position
			if (viewerWidth - position.x < 200) {
				stylePosition.right = `${viewerWidth - x}px`
			} else {
				stylePosition.left = `${x}px`
			}

			// Set top position
			if (viewerHeight - position.y < height) {
				stylePosition.top = `${y - height}px`
			} else {
				stylePosition.top = `${y}px`
			}

			// Here we go!
			this.display = true
			this.position = stylePosition
		},

		hide () {
			this.display = false
		},

		noop (event) {
			event && event.preventDefault()
		},

		click (command) {
			let selector = this.$root.elementSelector()

			switch (command) {
				case 'copy':
					selector.copyElement(true)
				break

				case 'paste':
					selector.pasteElement()
				break

				case 'remove':
					selector.removeElement()
				break
			}

			this.hide()
		},

		over (command) {
			switch (command) {
				case 'remove':
					this.$root.elementSelector().removeOver()
				break
			}
		},

		leave (command) {
			switch (command) {
				case 'remove':
					this.$root.elementSelector().removeLeave()
				break
			}
		}
	}
}
</script>
