<template lang="pug">
// CSS editor
.code-editor-panel(v-if="activate")
	#css-editor(v-el:editor)
// End of CSS editor
</template>

<script>
import ace from 'brace'
import aceLanguageTools from 'brace/ext/language_tools'
import aceMode from 'brace/mode/css'
import aceTheme from 'brace/theme/monokai'

export default {
    name: 'cssEditor',
    data () {
        return {
            activate: false,
            editor: null
        }
    },

    events: {
        leftPanel (panel) {
            // Destroy css Editor
            // When left panel has been clicked
            if (this.editor !== null) {
                this.editor.destroy()
            }

            if (panel === 'cssEditor') {
                this.activate = true
                this.renderEditor()
            } else {
                this.activate = false
            }
        }
    },

    methods: {
        renderEditor () {
			// Setup Editor
			this.$nextTick(() => {
				// Set height of editor element like it's parent
				let editorElement = this.$els.editor
				editorElement.style.height = editorElement.parentElement.offsetHeight + 'px'

				// Init editor
				this.editor = ace.edit('css-editor')

				// Get custom css from canvas
				// if (this.canvas) {
				// 	editor.setValue(this.ref('canvasBuilder'))
				// }

				// Set custom css when any changes
				// this.editor.on('change', () => {
				// 	let value = this.editor.getValue()
				// 	if (this.canvas) {
				// 		this.canvas.$emit('saveCSS', value)
				// 	}
				// })

				// Editor options
				this.editor.$blockScrolling = Infinity
				this.editor.getSession().setMode('ace/mode/css')
				this.editor.setTheme('ace/theme/monokai')
				this.editor.setOptions({
					enableLiveAutocompletion: true,
					showPrintMargin: false
				})
			})
        }
    }
}
</script>
