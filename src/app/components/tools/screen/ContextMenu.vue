<template lang="pug">
.canvas-contextmenu(v-show="display", :style="position")
	ul.cm(v-el:list, @contextmenu.capture="noop($event)")
		li(v-for="menu in menus")
			span.cm-delimiter(v-if="menu.delimiter")
			a(
			v-if="shouldDisplay(menu)",
			@click="click(menu.click)",
			@mouseover="over(menu.over)"
			@mouseleave="leave(menu.leave)"
			)
				span.cm-label {{menu.label}}
				span.cm-shortcut {{{menu.shortcut}}}
</template>

<script>
import _find from 'lodash/find'
export default {
	name: 'contextMenu',
	data () {
		return {
			display: false,
			position: {left: '0px', top: '0px'},
			menus: [
				{
					id: 'cut',
					label: 'Cut',
					shortcut: '&#8984;+x',
					click: 'cut',
					display: true
				},

				{
					id: 'cancel-cut',
					label: 'Cut: Cancel',
					shortcut: '&#8984;+esc',
					click: 'cancelCut',
					display: false
				},

				{
					id: 'copy',
					label: 'Copy',
					shortcut: '&#8984;+c',
					click: 'copy',
					display: true
				},

				{
					id: 'paste',
					label: 'Paste',
					shortcut: '&#8984;+v',
					click: 'paste',
					display: true
				},

				{
					id: 'delete',
					label: 'Delete',
					shortcut: 'del',
					click: 'remove',
					over: 'remove',
					leave: 'remove',
					display: true
				},

				{
					delimiter: true
				},

				{
					id: 'copy-style',
					label: 'Copy Style',
					shortcut: '&#8984;+&#8679;+c',
					click: 'copyStyle',
					display: true
				},

				{
					id: 'paste-style',
					label: 'Paste Style',
					shortcut: '&#8984;+&#8679;+c',
					click: 'pasteStyle',
					display: true
				},

				{
					id: 'clear-style',
					label: 'Clear Style',
					shortcut: '&#8679;+del',
					click: 'clearStyle',
					display: true
				}
			]
		}
	},

	methods: {
		shouldDisplay (menu) {
			return ! menu.delimiter && menu.display
		},

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

		cancelCut () {
			let cut = _find(this.menus, {id: 'cut'}),
			cancelCut = _find(this.menus, {id: 'cancel-cut'})

			cut.display = true
			cancelCut.display = false
		},

		click (command) {
			let selector = this.$root.elementSelector()

			switch (command) {
				case 'cut':
					let cut = _find(this.menus, {id: 'cut'}),
					cancelCut = _find(this.menus, {id: 'cancel-cut'})

					selector.cutElement()
					cut.display = false
					cancelCut.display = true
				break

				case 'cancelCut':
					this.cancelCut()
				break

				case 'copy':
					selector.copyElement(true)
					this.cancelCut()
				break

				case 'paste':
					selector.pasteElement()
					this.cancelCut()
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
