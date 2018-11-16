import Vue from 'vue'
const state = {
  normal: []
}

const mutations = {
  removeNormal(state) {
    state.normal = []
  },
  saveNormal(state, normal) {
    state.normal = normal.map(v => {
      if (v.type !== 1) {
        return {
          ...v,
          current: 0,
          answers: v.answers.map(a => ({
            ...a,
            active: v.type === 2 ? false : []
          }))
        }
      }
      return v
    })
  }
}

const actions = {
  async getNormal({ commit }, params = {}) {
    const normal = await Vue.iBox.httpAuth('getQuestionNormal', params)({
      method: 'get'
    })
    commit('saveNormal', normal)
  },
  estimate({ commit }, params = {}) {
    console.log('???')
    return Vue.iBox.httpAuth('estimate', params)(
      { method: 'post' },
      { isLoading: false }
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
