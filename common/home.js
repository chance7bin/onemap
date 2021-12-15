module.exports = {
	// 图层树
	layerItemsDisplay: [
		{
			name: '行政区划',
			value: 'adminDivision',
			showChild: false,
			child:[
				{
					name:'地级行政区',
					value:'prefectureDistrict',
					layerName:'shareCupMapData:prefecturedistrict_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:prefecturedistrict_4326&tiled=true&srsname=EPSG:4326',
					isChecked:true,
					serviceType:'wms',
					//需弹窗展示的属性
					displayProps:[
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'}
					],
					type:'polygon'
				},
				{
					name:'县级行政区',
					value:'countyDistrict',
					layerName:'shareCupMapData:countydistrict_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:countydistrict_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'},
						{name:'县市区',value:'县市区'}
					],
					type:'polygon'
				}
			]
		},
		{
			name: '公路路网',
			value: 'highwayNetwork',
			showChild: false,
			child:[
				{
					name:'国道',
					value:'nationalHighway',
					layerName:'shareCupMapData:nationalhighway_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:nationalhighway_4326&tiled=true&srsname=EPSG:4326',
					isChecked:true,
					serviceType:'wms',
					displayProps:[
						{name:'路线名称',value:'路线名称'},
						{name:'路线编号',value:'路线编号'},
						{name:'项目类别',value:'项目类别'},
						{name:'规划类型',value:'规划类型'},
						{name:'路段名称',value:'路段名称'},
						{name:'备注',value:'备注'}
					],
					type:'line'
				},
				{
					name:'省道',
					value:'provincialHighway',
					layerName:'shareCupMapData:provincialhighway_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:provincialhighway_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'路线名称',value:'路线名称'},
						{name:'路线编号',value:'路线编号'},
						{name:'项目类别',value:'项目类别'},
						{name:'规划类型',value:'规划类型'},
						{name:'路段名称',value:'路段名称'},
						{name:'备注',value:'备注'}
					],
					type:'line'
				},
				{
					name:'县道',
					value:'countyHighway',
					layerName:'shareCupMapData:countyhighway_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:countyhighway_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'路线名称',value:'路线名称'},
						{name:'路段编号',value:'路段编号'},
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'},
						{name:'县市区',value:'县市区'}
					],
					type:'line'
				},
				{
					name:'乡道',
					value:'townshipRoad',
					layerName:'shareCupMapData:townshiproad_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:townshiproad_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'路线名称',value:'tzhlxmc'},
						{name:'路段编号',value:'tzhldbh'},
						{name:'管理单位名称',value:'tzhgldwmc'}
					],
					type:'line'
				},
				{
					name:'高速公路',
					value:'expressway',
					layerName:'shareCupMapData:expressway_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:expressway_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'路线名称',value:'路线名称'},
						{name:'路线编号',value:'路线编号'},
						{name:'建设状况',value:'建设状况'},
						{name:'车道里程',value:'车道里程'},
						{name:'四车道',value:'四车道'},
						{name:'六车道',value:'六车道'},
						{name:'八车道以上',value:'八车道以上'},
						{name:'路基宽度',value:'路基宽度'},
						{name:'备注',value:'备注'}
					],
					type:'line'
				}
			]
		},
		{
			name: '公路附属设施',
			value: 'highwayFacilities',
			showChild: false,
			child:[
				{
					name:'服务区',
					value:'serviceArea',
					layerName:'shareCupMapData:servicearea_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:servicearea_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'},
						{name:'县市区',value:'县市区'}
					],
					type:'point'
				},
				{
					name:'互通',
					value:'interflow',
					layerName:'shareCupMapData:interflow_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:interflow_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'},
						{name:'县市区',value:'县市区'}
					],
					type:'point'
				},
				{
					name:'交调站',
					value:'trafficSurveyStation',
					layerName:'shareCupMapData:trafficsurveystation_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:trafficsurveystation_4326&tiled=true&srsname=EPSG:4326',
					isChecked:true,
					serviceType:'wms',
					displayProps:[
						{name:'所在省',value:'所在省'},
						{name:'设区市',value:'设区市'},
						{name:'县市区',value:'县市区'}
					],
					type:'point'
				},
				{
					name:'桥梁',
					value:'bridge',
					layerName:'shareCupMapData:bridge_4326',
					// serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=shareCupMapData:bridge_4326&outputFormat=application%2Fjson&srsname=EPSG:4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:bridge_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					//有的时候属性表(geoserver中的属性表)里是英文,显示的时候需显示中文,那么displayProps中的item设置为对象类型{name:'',value:''}
					displayProps:[
						{name:'桥梁编号',value:'tzhqlbh'},
						{name:'桥梁名称',value:'tzhqlmc'},
						{name:'管理单位名称',value:'tzhgldwmc'}
					],
					type:'point'
				},
				{
					name:'隧道',
					value:'tunnel',
					layerName:'shareCupMapData:tunnel_4326',
					serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:tunnel_4326&tiled=true&srsname=EPSG:4326',
					isChecked:false,
					serviceType:'wms',
					displayProps:[
						{name:'隧道编号',value:'tzhsdbh'},
						{name:'隧道名称',value:'tzhsdmc'},
						{name:'管理单位名称',value:'tzhgldwmc'}
					],
					type:'point'
				}
			]
		}
	],
	layerItemsDefault: [
		{
			name: '行政区划',
			value: '行政区划',
			showChild: false,
			child:[
				{
					name: '市级',
					value: 'polygonWmsLayer',
					isChecked:false
				},
				{
					name: '区级',
					value: 'polygonWmsLayer',
					isChecked:false
				},
				{
					name: '县级',
					value: 'polygonWmsLayer',
					isChecked:false
				}
			]
		},
		{
			name: '公路路网',
			value: '公路路网',
	        showChild: false,
			child:[
				{
					name: '高速',
					value: 'lineWfsLayer',
					isChecked:false
				},
				{
					name: '国道',
					value: 'lineWfsLayer',
					isChecked:false
				},
				{
					name: '省道',
					value: 'lineWfsLayer',
					isChecked:false
				},
				{
					name: '县道',
					value: 'lineWfsLayer',
					isChecked:false
				},
				{
					name: '乡道',
					value: 'lineWfsLayer',
					isChecked:false
				},
				{
					name: '村道',
					value: 'lineWfsLayer',
					isChecked:false
				}
			]
		},
		{
			name: '公路附属设施',
			value: '公路附属设施',
		    showChild: false,
			child:[
				{
					name: '站点',
					value: 'wfsVectorLayer',
					isChecked:false
				},
				{
					name: '桥梁',
					value: 'wfsVectorLayer',
					isChecked:false
				},
				{
					name: '隧道',
					value: 'wfsVectorLayer',
					isChecked:false
				},
			]
		}
	],
	// 菜单控制
	menuList:[
		{"text":"数据","icon":"icon-shuju"},
		{"text":"查询","icon":"icon-query1"},
		{"text":"统计","icon":"icon-tongji"},
		{"text":"定位","icon":"icon-dingwei"},
		{"text":"分屏","icon":"icon-fenpingduibi-fuben"}
	],
	
	// 高级查询
	queryProps:[
		{"name":"道路名 ","value":"name"},
		{"name":"道路类型 ","value":"type"},
		{"name":"长度 ","value":"distance"},
		{"name":"宽度 ","value":"width"},
		{"name":"路面类型 ","value":"roadtype"},
		{"name":"厚度 ","value":"thickness"}
	],
	operatorItem:[
		{"name":" = ","value":"equalTo"},
		{"name":" > ","value":"greaterThan"},
		{"name":" < ","value":"lessThan "},
		{"name":" ≥ ","value":"greaterThanOrEqualTo"},
		{"name":" ≤ ","value":"lessThanOrEqualTo"},
		{"name":" Like ","value":"like"},
		{"name":" And ","value":"and"},
		{"name":" Or ","value":"or"},
		{"name":" Not ","value":"not"}
	],
	
	// 统计属性
	generalStatLayer:[
		{name:"国道",value:"gd",labelId:"0"},
		{name:"省道",value:"sd",labelId:"1"},
		{name:"高速",value:"gs",labelId:"2"},
		{name:"县道",value:"xd",labelId:"3"},
		{name:"乡道",value:"xd",labelId:"4"},
		{name:"村道",value:"cd",labelId:"5"}
	],
	chartData: {
		"categories": ["A乡", "B乡", "C乡", "D乡", "E乡"],
		"series": [{
			"name": "高速干道",
			"data": [15, 20, 45, 37, 43]
		}, {
			"name": "主干道",
			"data": [30, 40, 25, 14, 34]
		}]
	},
	statProps:{
		layerProps:{
			layerCandidate:['国道','高速公路','省道','县道','乡道'],
			layerBindVal:'高速公路'
		},
		fieldProps:{
			fieldCandidate:['设区市','建设状况'],
			fieldBindVal:'建设状况'
		},
		attrProps:{
			attrCandidate:['车道里程','四车道','六车道','八车道'],
			attrBindVal:''
		},
		methodProps:{
			methodCandidate:['平均值','总和','最大值','最小值'],
			methodBindVal:'平均值'
		}
	},
	statData:{
		// "city": [
		// 	{"name":"国道","count":31,"distance":151,"width":5.1,"thickness":7.1},
		// 	{"name":"省道","count":28,"distance":123,"width":3.1,"thickness":5.1},
		// 	{"name":"县道","count":40,"distance":97,"width":2.3,"thickness":6.1}
		// ],
		"construction":[
			{"name":"规划高速","total":29,"four":14,"six":12,"eight":11},
			{"name":"建成高速","total":19,"four":9,"six":8,"eight":7},
			{"name":"在建高速","total":14,"four":6,"six":5,"eight":5}
		]
	},
	
	// 多屏控制
	multiScreenLayers:[
		{
			text:'地级行政区',
			value:'prefectureDistrict',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:prefecturedistrict_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'县级行政区',
			value:'countyDistrict',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:countydistrict_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'国道',
			value:'nationalHighway',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:nationalhighway_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'省道',
			value:'provincialHighway',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:provincialhighway_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'县道',
			value:'countyHighway',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:countyhighway_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'乡道',
			value:'townshipRoad',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:townshiproad_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'高速公路',
			value:'expressway',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:expressway_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'服务区',
			value:'serviceArea',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:servicearea_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'互通',
			value:'interflow',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:interflow_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'交调站',
			value:'trafficSurveyStation',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:trafficsurveystation_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'桥梁',
			value:'bridge',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:bridge_4326&tiled=true&srsname=EPSG:4326'
		},
		{
			text:'隧道',
			value:'tunnel',
			serviceUrl:'http://geomodeling.njnu.edu.cn/onemap/geoserver/shareCupMapData/wms?service=WMS&version=1.1.0&request=GetMap&layers=shareCupMapData:tunnel_4326&tiled=true&srsname=EPSG:4326'
		}
	],
	// 默认选中图层
	selectedDefault:{
		twoMap:[
			['nationalHighway'],
			['prefectureDistrict','townshipRoad']
		],
		fourMap:[
			['bridge'],
			['serviceArea'],
			['trafficSurveyStation','interflow'],
			['countyDistrict'],
		]
	},
	

}