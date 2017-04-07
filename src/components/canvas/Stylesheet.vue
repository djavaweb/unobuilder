<script>
/* eslint-disable */
import { ScreenType, ScreenSize, MouseType } from '../../const'
import { CssPrefixer, valueFormatter } from '../../utils'

export default {
  name: 'stylesheet',
  props: {
    content: {
      type: String | Object
    }
  },
  methods: {
    contentStringify () {
      let content = {}
      let output = ''

      this.content.forEach(item => {
        let compiled = []
        const { breakpoint, selector, properties } = item
        for (let mouse in properties) {
          let props = []
          const styles = properties[mouse]

          for (let propName in styles) {
            const key = CssPrefixer(propName)
            const value = valueFormatter(styles[propName])
            props.push([key.kebab, value].join(':'))
          }

          if (props.length > 0) {
            let mouseEvent = ''
            if (mouse !== MouseType.NONE) {
              mouseEvent = `:${ mouse }`
            }

            compiled.push(`${ selector }${ mouseEvent }{ ${ props.join(';')  }}`)
          }
        }

        if (!(breakpoint in content)) {
          content[breakpoint] = []
        }

        if (compiled.length > 0) {
          content[breakpoint].push(compiled.join(''))
        }
      })

      for (let breakpoint in content) {
        let size = 0
        const raw = content[breakpoint]

        switch (breakpoint) {
          case ScreenType.MEDIUM:
            size = ScreenSize.MEDIUM
            break

          case ScreenType.SMALL:
            size = ScreenSize.SMALL
            break

          case ScreenType.TINY:
            size = ScreenSize.TINY
            break
        }

        if (raw.length > 0) {
          if (size > 0) {
            output += `@media (max-width: ${ size }px){ ${ raw  }}`
          } else {
            output += raw
          }
        }
      }

      return output
    }
  },
  render (h) {
    let cssString = this.content
    if (typeof cssString === 'object') {
      cssString = this.contentStringify()
    }
    return (
      <style scoped>{ cssString }</style>
    )
  }
}
</script>
