// Vuex 状态管理
import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '../common/js/Storage.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	// 数据源
	state: {
		user: {}
	},
	// 改变数据源的数据
	mutations: {
		SET_USER(state, user) {
			state.user = user
			if (user) {
				// 如果user不为空,添加
				Storage.localStorage.set('user', user)
			} else {
				// user为空,删除
				Storage.localStorage.remove('user')
			}
		}
	},
	actions: {
		set_user({ commit, state }, user) {
			commit('SET_USER', user)
		}
	}
})

export default store