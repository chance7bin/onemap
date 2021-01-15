const location = {
	state: {
		toCurrentLocationTrigger:true,
		toLocationTrigger:true,
		navigationTrigger:{
			trigger:true,
			strategy:'driving'
		},
	},
	mutations: {
		setToCurrentLocationTrigger(state){
			state.toCurrentLocationTrigger = !state.toCurrentLocationTrigger;
		},
		setToLocationTrigger(state){
			state.toLocationTrigger = !state.toLocationTrigger;
		},
		setNavigationTrigger(state, payload){
			state.navigationTrigger.trigger = !state.navigationTrigger.trigger;
			state.navigationTrigger.strategy = payload.strategy
		},
	}
}

export default location