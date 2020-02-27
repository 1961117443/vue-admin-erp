
const state = {
  logicEnum: {
    Equal: 1,
    Like: 2,
    GreaterThan: 4,
    GreaterThanOrEqual: 8,
    LessThan: 16,
    LessThanOrEqual: 32,
    In: 64,
    NotIn: 128,
    // / <summary>
    // / ***%
    // / </summary>
    LikeLeft: 256,
    // / <summary>
    // / %***
    // / </summary>
    LikeRight: 512,
    NoEqual: 1024,
    IsNullOrEmpty: 2048,
    IsNot: 4096,
    NoLike: 8192
  },
  logicDescEnum: {
    Equal: '等于',
    Like: '包含',
    GreaterThan: '大于',
    GreaterThanOrEqual: '大于等于',
    LessThan: '小于',
    LessThanOrEqual: '小于等于',
    //  In: 64,
    //  NotIn: 128,
    // / <summary>
    // / ***%
    // / </summary>
    LikeLeft: '左包含',
    // / <summary>
    // / %***
    // / </summary>
    LikeRight: '右包含',
    NoEqual: '不等于',
    IsNullOrEmpty: '空',
    //  IsNot: 4096,
    NoLike: '不包含'
  }
}
const mutations = {

}
const actions = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
