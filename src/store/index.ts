import { createStore } from 'vuex'

const store = createStore({
  state: {
    userInfo: null,
    token: localStorage.getItem('token') || '',
    sidebar: {
      opened: true
    },
    settings: {
      theme: 'light',
      showTags: true,
      fixedHeader: true
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_TOKEN(state) {
      state.token = ''
      localStorage.removeItem('token')
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_THEME(state, theme) {
      state.settings.theme = theme
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve) => {
        // 这里应该有实际的登录API调用
        // 模拟登录成功
        commit('SET_TOKEN', 'admin-token')
        commit('SET_USER_INFO', {
          name: '超级管理员',
          avatar: '',
          roles: ['admin']
        })
        resolve(true)
      })
    },
    // 登出
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('CLEAR_TOKEN')
        commit('CLEAR_USER_INFO')
        resolve(true)
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    userInfo: state => state.userInfo,
    sidebar: state => state.sidebar,
    settings: state => state.settings
  }
})

export default store 