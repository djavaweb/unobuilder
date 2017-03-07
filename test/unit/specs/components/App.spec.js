import Vue from 'vue'
import App from '@/components/App'

describe('App.vue', () => {
  let vm = new Vue(App).$mount()
  it('should exists', () => {
    expect(App).to.be.exists
  })
  it('has a created hook', () => {
    expect(App.created).to.be.a('function')
  })
  it('has a beforeMount hook', () => {
    expect(App.beforeMount).to.be.a('function')
  })
  it('has a render hook', () => {
    expect(App.render).to.be.a('function')
  })
  it('should render content', () => {
    expect(vm.$refs.ScreenLoader).to.be.exists
    expect(vm.$refs.ScreenDetector).to.be.exists
    expect(vm.$refs.TopPanel).to.be.exists
    expect(vm.$refs.LeftPanel).to.be.exists
    expect(vm.$refs.Workspace).to.be.exists
    expect(vm.$refs.RightPanel).to.be.exists
  })
})
