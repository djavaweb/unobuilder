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
			let self = this,
			accept = (type === 'section')? 'body,section': 'section'

			self.$dispatch('addBlock', {
				to: 'body',
				type: 'section',
				child: false,
				kind: type,
				breadcrumb: type,
				accept: accept,
				index: self.index
			})
		}
	}
}
</script>