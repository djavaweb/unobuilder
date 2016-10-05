<template lang="pug">
div.screen-too-small(v-show="windowSize<951")
</template>

<script>
export default {
    name: 'screenDetector',
    data () {
        return {
            windowSize: 0
        }
    },

    methods: {
        /**
         * Get windows width
         * @return Number
         */
        windowWidth () {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        }
    },

    ready () {
        /**
         * Window resize observer, since we can't using this app with screen < 950, warning will appear
         * @return {void}
         */
		this.windowSize = this.windowWidth()
		window.addEventListener('resize', () => {
			this.windowSize = this.windowWidth()
		}, true)
    }
}
</script>
