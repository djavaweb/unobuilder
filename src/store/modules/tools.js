import {ScreenType, Labels, ClassPrefix} from '../../const'
import * as mutation from '../mutation-types'

const previewClass = [
  `avoid-right-bar`,
  `avoid-left-bar`
]

const state = {
  screenSize: ScreenType.LARGE,
  canvasLoaded: false,
  canvasScroll: {},
  previewMode: false,
  screenLoader: true,
  loaderMessage: Labels.LOADING
}

const mutations = {
  /**
   * Toggle preview mode
   */
  [mutation.TOGGLE_PREVIEW] (state, toggle) {
    toggle = typeof toggle === 'undefined' ? !state.previewMode : toggle
    state.previewMode = toggle

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
  },

  /**
   * Init canvas iframe
   */
  [mutation.SET_INITIATED_CANVAS] (state) {
    state.canvasLoaded = true
  },

  /**
   * Set canvas scroll value
   */
  [mutation.SET_CANVAS_SCROLL] (state, scrollValue) {
    state.canvasScroll = scrollValue
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
  togglePreview ({commit}) {
    commit(mutation.TOGGLE_PREVIEW)
  },

  /**
   * Show Preview
   * @param  {[type]} {commit} [description]
   * @return {[type]}          [description]
   */
  showPreview ({commit}) {
    commit(mutation.TOGGLE_PREVIEW, true)
  },

  /**
   * Hide Preview
   * @param  {[type]} {commit} [description]
   * @return {[type]}          [description]
   */
  hidePreview ({commit}) {
    commit(mutation.TOGGLE_PREVIEW, false)
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
  },

  /**
   * Notify that canvas already loaded
   */
  canvasReady ({commit}) {
    commit(mutation.SET_INITIATED_CANVAS)
  },

  /**
   * Set canvas scroll bounds top
   */
  setCanvasScroll ({commit}, scrollValue) {
    commit(mutation.SET_CANVAS_SCROLL, scrollValue)
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
  loaderMessage: state => state.loaderMessage,

  /**
   * Canvas status
   * @type {Boolean}
   */
  canvasLoaded: state => state.canvasLoaded,

  canvasScroll: state => state.canvasScroll
}

export default {
  state,
  actions,
  getters,
  mutations
}
