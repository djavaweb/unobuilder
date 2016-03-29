<template>
	<div class="uk-container-center uk-margin-large-top uk-margin-large-bottom" v-if="enable" :style="width">
		<div class="marvel-device" v-if="style==='iphone6' || style==='iphone4s'" :class="[style, skin, rotate]">
			<div class="top-bar"></div>
			<div class="sleep"></div>
			<div class="volume"></div>
			<div class="camera"></div>
			<div class="sensor"></div>
			<div class="speaker"></div>
			<div class="screen"><slot></slot></div>
			<div class="home"></div>
			<div class="bottom-bar"></div>
		</div>
		<div class="marvel-device" v-if="style==='ipad'" :class="[style, skin, rotate]">
			<div class="camera"></div>
			<div class="screen"><slot></slot></div>
			<div class="home"></div>
		</div>
	</div>
	<slot v-if="!enable"></slot>
</template>

<style lang="less">
@import "../css/devices.min.css";
.marvel-device.iphone6 .screen{
	z-index:500;
}
.screen {
	overflow-x: hidden;
	overflow-y: auto;
}
</style>

<script>
export default {
	name: "Device",
	props: {
		style: {default: 'iphone6'},
		skin: {default: 'silver'},
		rotate: {default: ''},
		enable: {default: false}
	},
	computed: {
		width() {
			let self = this, width = 425
			if (self.style === 'ipad') {
				width = (self.rotate === 'landscape')? 948: 626
			} else if (self.style === 'iphone4s') {
				width = 345
			}

			return {width: width + 'px'}
		}
	}
}
</script>