const query = {
	state: () => ({
		// 触发按钮
		queryFeatureTrigger:true,
		drawPolygonTrigger:true,
		clearDrawPolygonTrigger:true,
		polygonQueryTrigger:true,
		advancedQueryTrigger:true,
		// 选中的要素
		selectedFeature:{},
		showSearchList:false,
		//没有查询到数据的时候显示特殊界面
		isNotData:true,
		searchList: []
	}),
	mutations: {
		setQueryFeatureTrigger(state){
			state.queryFeatureTrigger = !state.queryFeatureTrigger;
		},
		setDrawPolygonTrigger(state){
			state.drawPolygonTrigger = !state.drawPolygonTrigger;
		},
		setClearDrawPolygonTrigger(state){
			state.clearDrawPolygonTrigger = !state.clearDrawPolygonTrigger;
		},
		setPolygonQueryTrigger(state){
			state.polygonQueryTrigger = !state.polygonQueryTrigger;
		},
		setAdvancedQueryTrigger(state){
			state.advancedQueryTrigger = !state.advancedQueryTrigger;
		},
		setSelectedFeature(state, payload){
			state.selectedFeature = payload.selectedFeature;
		},
		setShowSearchList(state, payload){
			state.showSearchList = payload;
		},
		setIsNotData(state, payload){
			state.isNotData = payload;
		},
		setSearchList(state, payload){
			state.searchList = payload.searchList;
		}
	}
}

export default query
