<template>
  <div class="saturation" 
    :style="{background: bgColor}"
    v-el:container
    @mousedown="handleMouseDown">
    <div class="white"></div>
    <div class="black"></div>
    <div class="pointer" :style="{top: pointerTop, left: pointerLeft}">
      <slot><div class="circle"></div></slot>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle'

export default {
  name: 'Saturation',
  props: {
    colors: Object,
    onChange: Function
  },
  computed: {
    bgColor () {
      return 'hsl(' + this.colors.hsl.h + ',100%, 50%)'
    },
    pointerTop () {
      return -(this.colors.hsv.v * 100) + 100 + '%'
    },
    pointerLeft () {
      return this.colors.hsv.s * 100 + '%'
    }
  },
  methods: {
    throttle: throttle((fn, data) => {
      fn(data)
    }, 50),
    handleChange (e, skip) {
      !skip && e.preventDefault()
      var container = this.$els.container
      var containerWidth = container.clientWidth
      var containerHeight = container.clientHeight
      var left = (e.pageX || e.touches[0].pageX) - (container.getBoundingClientRect().left + window.pageXOffset)
      var top = (e.pageY || e.touches[0].pageY) - (container.getBoundingClientRect().top + window.pageYOffset)

      if (left < 0) {
        left = 0
      } else if (left > containerWidth) {
        left = containerWidth
      } else if (top < 0) {
        top = 0
      } else if (top > containerHeight) {
        top = containerHeight
      }

      var saturation = left * 100 / containerWidth
      var bright = -(top * 100 / containerHeight) + 100

      this.throttle(this.onChange, {
        h: this.colors.hsl.h,
        s: saturation,
        v: bright,
        a: this.colors.hsl.a,
        source: 'rgb'
      })
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
@color0: #ffffff; // Appears 2 times

.white {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.black {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.saturation {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  .white {
    background: linear-gradient(to right, @color0, rgba(255,255,255,0));
  }
  .black {
    background: linear-gradient(to top, #000000, rgba(0,0,0,0));
  }
  .pointer {
    position: absolute;
  }
  .circle {
    border-radius: 50%;
    box-shadow: 0 0 0 1.5px @color0, inset 0 0 1px 1px rgba(0,0,0,0.3), 0 0 1px 2px rgba(0,0,0,0.4);
    cursor: head;
    height: 4px;
    transform: translate(-2px, -2px);
    width: 4px;
  }
}
</style>