import constants from './constants'
const SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID

export default {
  get() {
    return wx.getStorageSync(SESSION_KEY) || ''
  },

  set(session) {
    wx.setStorageSync(SESSION_KEY, session)
  },

  clear() {
    wx.removeStorageSync(SESSION_KEY)
  }
}
