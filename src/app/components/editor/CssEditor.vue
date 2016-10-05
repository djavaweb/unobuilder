<template lang="pug">
// CSS editor
.code-editor-panel(v-if="activate")
	#css-editor(v-el:editor)
// End of CSS editor
</template>

<script>
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
				ace.require('ace/ext/language_tools')
				this.editor = ace.edit('css-editor')

				// Get custom css from canvas
				/*if (this.canvas) {
					editor.setValue(this.canvas.customCSS)
				}*/

				// Set custom css when any changes
				this.editor.on('change', () => {
					let value = this.editor.getValue()
					/*if (this.canvas) {
						this.canvas.$emit('saveCSS', value)
					}*/
				})

				// Editor options
				this.editor.$blockScrolling = Infinity
				this.editor.session.setMode('ace/mode/css')
				this.editor.setTheme('ace/theme/monokai')
				this.editor.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: true,
					showPrintMargin: false
				})
			})
        }
    }
}
</script>
