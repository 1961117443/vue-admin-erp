import request from '@/utils/request'

const getDefaultState = () => {
  return {
    moduleConfigs: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_MODULE_CONFIGS: (state, data) => {
    state.moduleConfigs[data.key] = data.data
  }
}

const actions = {
  // 获取模块配置信息
  getModuleConfigs({ commit, state }, tableName) {
    return new Promise((resolve, reject) => {
      if (state.moduleConfigs.hasOwnProperty(tableName)) {
        resolve(state.moduleConfigs[tableName])
      } else {
        request({
          url: `/api/ModuleConfigs/${tableName}`
        }).then(res => {
          commit('SET_MODULE_CONFIGS', { key: tableName, data: res.data })
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
