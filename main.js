import Vue from 'vue'
import App from './App'

// 引入vuex
import store from 'store/index.js'
Vue.prototype.$store = store

// import api from '@/config/api.js'
// Vue.prototype.api = api

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
