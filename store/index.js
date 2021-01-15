import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home.js'
import layer from './modules/layer.js'
import location from './modules/location.js'
import query from './modules/query.js'
import statistic from './modules/statistic.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		
	},
	modules:{
		home,
		layer,
		location,
		query,
		statistic
	},
	mutations: {
		
	}
})

export default store
