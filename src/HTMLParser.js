class HTMLParser {
  constructor () {
    this.output = ''
  }

  parse (tree) {
    return new Promise(resolve => {
      const walk = this.walk(tree, 0)
      let it = walk.next()

      while (!it.done) {
        it = walk.next()
      }

      resolve(this.output)
    })
  }

  * walk (tree, level) {
    if (!tree) return

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      this.output += `\n${'  '.repeat(level)}${this.parseNode(node)}`

      if (node.childNodes.length > 0) {
        yield * this.walk(node.childNodes, level + 1)
      }
    }
  }

  parseNode (node) {
    const {nodeType} = node

    switch (nodeType) {
      case 10: return `doctype html`
      case 8: return `//${node.textContent}`
      case 3: return `| ${node.textContent}`
    }

    if (node.nodeName) {
      return this.setAttributes(node)
    }

    return node
  }

  setAttributes (node) {
    let output = node.nodeName.toLowerCase()
    let attributes = []

    if (node.id) {
      output += `#${node.id}`
    }

    if (node.classList.length > 0) {
      for (let i = 0; i <= node.classList.length; i++) {
        output += `.${node.classList[i]}`
      }
    }

    for (let i in node.attributes) {
      let {localName, value} = node.attributes[i]
      if (localName && (localName !== 'id' && localName !== 'class')) {
        attributes.push(`${localName}='${value}'`)
      }
    }

    if (attributes.length > 0) {
      output += `(${attributes.join(', ')})`
    }

    return output
  }
}

export default HTMLParser
