import * as Const from '@/const'

describe('src/const.js', () => {
  const MAIN_PREFIX = 'uno-builder'
  it('should exist', () => {
    expect(Const).to.exist
  })
  it('should not empty', () => {
    expect(Const).to.not.empty
  })
  /* MainPrefix */
  describe('MainPrefix', () => {
    it('should exist', () => {
      expect(Const.MainPrefix).to.exist
    })
    it('should not empty', () => {
      expect(Const.MainPrefix).to.not.empty
    })
    it('should have value ' + MAIN_PREFIX, () => {
      expect(Const.MainPrefix).to.equal(MAIN_PREFIX)
    })
  })
  /* ClassPrefix */
  describe('ClassPrefix', () => {
    it('should exist', () => {
      expect(Const.ClassPrefix).to.exist
    })
    it('should not empty', () => {
      expect(Const.ClassPrefix).to.not.empty
    })
  })
  /* NestedableRules */
  describe('NestedableRules', () => {
    it('should exist', () => {
      expect(Const.NestedableRules).to.exist
    })
    it('should not empty', () => {
      expect(Const.NestedableRules).to.not.empty
    })
    describe('div', () => {
      it('not contain (div, input)', () => {
        const div = Const.KindList.filter(item => !['div', 'input'].includes(item))
        expect(Const.NestedableRules.div).to.deep.equal(div)
      })
    })
  })
})
