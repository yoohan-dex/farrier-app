import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

import IboxPlugin from '@/plugins/ibox'
Vue.use(IboxPlugin)

const app = new Vue({
  store,
  ...App
})

app.$mount()

export default {
  config: {
    pages: [],
    window: {
      navigationStyle: 'custom',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#A593E0',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
