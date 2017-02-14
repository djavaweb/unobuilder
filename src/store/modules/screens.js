import {ScreenType, Labels, ClassPrefix} from '../../const'
import * as mutation from '../mutation-types'

const previewClass = [
  `avoid-right-bar`,
  `avoid-left-bar`
]

const state = {
  screenSize: ScreenType.LARGE,
  previewMode: true,
  screenLoader: true,
  loaderMessage: Labels.LOADING
}

const mutations = {
  /**
   * Change Screen Size
   */
  [mutation.TOGGLE_PREVIEW] (state) {
    state.previewMode = !state.previewMode

    const {documentElement: htmlTag} = document
    htmlTag.className = `${ClassPrefix.MAIN}--avoid-top-bar`

    previewClass.forEach(item => {
      const className = `${ClassPrefix.MAIN}--${item}`
      if (state.previewMode) {
        htmlTag.classList.remove(className)
      } else {
        htmlTag.classList.add(className)
      }
    })
  },

  /**
   * Change Screen Size
   */
  [mutation.SET_SCREEN_SIZE] (state, size) {
    state.screenSize = size
  },

  /**
   * Set loader message
   */
  [mutation.SET_LOADER_MESSAGE] (state, message) {
    state.loaderMessage = message
  },

  /**
   * Toggle loader
   */
  [mutation.TOGGLE_LOADER] (state, toggle) {
    state.screenLoader = !toggle ? !state.screenLoader : toggle
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
  togglePreview ({commit, getters}) {
    commit(mutation.TOGGLE_PREVIEW)
  },

  /**
   * Toggle loader screen
   * @param {Function} commit
   * @return void
   */
  toggleLoader ({commit}, toggle) {
    commit(mutation.TOGGLE_LOADER, toggle)
  },

  /**
   * Set loader message
   * @param {Function} commit
   * @return void
   */
  setLoaderMessage ({commit}, message) {
    commit(mutation.SET_LOADER_MESSAGE, message)
  },

  /**
   * Show loader screen
   */
  showLoaderMessage ({commit}, message) {
    commit(mutation.SET_LOADER_MESSAGE, message)
    commit(mutation.TOGGLE_LOADER, true)
  },

  /**
   * Hide loader screen
   */
  hideLoaderMessage ({commit}, message) {
    commit(mutation.TOGGLE_LOADER, false)
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
  previewMode: state => state.previewMode,

  /**
   * Loader state
   */
  screenLoader: state => state.screenLoader,

  /**
   * Loader Message
   * @type {Boolean}
   */
  loaderMessage: state => state.loaderMessage
}

export default {
  state,
  actions,
  getters,
  mutations
}
