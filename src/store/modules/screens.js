import {ScreenType, ClassPrefix} from '../../const'
import * as mutation from '../mutation-types'

const previewClass = [
  `avoid-right-bar`,
  `avoid-left-bar`
]

const state = {
  screenSize: ScreenType.LARGE,
  previewMode: true
}

const mutations = {
  /**
   * Change Screen Size
   */
  [mutation.TOGGLE_PREVIEW] (state) {
    state.previewMode = !state.previewMode
    const {documentElement} = document

    documentElement.className = `${ClassPrefix.MAIN}--avoid-top-bar`

    previewClass.forEach(item => {
      const className = `${ClassPrefix.MAIN}--${item}`
      if (state.previewMode) {
        documentElement.classList.remove(className)
      } else {
        documentElement.classList.add(className)
      }
    })
  },

  /**
   * Change Screen Size
   */
  [mutation.SET_SCREEN_SIZE] (state, size) {
    state.screenSize = size
  }
}

const actions = {
  /**
   * Change screen size
   * @param  {Function} options.commit
   * @param  {String} size
   * @return {void}
   */
  changeScreenSize ({commit}, size) {
    commit(mutation.SET_SCREEN_SIZE, size)
  },

  /**
   * Toggle Preview
   * @param  {[type]} {commit} [description]
   * @return {[type]}          [description]
   */
  togglePreview ({commit, rootState}) {
    // const {leftPanelNav} = rootState.panels
    // leftPanelNav.component.initiated = false
    commit(mutation.TOGGLE_PREVIEW)
  }
}

const getters = {
  /**
   * Screen Size
   * @param  {Object} state
   * @return {String}
   */
  screenSize: state => state.screenSize,

  /**
   * Preview Mode
   * @type {Boolean}
   */
  previewMode: state => state.previewMode
}

export default {
  state,
  actions,
  getters,
  mutations
}
