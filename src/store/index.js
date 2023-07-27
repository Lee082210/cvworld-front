import { createStore } from 'vuex'

export default createStore({
  state: {
    loginUserInfo: null,  //用户信息
    showLogin: false, //是否展示登录框
    boardList: [],    //板块信息
    activePboardId: 0,//当前一级板块
    activeBoardId: 0,//当前二级板
    messageCountInfo: {}, //消息数量
    sysSetting: {},  //系统设置
  },
  getters: {
    getLoginUserInfo: (state) => {
      return state.loginUserInfo
    },
    getBoardList: (state) => {
      return state.boardList
    },
    getSubBoardList: (state) => (boardId) => {
      let board = state.boardList.find(item =>//父板块
        item.boardId == boardId
      )
      return board ? board.children : [] //子版块
    },
    getActivePboardId: (state) => {
      return state.activePboardId
    },
    getActiveBoardId: (state) => {
      return state.activeBoardId
    },
    getMessageCountInfo: (state)=>{
      return state.messageCountInfo
    },
    

  },
  mutations: {
    updateLoginUserInfo: (state, value) => {
      state.loginUserInfo = value
    },
    showLogin(state, value) {
      state.showLogin = value
    },
    saveBoardList: (state, value) => {
      state.boardList = value
    },
    setActivePboardId: (state, value) => {
      state.activePboardId = value
    },
    setActiveBoardId: (state, value) => {
      state.activeBoardId = value
    },
    //更新消息数
    updateMessageCountInfo: (state, value)=>{
      state.messageCountInfo = value
    },
    readMessage: (state, value)=>{
      state.messageCountInfo.total = state.messageCountInfo[value]
      state.messageCountInfo[value] = 0
    },
    saveSysSetting: (state, value)=>{
      state.sysSetting = value
    }
  },
  actions: {},
  modules: {}
})