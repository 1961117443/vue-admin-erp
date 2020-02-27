const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  logics: state => {
    const logics = []
    for (const key in state.common.logicEnum) {
      if (state.common.logicDescEnum.hasOwnProperty(key)) {
        logics.push({ value: state.common.logicEnum[key], label: state.common.logicDescEnum[key] })
      }
    }
    return logics
  },
  getLogics: (state, getters) => logics => {
    const arr = []
    getters.logics.forEach(item => {
      if (!logics || logics === 0 || ((logics & item.value) === item.value)) {
        arr.push(Object.assign({}, item))
      }
    })
    return arr
  }
}
export default getters
