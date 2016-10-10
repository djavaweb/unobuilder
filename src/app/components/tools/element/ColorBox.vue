<template lang="pug">
div.color-box
    a(:style="colorStyle")
</template>

<style lang="sass">
.color-box {
    display: inline;
}
.color-box a {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    border: 1px solid #000000;
}
</style>

<script>
export default {
    name: 'colorBox',
    props: {
        color: {
            type: String,
            default: '#000000'
        }
    },
    computed: {
        colorStyle () {
            return {
                backgroundColor: this.color
            }
        }
    }
}
</script>
