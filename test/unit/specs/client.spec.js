import Uno from '@/client'

describe('* UnoBuilder => src/client.js', () => {
  it('UnoBuilder should exists', () => {
    expect(Uno).to.exists
  })
  it('uno should be an window object', () => {
    expect(window.uno).to.not.empty
  })
  describe('blocks', () => {
    it('should add and return as object', () => {
      Uno.addBlock('../../../example/blocks/section/block.js')
        .then(() => {
          let actual = Uno.getBlockItem('section')
          expect(actual).to.be.an('object')
        })
    })
  })
  describe('component', () => {
    const addedComponent = Uno.addComponent('../../../example/components/column-1/component.js')
    it('should add and return as object', () => {
        addedComponent.then(() => {
          let actual = Uno.getComponentItem('column-1')
          expect(actual).to.be.an('object')
        })
    })
    it('should get list and return as object', () => {
      let actual = Uno.getComponentList()
      addedComponent.then(() => {
        expect(Object.keys(actual)).to.have.length.above(0)
        expect(actual).to.be.an('object')
      })
    })
  })
  describe('event', () => {
    const expected = 'test123'
    let actual = ''
    Uno.on('test', val => actual = val)

    it('list must return be an object', () => {
      expect(Uno.events()).to.be.an('object')
    })
    it('should response when new event triggered', () => {
      Uno.emit('test', expected)
      expect(actual).to.equal(expected)
      actual = ''
    })
    it('should remove', () => {
      Uno.off('test')
      Uno.emit('test', expected)
      expect(actual).to.not.equal(expected)
    })
    it('should reset', () => {
      Uno.on('test', val => 1 + 0)
      Uno.on('test1', val => 1 + 1)
      Uno.on('test2', val => 1 + 2)
      expect(Uno.resetEvents()).to.deep.equal({})
    })
  })
})
