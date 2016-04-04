<template>
<div class="parent element-text-editor" :class="[class, selectedClass]">
	<div :style="[styles]" :class="[class, classStyle]">
		<div class="editable" :class="[class, itemClass]"></div>
	</div>
</div>
</template>

<style lang="less">
@import "../../../node_modules/medium-editor/dist/css/medium-editor.min.css";
@import "../../css/editor.less";
.element-text-editor {
	.editable:focus {
		outline: none !important;
	}
}
</style>

<script>
import MediumEditor from "medium-editor"
export default {
	name: 'Text',
	props: {
		class: {default: ''},
		selected: {default: false},
		styles: {default: ''},
		data: {default: {}}
	},
	data () {
		return {
			editor: {}
		}
	},
	computed: {
		selectedClass: {
			get () {
				return (this.selected)? 'selected': ''
			}
		},
		classStyle: {
			get () {
				return this.class + '-style'
			}
		},
		itemClass: {
			get() {
				return this.class + '-child'
			}
		},
	},
	ready () {
		let self = this
		self.editor = new MediumEditor(self.$el.querySelector('.editable'), {
			spellcheck: false,
			buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'justifyCenter'],
			paste: {
				cleanPastedHTML: true,
				cleanAttrs: ['class'],
				forcePlainText: false
			}
		});
		self.editor.setContent(self.data.value)
		self.editor.subscribe('editableInput', function (event, editable) {
			let html = editable.innerHTML.replace('<!--v-html-->', '')
			self.$set('data.value', html)
		})
	}
}
</script>