<template>
<div class="block-wrapper" @mouseleave="closeImmediately()" @mouseover="over()" :class="{active: isActive, child: child}">
	<a class="add-block" @click="toggle()" transition="fade"><i class="uk-icon-plus"></i></a>
	<div class="block-panel-wrapper">
		<div class="block-panel animated" v-if="show&&isActive" transition="appear">
			<ul>
				<li v-for="item in list">
					<a @click="showBlock(item.id)" :class="{selected: block === item.id}">{{item.label}}</a>
				</li>
			</ul>

			<div class="content" v-for="item in list" v-show="isBlock(item.id)">
				<structure v-if="item.id === 'structure'" :index="index"></structure>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import structure from './block/structure.vue'

export default {
	name: 'block',
	components: {structure},
	
	props: {
		child: {
			type: Boolean,
			default: false
		},

		index: {
			type: Number,
			default: 0
		}
	},

	data () {
		return {
			list: [
				{id: 'structure', label: 'Structure'},
				{id: 'headers', label: 'Headers'},
				{id: 'blog', label: 'Blog'},
				{id: 'features', label: 'Features'},
				{id: 'team', label: 'Team'},
				{id: 'gallery', label: 'Gallery'}
			],
			show: false,
			forceShow: true,
			isActive: false,
			block: 'structure'
		}
	},

	methods: {
		/**
		 * Smooth Scroll
		 * 
		 * @param  {Node} element
		 * @param  {Number} to       [Scroll value]
		 * @param  {Number} duration [In Duration]
		 * @return {void}
		 */
		scrollTo (element, to, duration) {
			if (duration < 0) return;
			let difference = to - element.scrollTop, perTick = difference / duration * 10;

			setTimeout(function() {
				element.scrollTop = element.scrollTop + perTick;
				if (element.scrollTop === to) return;
				scrollTo(element, to, duration - 10);
			}, 10);
		},

		/**
		 * Show/Hide Block Panel
		 * @return {void}
		 */
		toggle () {
			this.$set('show', !this.show)

			// Set layout iframe over outline selector
			this.$root.parent().$broadcast('elementHover', {
				display: 'none'
			})
			this.$root.parent().$broadcast('displayBlockPanel', this.show)
		},


		/**
		 * Show/Hide Block item
		 * @param  {String} name Block Name
		 * @return {void}
		 */
		showBlock (name) {
			this.$set('block', name)
		},


		/**
		 * Check current block
		 * @param  {String}  name Block Name
		 * @return {Boolean}
		 */
		isBlock (name) {
			return this.block === name
		},


		/**
		 * Close Block Panel Immediately if user mouse leave the wrapper
		 * @return {void}
		 */
		closeImmediately () {
			let self = this
			
			if (!this.child) {
				// Force close
				self.leave()

				// If show not forced to showing, close it
				setTimeout(function () {
					if (!self.forceShow || self.child) self.$set('show', false) 
				}, 1000)

			} else {
				// Hide
				self.$set('show', false) 
				self.$set('isActive', false)

				let blockPanel = self.$el.querySelector('.block-panel')
				setTimeout(function () {
					self.$root.parent().$broadcast('displayBlockPanel', false)
					if (blockPanel) blockPanel.remove()
				}, 200)
			}
		},


		/**
		 * On Mouse over event
		 * 
		 * @return {void}
		 */
		over () {
			this.$set('forceShow', true)
			this.$set('isActive', true)
			this.$root.parent().$broadcast('displayBlockPanel', true)
		},


		/**
		 * On Mouse leave event
		 *
		 * @param  {Boolean} hide [Force hide]
		 * @return {void}
		 */
		leave (hide) {
			this.$root.parent().$broadcast('displayBlockPanel', false)
			this.$set('forceShow', false)
			if (hide) this.$set('isActive', false)
			if (hide) this.$set('show', false)
		}
	},


	ready () {
		let self = this

		self.$on('addedBlock', function (data) {
			self.leave(true)
		})
	}
}
</script>