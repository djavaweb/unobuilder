import {Panels} from '../../const'
import * as mutation from '../mutation-types'

const state = {
  hoverStatus: '',
  searchComponents: '',
  leftPanelNav: {},
  advancedPanels: {},
  toggleLeftPanel: false,
  openLeftPanel: '',
  openInputPanel: '',
  blocks: {}
}

const mutations = {
  /**
   * Track where is users mouse hovering at
   */
  [mutation.SET_HOVER_STATUS] (state, status) {
    state.hoverStatus = status
  },

  /**
   * Hide left panels
   */
  [mutation.HIDE_LEFT_PANELS] (state) {
    state.toggleLeftPanel = false
  },

  /**
   * When users click left panel nav
   */
  [mutation.SHOW_LEFT_PANEL] (state, id) {
    if (state.openLeftPanel !== id) {
      state.toggleLeftPanel = true
    } else {
      state.toggleLeftPanel = !state.toggleLeftPanel
    }

    state.openLeftPanel = id
  },

  /**
   * Search component on left panel
   */
  [mutation.FIND_COMPONENT] (state, value) {
    state.searchComponents = value
  },

  /**
   * Register advanced panels whether open or not
   */
  [mutation.REGISTER_ADVANCED_PANEL] (state, {id, value}) {
    if (value !== undefined) {
      state.advancedPanels[id] = value
    }
  },

  /**
   * Toggle Advanced Panel on right sidebar
   */
  [mutation.TOGGLE_ADVANCED_PANEL] (state, id) {
    state.advancedPanels[id] = !state.advancedPanels[id]
  },

  /**
   * Toggle unit selector
   */
  [mutation.TOGGLE_INPUT_PANEL] (state, id) {
    id = state.openInputPanel === id ? '' : id
    state.openInputPanel = id
  }
}

const actions = {
  /**
   * Hover left panel
   */
  hoverLeftPanel ({commit}) {
    commit(mutation.SET_HOVER_STATUS, Panels.LEFT)
  },

  /**
   * Hover right sidebar
   */
  hoverRightPanel ({commit}) {
    commit(mutation.SET_HOVER_STATUS, Panels.RIGHT)
  },

  /**
   * Hover workspace
   */
  hoverCenterPanel ({commit}) {
    commit(mutation.SET_HOVER_STATUS, Panels.CENTER)
  },

  /**
   * Hide left panels
   * @param  {Object}
   * @return {void}
   */
  hideLeftPanels ({commit}) {
    commit(mutation.HIDE_LEFT_PANELS)
  },

  /**
   * When users click left panel nav
   * @param  {Object} options.state
   * @param  {Function} options.commit
   * @param  {String} id
   * @return {void}
   */
  showLeftPanel ({state, commit}, id) {
    commit(mutation.SHOW_LEFT_PANEL, id)
  },

  /**
   * When users search component on left panel
   * @param  {Function} options.commit
   * @param  {String} value
   * @return {void}
   */
  findComponent ({commit}, value) {
    commit(mutation.FIND_COMPONENT, value)
  },

  /**
   * Register advanced panels
   * @param {Function} options.commit
   * @param {Object} options
   * @return {void}
   */
  registerAdvancedPanel ({commit}, options) {
    commit(mutation.REGISTER_ADVANCED_PANEL, options)
  },

  /**
   * Toggle advanced panel in right panel
   * @param  {Function} {commit}
   */
  toggleAdvancedPanel ({commit}, propName) {
    commit(mutation.TOGGLE_ADVANCED_PANEL, propName)
  },

  toggleInputPanel ({commit}, id) {
    commit(mutation.TOGGLE_INPUT_PANEL, id)
  }
}

const getters = {
  /**
   * Advanced panel list
   * @type {Object}
   */
  advancedPanels: state => state.advancedPanels,
  searchComponents: state => state.searchComponents,
  toggleLeftPanel: state => state.toggleLeftPanel,
  openLeftPanel: state => state.openLeftPanel,

  /**
   * Current opened input panel
   * @type {Object}
   */
  openInputPanel: state => state.openInputPanel
}

export default {
  state,
  actions,
  getters,
  mutations
}
