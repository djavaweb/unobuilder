<template>
<div class="block-item section only" @click="add('section')"></div>
<div class="block-item section with-container" @click="add('container')"></div>
</template>

<script>
export default {
	name: 'structure',
	props: {
		index: {
			default: 0
		}
	},

	methods: {
		/**
		 * Dispatch event to Parent, Add section block
		 *
		 * @param {String} type [Section type]
		 */
		add (type) {
			let accept = 'section'
			if (type === 'section') {
				accept = 'body,section'
			}

			this.$dispatch('addBlock', {
				append: 'body',
				tag: 'section',
				type: 'section',
				child: false,
				kind: type,
				accept: accept
			})
		}
	}
}
</script>
