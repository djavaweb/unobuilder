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
/* Medium Editor */
import MediumEditor from "medium-editor"
import Rangy from "rangy"
import rangyClassApplier from "rangy/lib/rangy-classapplier.js"

Rangy.init()
let classApplier = Rangy.createClassApplier('font-size', {
	elementTagName: 'span',
	normalize: true,
	elementProperties: {
		fontSize: 14
	},
	elementAttributes: {
		style: 'font-size: 14px',
	}
});

/* Medium Editor Extensions */
var IncreaseFontSize = MediumEditor.extensions.button.extend({
	name: 'increaseFont',
	tagNames: ['span'],
	contentDefault: '<i class="uk-icon-plus"></i>',
	init: function () {
		MediumEditor.extensions.button.prototype.init.call(this);
	},
	handleClick: function (e) {
		if (classApplier) classApplier.undoToSelection()
		let fontSize = classApplier.elementProperties.fontSize
		if (fontSize) {
			fontSize++;
			classApplier.elementProperties.fontSize = fontSize
			classApplier.elementAttributes.style = 'font-size: ' + fontSize + 'px'
		}
		
		classApplier.applyToSelection();
		return;
	}
});

var DecreaseFontSize = MediumEditor.extensions.button.extend({
	name: 'decreaseFont',
	tagNames: ['span'],
	contentDefault: '<i class="uk-icon-minus"></i>',
	init: function () {
		MediumEditor.extensions.button.prototype.init.call(this);
	},
	handleClick: function (e) {
		if (classApplier) classApplier.undoToSelection()
		let fontSize = classApplier.elementProperties.fontSize
		if (fontSize) {
			fontSize--;
			classApplier.elementProperties.fontSize = fontSize
			classApplier.elementAttributes.style = 'font-size: ' + fontSize + 'px'
		}
		
		classApplier.applyToSelection();
		return;
	}
});


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
			extensions: {
				increaseFont: new IncreaseFontSize(),
				decreaseFont: new DecreaseFontSize()
			},
			toolbar: {
				buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'decreaseFont', 'increaseFont', {
					name: 'justifyLeft',
					action: function (html, mark) {
						document.execCommand('justifyLeft', false);
						return html;
					},
					aria: 'Align Left',
					contentDefault: '<i class="uk-icon-align-left"></i>',
				}, {
					name: 'justifyCenter',
					action: function (html, mark) {
						document.execCommand('justifyCenter', false);
						return html;
					},
					aria: 'Align Center',
					contentDefault: '<i class="uk-icon-align-center"></i>',
				}, {
					name: 'justifyRight',
					action: function (html, mark) {
						document.execCommand('justifyRight', false);
						return html;
					},
					aria: 'Align Right',
					contentDefault: '<i class="uk-icon-align-right"></i>',
				}, {
					name: 'justifyFull',
					action: function (html, mark) {
						document.execCommand('justifyFull', false);
						return html;
					},
					aria: 'Align Justify',
					contentDefault: '<i class="uk-icon-align-justify"></i>',
				}]
			},
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