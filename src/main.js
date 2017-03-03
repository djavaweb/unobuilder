
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import Uno from './client.js'
import 'expose-loader?jQuery!jquery'
import 'expose-loader?UIKit!script-loader!uikit/js/uikit.min.js'

// Import styles
import '!style-loader!css-loader!assets/uikit/css/uikit.min.css'
import 'assets/scss/main.scss'

/* eslint-disable no-unused-vars */
import App from './components/App'

if (!window.uno) window.uno = Uno

// Vue config
Vue.config.debug = true

Uno.on('init', app => {
  /* eslint-disable no-new */
  new Vue({
    el: app.builder,
    store,
    render: h => <App ref="root" />
  })
})
