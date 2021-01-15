const home = {
	state: {
		currentMenu:0
	},
	mutations: {
		setCurrentMenu(state, payload) {
			state.currentMenu = payload;
		}
	}
}

export default home
