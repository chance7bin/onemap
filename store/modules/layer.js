const layer = {
	state: {
		dispalyLayers:[]
	},
	mutations: {
		setDispalyLayers(state, payload){
			state.dispalyLayers = payload.dispalyLayers;
		}
	}
}

export default layer
