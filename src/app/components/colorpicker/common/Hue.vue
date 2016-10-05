<template>
  <div class="c-hue {{direction}}">
    <div class="container" v-el:container
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange">
      <div class="pointer" :style="{top: pointerTop, left: pointerLeft}">
        <slot><div class="picker"></div></slot>
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hue',
  props: {
    colors: Object,
    onChange: Function,
    direction: {
      type: String,
      // [horizontal | vertical]
      default: 'horizontal'
    }
  },
  computed: {
    pointerTop () {
      if (this.direction === 'vertical') {
        return -((this.colors.hsl.h * 100) / 360) + 100 + '%'
      } else {
        return 0
      }
    },
    pointerLeft () {
      if (this.direction === 'vertical') {
        return 0
      } else {
        return (this.colors.hsl.h * 100) / 360 + '%'
      }
    }
  },
  methods: {
    handleChange (e, skip) {
      !skip && e.preventDefault()

      var container = this.$els.container
      var containerWidth = container.clientWidth
      var containerHeight = container.clientHeight
      var left = (e.pageX || e.touches[0].pageX) - (container.getBoundingClientRect().left + window.pageXOffset)
      var top = (e.pageY || e.touches[0].pageY) - (container.getBoundingClientRect().top + window.pageYOffset)
      var h
      var percent

      if (this.direction === 'vertical') {
        if (top < 0) {
          h = 359
        } else if (top > containerHeight) {
          h = 0
        } else {
          percent = -(top * 100 / containerHeight) + 100
          h = (360 * percent / 100)
        }

        if (this.colors.hsl.h !== h) {
          this.onChange({
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          })
        }
      } else {
        if (left < 0) {
          h = 0
        } else if (left > containerWidth) {
          h = 359
        } else {
          percent = left * 100 / containerWidth
          h = (360 * percent / 100)
        }

        if (this.colors.hsl.h !== h) {
          this.onChange({
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          })
        }
      }
    },
    handleMouseDown (e) {
      this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp (e) {
      this.unbindEventListeners()
    },
    unbindEventListeners () {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>

<style lang="less">
// Color variables (appears count calculates by raw css)
@color0: #ff0000; // Appears 4 times
@color1: #0000ff; // Appears 2 times
@color2: #ff00ff; // Appears 2 times
@color3: #00ffff;
@color4: #00ff00;
@color5: #ffff00;

.c-hue {
  border-radius: 2px;
  bottom: 0px;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0px;
  .container {
    height: 100%;
    margin: 0 2px;
    position: relative;
  }
  .pointer {
    position: absolute;
    z-index: 2;
  }
  .picker {
    background: #ffffff;
    border-radius: 1px;
    box-shadow: 0 0 2px rgba(0,0,0,0.6);
    height: 8px;
    margin-top: 1px;
    transform: translateX(-2px);
    width: 4px;
  }
}
.c-hue.horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}

.c-hue.vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
</style>