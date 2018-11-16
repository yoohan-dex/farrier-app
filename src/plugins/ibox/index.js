// iBoxPlugin
import handleRequest from '@/store/flyio/request'
import requestWithAuth from '@/store/flyio/requestWithAuth'
import utils from './utils'

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$iBox.validator
   * 全局使用：Vue.iBox.validator
   */
  install(Vue) {
    const iBox = {
      ...utils,
      http: handleRequest,
      httpAuth: requestWithAuth
    }

    Vue.iBox = iBox
    Vue.prototype.$iBox = iBox
  }
}
