<template>
<span class="info" data-balloon="{{text}}" data-balloon-pos="up"><i class="uk-icon-info"></i></span>
</template>

<style lang="less">
.info {
	border-radius: 100px;
    padding: 1px 5px;
    background: #4a4a4a;
    color: #ffffff;
    font-size: 10px;
    &:hover {
    	background: #3498db;
    }
}
</style>

<script>
export default {
	name: 'Info',
	props: {
		text: {default: ''}
	}
}
</script>