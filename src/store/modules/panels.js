import {Panels} from '../../const'
import * as mutation from '../mutation-types'

const state = {
  hoverStatus: '',
  searchComponent: '',
  leftPanelNav: {},
  advancedPanels: {},
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
    for (let panelName in state.leftPanelNav) {
      state.leftPanelNav[panelName].open = false
    }
  },

  /**
   * When users click left panel nav
   */
  [mutation.SHOW_LEFT_PANEL] (state, id) {
    const panel = state.leftPanelNav[id]
    const toggleOpen = !panel.defaultNav && panel.active

    if (toggleOpen) {
      for (let _id in state.leftPanelNav) {
        if (state.leftPanelNav[_id].defaultNav) {
          id = _id
        }
      }
    }

    state.openLeftPanel = id

    for (let _id in state.leftPanelNav) {
      if (_id === id) {
        state.leftPanelNav[_id].active = true
        if (!toggleOpen) {
          state.leftPanelNav[_id].open = !state.leftPanelNav[_id].open
        }
        if (!state.leftPanelNav[_id].initiated) {
          state.leftPanelNav[_id].initiated = true
        }
      } else {
        state.leftPanelNav[_id].active = false
        state.leftPanelNav[_id].open = false
      }
    }
  },

  /**
   * Search component on left panel
   */
  [mutation.SEARCH_COMPONENT] (state, value) {
    state.searchComponent = value
  },

  /**
   * Register advanced panels whether open or not
   */
  [mutation.REGISTER_LEFT_PANEL_NAV] (state, {id, settings}) {
    state.leftPanelNav[id] = settings
    if (settings.active) {
      state.openLeftPanel = id
    }
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
    commit(mutation.SEARCH_COMPONENT, value)
  },

  /**
   * Register left panel navigation
   * @param {Function} options.commit
   * @param {String} id
   * @return {void}
   */
  registerLeftPanel ({commit}, payload) {
    commit(mutation.REGISTER_LEFT_PANEL_NAV, payload)
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
   * Left panel navigation object
   * @type {Object}
   */
  leftPanelNav: state => state.leftPanelNav,

  /**
   * Components init status
   * @type {Boolean}
   */
  defaultPanel: state => {
    let defaultPanel

    for (let i in state.leftPanelNav) {
      if (state.leftPanelNav[i].defaultNav) {
        defaultPanel = state.leftPanelNav[i]
      }
    }

    return defaultPanel
  },

  /**
   * Advanced panel list
   * @type {Object}
   */
  advancedPanels: state => state.advancedPanels,

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
