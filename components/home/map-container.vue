<template>
	<view>
		<!-- renderjs通信桥梁 -->
		<view>
			<!-- 图层菜单选中展示图层监听器 -->
			<view :prop="dispalyLayers" :change:prop="ol.displayLayer"></view>
			<!-- 触发模糊查询事件 -->
			<view :prop="queryFeatureTrigger" :change:prop="ol.queryFeature"></view>
			<!-- 点击查询结果聚焦监听器 -->
			<view :prop="selectedFeature" :change:prop="ol.toFeature"></view>
			<!-- 空间查询 -->
			<view :prop="drawPolygonTrigger" :change:prop="ol.drawPolygon"></view>
			<view :prop="clearDrawPolygonTrigger" :change:prop="ol.clearDrawPolygon"></view>
			<view :prop="polygonQueryTrigger" :change:prop="ol.polygonQuery"></view>
			<!-- 高级查询 -->
			<view :prop="advancedQueryTrigger" :change:prop="ol.advancedQuery"></view>
			<!-- 定位 -->
			<view :prop="toCurrentLocationTrigger" :change:prop="ol.toCurrentLocation"></view>
			<view :prop="toLocationTrigger" :change:prop="ol.toLocation"></view>
			<view :prop="navigationTrigger" :change:prop="ol.showNavigation"></view>
		</view>
		<!-- 地图容器 -->
		<view>
			<!-- 单屏 -->
			<view v-show="currentMenu != 4">
				<!-- 地图容器 -->
				<view id="map"></view>
				<!-- 地图控件 -->
				<view class="map-control">
					<!-- 缩放至全图组件 -->
					<view class="map-control-icon iconfont icon-weixingtu" @click="ol.changeBasemap"></view>
					<view class="map-control-icon iconfont icon-celiang" @click="ol.polygonMeasure"></view>
					<view class="map-control-icon iconfont icon-lajitong" @click="ol.clearLayer"></view>
					<view class="map-control-icon iconfont icon-suofang" @click="ol.zoom2layer"></view>
					<view class="map-control-icon iconfont icon-dingwei1" @click="ol.toCurrentLocation"></view>
				</view>
			</view>
			<!-- 多屏 --> 
			<multi-map v-show="currentMenu == 4"></multi-map>
			<!-- 要素弹窗 -->
			<view id="popup" class="ol-popup">
				<view class="menu-top">
					<view class="menu-top-title">要素信息</view>
					<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" id="popup-closer"></view>
				</view>
				<scroll-view class="feature-detail" id="popup-content" scroll-y="true"></scroll-view>
			</view>
			<!-- <view id="locationIcon"><image src="../../static/image/locationIcon.png" style="width: 40rpx;height: 40rpx;" alt="定位"/></view> -->
		</view>
	</view>
</template>
 
<script>
	
	import { mapState } from 'vuex'
	import multiMap from './multi-map.vue'
	
	export default{
		
		data(){
			return{
				popupDetail:[]
			}
		},
		components:{multiMap},
		computed: mapState({
			currentMenu: state => state.home.currentMenu,
			dispalyLayers: state => state.layer.dispalyLayers,
			selectedFeature: state => state.query.selectedFeature,
			queryFeatureTrigger: state => state.query.queryFeatureTrigger,
			showSearchList:state => state.query.showSearchList,
			isNotData:state => state.query.isNotData,
			searchList: state => state.query.searchList,
			drawPolygonTrigger:state => state.query.drawPolygonTrigger,
			clearDrawPolygonTrigger:state => state.query.clearDrawPolygonTrigger,
			polygonQueryTrigger:state => state.query.polygonQueryTrigger,
			advancedQueryTrigger:state => state.query.advancedQueryTrigger,
			toCurrentLocationTrigger:state => state.location.toCurrentLocationTrigger,
			toLocationTrigger:state => state.location.toLocationTrigger,
			navigationTrigger:state => state.location.navigationTrigger
		}),
		methods:{
			
			// 接受视图层传过来的信息
			setSearchList(e){
				uni.hideLoading();
				uni.showToast({
					title: '查询完成',
					duration: 2000
				})
				// console.log("queryFeatures:",e);
				this.$store.commit('setSearchList',{
					searchList:e.queryFeatures
				});
				if(this.searchList.length != 0 ){
					this.$store.commit('setIsNotData',false);
				}
				else{
					this.$store.commit('setIsNotData',true);
				}
				if(!this.showSearchList){
					this.$store.commit('setShowSearchList',true);
				}
			},
			
			// 提示信息
			// 等待查询提示
			showLoading(){
				uni.showLoading({
				    title: '查询中'
				});
			},
			
			showTip(){
				uni.showToast({
					title:'请绘制查询区域',
					duration:2000,
					icon:'none'
				})
			},
			
			//绘制多边形提示
			startDraw(){
				uni.showToast({
					title:'开始绘制',
					duration:2000,
					icon:'none'
				})
			},
			stopDraw(){
				uni.showToast({
					title:'停止绘制',
					duration:2000,
					icon:'none'
				})
			},
			drawing(){
				uni.showToast({
					title:'正在绘制中',
					duration:2000,
					icon:'none'
				})
			},
			clearCurrentLayer(){
				uni.showToast({
					title:'清空图层',
					duration:2000,
					icon:'none'
				})
			},
			
			calArea(e){
				console.log("calArea:",e);
				uni.showToast({
					title:'面积约为:' + Math.round(e.area) + "M²",
					duration:2000,
					icon:'none'
				})
			},
			
			showNavToast(){
				uni.showToast({
					title: '请求成功',
					duration: 2000
				})
			}
			
		}
		
	}
	
</script>

<script module="ol" lang="renderjs">
	import $ from 'jquery'
	import api from '../../config/api.js'
	import home from '../../common/home.js'
	import mapProps from '../../common/mapProps.js'
	import {Map,View} from 'ol';
	import {Vector as VectorLayer,Tile as TileLayer} from 'ol/layer';
	import {Vector as VectorSource,OSM,XYZ,TileWMS,Cluster} from 'ol/source';
	import {fromLonLat,transform,Projection} from 'ol/proj';
	import {GeoJSON} from 'ol/format';
	import {Style,Stroke,Circle,Fill,Text,Icon} from 'ol/style';
	import {bbox} from 'ol/loadingstrategy';
	import * as control from 'ol/control';
	import Feature from 'ol/Feature';
	import Collection from 'ol/Collection';
	import Overlay from 'ol/Overlay';
	import {Select,Draw} from 'ol/interaction';
	import {easeOut} from 'ol/easing';
	import WFS from 'ol/format/WFS';
	import {equalTo,greaterThan,lessThan,greaterThanOrEqualTo,lessThanOrEqualTo,like,and,or,not,intersects} from 'ol/format/filter';
	import LineString from 'ol/geom/LineString';
	import MultiLineString from 'ol/geom/MultiLineString';
	import MultiPoint from 'ol/geom/MultiPoint';
	import MultiPolygon from 'ol/geom/MultiPolygon';
	import Point from 'ol/geom/Point';
	import { getVectorContext } from 'ol/render';
	
	var layersControl = [];
	var wfsLayers = [];
	var baseMap = null; 
	var wfsVectorLayer = null;
	var polygonWmsLayer = null;
	var lineWfsLayer = null;
	var redlineWmsLayer = null;
	var view = null;
	var map = null;
	//选中要素交互 
	var selectInteraction = null;
	//弹窗图层
	var overlay = null;
	//道路数据交互
	var roadInteraction = null;
	//高亮图层
	var highlightLayer = null;
	//高德地图
	var gaodeShapeSource = null;
	var gaodeImgSource = null;
	//多边形查询
	var drawInteraction = null;
	var drawLayer = null;
	var drawedFeature = null;
	//面积测量
	var measureLayer = null;
	var measureInteraction = null;
	// var measureFeature = null;
	// 定位图层
	var locationLayer = null;
	var myLocationAnchor = null;
	var inputLocationAnchor = null;
	
	
	export default {
		data() {
			return {
				selectedLayers:[],
				//显示弹窗所展示的图层
				currentLayer:'lineWfsLayer',
				wfsDisplayFlag:false,
				wfsSource:'onemap:bus_point',
				lineSource:'onemap:bus_road',
				polygonSource:'onemap:chengdu_region',
				redlineSource:'onemap:redline2',
				olSearchText: '',
				searchPropsKV:mapProps.searchPropsKV,
				isShapeMap:true,
				queryPropsKV:mapProps.queryPropsKV,
				operatorItemKV:mapProps.operatorItemKV,
				isDraw:false,
				isQuery:false,
				isMeasure:false,
				searchLayer:''
			}
		},

		mounted() {
			this.loadMap();
			// this.initMultiScreen(); 
		},
		
		methods: {
			
			//初始化地图 selectedLayers, currentLayer, new Map() layers 
			loadMap() {
				console.log("loadMap...")
				
				//高德地图矢量影像
				gaodeShapeSource = new XYZ({
					url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?scl=2&lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
					//url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d',
					// url: './static/map/arcgis/Community/{z}/{x}/{y}.png'
				}) 
				//高德地图影像图
				gaodeImgSource = new XYZ({
					url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?scl=2&lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}'
				})
				 
				//基础底图
				baseMap = new TileLayer({
					name: 'baseMap',
					source: gaodeShapeSource,
					// source: new OSM(), 
					// source: new XYZ({
					// 	url: 'http://192.168.31.157:8080' + '/map/{z}/{x}/{y}.png',
					// 	// url: './static/map/arcgis/Community/{z}/{x}/{y}.png'
					// }),  
					wrapX: false
				}); 
				
				view = new View({
					projection: "EPSG:4326",
					zoom: 7,
					center: [119.215288, 26.042279],
					maxZoom: 15
				})
				
				map = new Map({
					controls: control.defaults({
						attribution: false,
						zoom: false
					}),
					layers: [baseMap],  
					view: view, 
					target: 'map'
				});
				
				// console.log("home.layerItemsDisplay:",home.layerItemsDisplay);
				// 加载服务图层
				var wfsIndexCount = 0;
				for(var i = 0; i < home.layerItemsDisplay.length; i++) {
					var child = home.layerItemsDisplay[i].child;
					// console.log("child:",child);
					for(var j = 0; j < child.length; j++) {
						// console.log("child:",child[j].value);
						var layerItem = {};
						if(child[j].serviceType == 'wms'){
							layerItem = {
								value: child[j].value,
								layerName: child[j].layerName,
								layer: new TileLayer({
									name: child[j].value,
									source: new TileWMS({
										url: child[j].serviceUrl,
										transition: 0  //渲染时不透明度过渡的持续时间。要禁用不透明度转换 transition: 0
									})
								}),
								displayProps:child[j].displayProps
							}
						}
						else if(child[j].serviceType == 'wfs'){
							//创建wfs资源
							var wfsVectorSource = new VectorSource({
								format: new GeoJSON(),
								url: child[j].serviceUrl,
							});  
							
							// 聚合标注数据源
							var clusterSource = new Cluster({
								distance: 40,	//聚合的距离参数，即当标注间距离小于此值时进行聚合，单位是像素
								source: wfsVectorSource	//聚合的数据源，即矢量要素数据源对象
							});  
							
							// 加载矢量图层
							var wfsVectorLayer = new VectorLayer({
								name: child[j].value,
								// preload: Infinity, //wfs图层预加载 Infinity表示正无穷大
								source: clusterSource
							});
							
							layerItem = {
								value: child[j].value,
								layerName: child[j].layerName,
								layer: wfsVectorLayer,
								wfsVectorSource:wfsVectorSource,
								clusterSource:clusterSource,
								displayProps:child[j].displayProps
							}
							
							//记录wfs服务的索引
							wfsLayers.push(wfsIndexCount);
						}
						layersControl.push(layerItem);
						if(child[j].isChecked){
							map.addLayer(layerItem.layer);
						}
						wfsIndexCount++;
					}
				}
				// console.log("layersControl:",layersControl);
				
				
				//创建高亮图层
				highlightLayer = new VectorLayer({
					name: "highlightLayer", 
					source: new VectorSource()
				})
					
				
				// 获取到popup的节点
				var container = document.getElementById('popup');
				var content = document.getElementById('popup-content');
				var closer = document.getElementById('popup-closer');
				
				// 创建一个overlay, 绑定html元素container
				overlay = new Overlay({
				    element: container,
				    autoPan: true,
				    autoPanAnimation: {
				      duration: 250
				    }
				});
				map.addOverlay(overlay)
				
				//添加一个点击处理器去隐藏弹窗,返回{boolean},不要设置href
				closer.onclick = function () {
				    overlay.setPosition(undefined);
				    closer.blur();
				    return false;
				};
				
				//添加选中要素交互事件
				selectInteraction = new Select({
					// condition: pointerMove,   // 唯一的不同之处，设置鼠标移到feature上就选取
					// 设置选中后的style
					style: new Style({
						image: new Circle({
							radius: 10,
							fill: new Fill({
								color: 'red'
							})
						})
					})
				})
				
				// 多边形交互
				// 添加一个绘制的多边形使用的layer
				drawLayer = new VectorLayer({
					source: new VectorSource(),
					style: new Style({
						stroke: new Stroke({
							color: '#00ff00',
							// size: 2,
							width: 4
						}),
						fill: new Fill({
							color: 'rgba(139, 178, 228, 0.7)'
						})
					})
				})
				drawInteraction = new Draw({
					type: 'Polygon',
					source: drawLayer.getSource()    // 注意设置source，这样绘制好的线，就会添加到这个source里
				})
				
				
				//点击地图获得信息（wfs服务的点击弹窗没做）
				map.on('singleclick', evt => {
					// clickLayer为最后添加在地图上的wms图层
					var clickLayer;
					var requestLayer;
					//不处于绘制情况下，点击地图才有弹窗
					if(!this.isDraw && !this.isMeasure){
						var feature = map.forEachLayerAtPixel(evt.pixel, function(feature) {
							return feature;
						});
						clickLayer = feature.values_.name;
						console.log("clickLayer:",clickLayer);
						for (var i = 0; i < layersControl.length; i++) {
							if(clickLayer == layersControl[i].value){
								requestLayer = layersControl[i];
								break;
							}
						}
						// console.log("requestLayer:",requestLayer)
						//wms点击弹窗
						var view = map.getView();
						var viewResolution = view.getResolution();
						var source = requestLayer.layer.getSource();
						// console.log("requestLayer.getSource():",source)
						var url = source.getFeatureInfoUrl(
							evt.coordinate, viewResolution, view.getProjection(), {
								'INFO_FORMAT': 'application/json',
								'FEATURE_COUNT': 50,
								'QUERY_LAYERS': requestLayer.layerName
							});
						if (url) {
							console.log("url:",url)
							$.ajax({
								url: url,
								type: 'GET',
								async: true,
								contentType: 'application/json;charset=utf-8',
								success: data => {
									console.log("data:",data)
									console.log("length:",data.features.length)
									content.innerHTML = '';
									if(data.features.length != 0){
										let prop = data.features[0].properties;
										// console.log(requestLayer.displayProps[0] + ":" + prop[requestLayer.displayProps[0]])
										for (var i = 0; i < requestLayer.displayProps.length; i++) {
											content.innerHTML += '<div><p>' + requestLayer.displayProps[i].name + ':</p>' + '<p>' + prop[requestLayer.displayProps[i].value] + '</p></div>';
										}
										// 设置overlay的位置，从而显示在鼠标点击处
										overlay.setPosition(evt.coordinate);
										 
										// 如果点击的是道路数据的话，该道路高亮
										if(data.features[0].geometry.type == 'MultiLineString'){
											// 创建一个高亮要素(返回的是MultiLineString类型 , 所以要创建MultiLineString对象)
											var shape = new Feature({
												geometry: new MultiLineString(data.features[0].geometry.coordinates)
											}); 
											shape.setStyle(new Style({
												stroke: new Stroke({
												  color: 'red', 
												  width: 5 
												})
											}));
											highlightLayer.getSource().clear();
											highlightLayer.getSource().addFeature(shape);
											map.removeLayer(highlightLayer);
											map.addLayer(highlightLayer);
										}
										
									}
								}
							})
						}
					}
				});
				
				
				// console.log("wfslayers:",wfsLayers);
				//监听地图缩放
				map.on("moveend",e => {
				    var zoom = map.getView().getZoom();  //获取当前地图的缩放级别
				    // console.log(zoom); 12.5
				    for (var i = 0; i < wfsLayers.length; i++) {
						var styleCache = {};	//用于保存特定数量的聚合群的要素样式
				    	var layerIndex = wfsLayers[i];
						var wfsLayerItem = layersControl[layerIndex].layer;
						// console.log("layersControl[layerIndex]",layersControl[layerIndex].layer)
						if(zoom >= 10){
							//点样式注意需要设置好描边样式，否则不展示效果出来
							wfsLayerItem.setSource(layersControl[layerIndex].wfsVectorSource);
							wfsLayerItem.setStyle(
								function(resolution){
									return [new Style({
										image: new Icon({
											src: './static/image/location.png', 
											scale: map.getView().getZoom() / 100
										})
									})];
								}
							)
						}else{
							//加载聚合标注的矢量图层
							wfsLayerItem.setSource(layersControl[layerIndex].clusterSource);
							wfsLayerItem.setStyle(function(feature){
								var size = feature.get('features').length;	//获取该要素所在聚合群的要素数量
								var style = styleCache[size];
								// console.log(size);
								if(!style){
									style = [
										new Style({
											image: new Circle({
												radius: 10,
												stroke: new Stroke({
													color: '#fff'
												}),
												fill: new Fill({
													color: '#3399CC'
												})
											}),
											text: new Text({
												text: size.toString(),
												fill: new Fill({
													color: '#fff'
												})
											})
										})
									];
									styleCache[size] = style;
								}
								return style;
							})
						}
				    }
				});
				
				measureLayer = new VectorLayer({
					source: new VectorSource(),
					style: new Style({
						stroke: new Stroke({
							color: '#00ff00',
							// size: 2,
							width: 4
						}),
						fill: new Fill({
							color: 'rgba(139, 178, 228, 0.7)'
						})
					})
				})
				measureInteraction = new Draw({
					type: 'Polygon',
					source: measureLayer.getSource()    // 注意设置source，这样绘制好的线，就会添加到这个source里
				})
				
				// 定位图层
				locationLayer = new VectorLayer({
					source: new VectorSource()
				})
				
				myLocationAnchor = new Feature({
					geometry: new Point([parseFloat(plus.storage.getItem("myLocationLon")),parseFloat(plus.storage.getItem("myLocationLat"))])
				});
				myLocationAnchor.setStyle(new Style({
					image: new Icon({
						src: './static/image/myLocationAnchor.png',
						anchor: [0.5, 1]
					})
				}));
				inputLocationAnchor = new Feature({
					geometry: undefined
				});
				inputLocationAnchor.setStyle(new Style({
					image: new Icon({
						src: './static/image/inputLocationAnchor.png',
						anchor: [0.5, 1]
					})
				}));
				locationLayer.getSource().addFeature(myLocationAnchor);
				locationLayer.getSource().addFeature(inputLocationAnchor);

				// 监听地图层级变化
				map.getView().on('change:resolution', function(){
					var style = myLocationAnchor.getStyle();
					// 重新设置图标的缩放率，基于层级10来做缩放
					style.getImage().setScale(this.getZoom() / 55);
					myLocationAnchor.setStyle(style);
					var style2 = inputLocationAnchor.getStyle();
					// 重新设置图标的缩放率，基于层级10来做缩放
					style2.getImage().setScale(this.getZoom() / 55);
					inputLocationAnchor.setStyle(style2);
				})
				// map.addLayer(locationLayer)
				
			},
			
			//重新渲染地图
			displayLayer(newValue, oldValue, ownerInstance, instance){
				/* if(this.isDraw){
					this.clearDrawPolygon(event, ownerInstance);
				} */
				
				// console.log("displayLayer============:",newValue)
				
				//先把非地图图层都移除掉
				map.removeLayer(highlightLayer);
				map.removeLayer(locationLayer);
				// map.removeInteraction(drawInteraction);
				// map.removeLayer(drawLayer);
				
				this.selectedLayers = newValue;
				 
				// console.log("map.getlayers:",map.getLayers())
				var layersLen = map.getLayers().getLength();
				// console.log("layersLen:",layersLen)
				// console.log("map.getLayers().array_:",map.getLayers().array_)
				for (var i = 1; i < layersLen; i++) {
					//删掉一个后面的元素会往前移，所以都取第一个
					var layerName = map.getLayers().array_[1].values_.name;
					for (var j = 0; j < layersControl.length; j++) {
						if(layerName == layersControl[j].value){
							map.removeLayer(layersControl[j].layer);
						}
					}
					
				}
					 
				for (var i = 0; i < this.selectedLayers.length; i++) {
					for (var j = 0; j < layersControl.length; j++) {
						if(this.selectedLayers[i] == layersControl[j].value){
							map.addLayer(layersControl[j].layer);
						}
					}
				}
				
				this.currentLayer = map.getLayers().array_[map.getLayers().getLength() - 1].values_.name;
				console.log("currentLayer:",this.currentLayer)
				
			},
			
			//缩放至初始范围
			zoom2layer(){
				var center = [119.215288, 26.042279];
				map.getView().animate({center:center,zoom:7,easing:easeOut});
			},
			
			//输入框监听器
			searchListener(newValue, oldValue, ownerInstance, instance){
				console.log("olSearchText:",newValue.value)
				this.olSearchText = newValue.value;
			},
			
			// 有的时候属性表(geoserver中的属性表)里是英文,
			// 显示的时候需显示中文,
			// 这边说明一下，查询的字段属性需是geoserver里的属性值,
			// 要查什么先到geoserver的属性表里去看一下
			// 那么displayProps中的每一项需设置为对象类型{name:'',value:''}
			// 之后把home里面的layerItemsDisplay每一个对象里的displayProps统一修改为用键值对的形式吧(我先溜啦 -。-) 
			// 哎~我又回来了...还得改
			
			// 查询要素
			queryFeature(newValue, oldValue, ownerInstance, instance){
				ownerInstance.callMethod('showLoading');
				
				this.searchLayer = plus.storage.getItem("searchLayer");
				var searchProp = plus.storage.getItem("searchProp");
				var searchText = plus.storage.getItem("searchText");
				var searchValue = plus.storage.getItem("currentLayerValue");
				
				//查询属性转换为geoserver中的格式
				for (var i = 0; i < layersControl.length; i++) {
					if(searchValue == layersControl[i].value){
						var prop = layersControl[i].displayProps;
						for (var j = 0; j < prop.length; j++) {
							if(searchProp == prop[j].name){
								searchProp = prop[j].value;
								break;
							}
						}
						break;
					}
				}
				
				//初始化 默认参数
				// if(searchProp == null){
				// 	searchProp = '道路类型';
				// }
				
				// for (var i = 0; i < this.searchPropsKV.length; i++) {
				// 	if(this.searchPropsKV[i].name == searchProp){
				// 		searchProp = this.searchPropsKV[i].value;
				// 	}
				// }
				console.log("searchLayer:",this.searchLayer)
				console.log("searchProp:",searchProp)
				console.log("searchText:",searchText)
				
				//设置查询参数与条件
				var featureRequest = new WFS().writeGetFeature({
					srsName: 'EPSG:4326',//坐标系统
					featureNS: 'http://onemap/ns',//命名空间 URI
					featurePrefix: 'onemap',//工作区名称
					featureTypes: [this.searchLayer],//查询图层，可以是同一个工作区下多个图层，逗号隔开
					maxFeatures: 100,
					outputFormat: 'application/json',
					filter: new like(searchProp,'*' + searchText + '*')//前者是属性名，后者是对应值
					// filter: new like(searchProp,'*x*')
				});
			 
				//第一个参数是URL 
				fetch(api.domain + '/geoserver/onemap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.searchLayer + '&outputFormat=application%2Fjson&srsname=EPSG:4326', {
					method: 'POST',
					body: new XMLSerializer().serializeToString(featureRequest)
				}).then(function(response) { 
					return response.json(); 
				}).then(function(json) { 
					var features = new GeoJSON().readFeatures(json);
					// console.log("feature json:",json);
					// console.log("feature GeoJSON:",new GeoJSON().readFeatures(json)); 
					console.log("features length:",features.length);
					// console.log("features[0]:",features[0]);
					// 调用 service 层的方法
					// ownerInstance.callMethod('hideLoading')
					ownerInstance.callMethod('setSearchList', {
						queryFeatures: features
					})
				});
				
			}, 
			 
			//高级查询
			advancedQuery(newValue, oldValue, ownerInstance, instance){
				ownerInstance.callMethod('showLoading');
				this.searchLayer = plus.storage.getItem("searchLayer");
				var advancedQueryText = plus.storage.getItem("advancedQueryText");
				var searchValue = plus.storage.getItem("currentLayerValue");
				console.log("advancedQueryText:",advancedQueryText)
				
				// var operatorReg = /[=><≥≤]/im;
				var parseArr = advancedQueryText.split(" ");
				console.log("parseArr:",parseArr)
				
				// geoserver里属性表的转化
				// for (var i = 0; i < this.queryPropsKV.length; i++) {
				// 	if(this.queryPropsKV[i].name == parseArr[0]){
				// 		parseArr[0] = this.queryPropsKV[i].value;
				// 	}
				// } 
				
				
				for (var i = 0; i < layersControl.length; i++) {
					if(searchValue == layersControl[i].value){
						var prop = layersControl[i].displayProps;
						for (var j = 0; j < prop.length; j++) {
							if(parseArr[0] == prop[j].name){
								parseArr[0] = prop[j].value;
								break;
							}
						}
						break;
					}
				}
				
				for (var i = 0; i < this.operatorItemKV.length; i++) {
					if(this.operatorItemKV[i].name == parseArr[1]){
						parseArr[1] = this.operatorItemKV[i].value;
					}
				}
				console.log("parseArr[0]:",parseArr[0])
				console.log("parseArr[1]:",parseArr[1])
				
				//设置查询条件 （and or not还未开发 lessThan有bug,会报错,不知道是为什么）
				var filterExp = null;
				var operator = parseArr[1];
				if(operator == "equalTo")
					filterExp = new equalTo(parseArr[0],parseArr[2]);
				else if(operator == "greaterThan")
					filterExp = new greaterThan(parseArr[0],parseFloat(parseArr[2]));
				else if(operator == "lessThan")
					filterExp = new lessThan(parseArr[0],parseFloat(parseArr[2]));
				else if(operator == "greaterThanOrEqualTo")
					filterExp = new greaterThanOrEqualTo(parseArr[0],parseFloat(parseArr[2]));
				else if(operator == "lessThanOrEqualTo")
					filterExp = new lessThanOrEqualTo(parseArr[0],parseFloat(parseArr[2]));
				else if(operator == "like")
					filterExp = new like(parseArr[0],'*' + parseArr[2] + '*');
				else if(operator == "and")
					filterExp = new and(parseArr[0],parseFloat(parseArr[2]));
				else if(operator == "or")
					filterExp = new or(parseArr[0],parseFloat(parseArr[2]));
				else
					filterExp = new not(parseArr[0],parseFloat(parseArr[2]));
				
				//设置查询参数与条件
				// console.log("length:",parseFloat(parseArr[2]))
				var featureRequest = new WFS().writeGetFeature({
					srsName: 'EPSG:4326',//坐标系统
					featureNS: 'http://onemap/ns',//命名空间 URI
					featurePrefix: 'onemap',//工作区名称
					featureTypes: [this.searchLayer],//查询图层，可以是同一个工作区下多个图层，逗号隔开
					maxFeatures: 100,
					outputFormat: 'application/json',
					filter: filterExp//前者是属性名，后者是对应值 
				}); 
							 
				//第一个参数是URL 
				fetch(api.domain + '/geoserver/onemap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.searchLayer + '&outputFormat=application%2Fjson&srsname=EPSG:4326', {
					method: 'POST',
					body: new XMLSerializer().serializeToString(featureRequest)
				}).then(function(response) { 
					return response.json(); 
				}).then(function(json) { 
					var features = new GeoJSON().readFeatures(json);
					// console.log("feature json:",json);
					// console.log("feature GeoJSON:",new GeoJSON().readFeatures(json)); 
					console.log("features length:",features.length);
					// console.log("features[0]:",features[0]);
					// 调用 service 层的方法
					ownerInstance.callMethod('setSearchList', {
						queryFeatures: features
					})
				});
			},
			
			initList(){
				
			},
			 
			//多边形查询
			//绘制多边形 
			drawPolygon(newValue, oldValue, ownerInstance, instance){
				if(!this.isDraw){
					ownerInstance.callMethod('startDraw')
					this.isDraw = true;
					//把点要素和线要素的交互移除掉
					
					// this.currentLayer
					drawLayer.getSource().clear();
					map.removeLayer(drawLayer);
					map.addLayer(drawLayer);
					map.addInteraction(drawInteraction);
					
					// 监听线绘制结束事件，获取坐标
					drawInteraction.on('drawend', e => {
						// e.feature 就是当前绘制完成的线的Feature
						// console.log("e.feature.getGeometry().getCoordinates():",e.feature.getGeometry().getCoordinates())
						console.log("drawInteraction feature getGeometry:",e.feature.getGeometry())
						drawedFeature = e.feature;
						this.isDraw = false;
						// map.removeLayer(drawLayer);
						map.removeInteraction(drawInteraction);
					});
					
				} else{
					ownerInstance.callMethod('drawing')
				}
				
			},
			
			//取消绘制多边形 / 清除多边形图层
			clearDrawPolygon(newValue, oldValue, ownerInstance, instance){
				ownerInstance.callMethod('stopDraw')
				this.isDraw = false;
				map.removeInteraction(drawInteraction);
				drawLayer.getSource().clear();
				drawedFeature = null;
				map.removeLayer(drawLayer);
				map.removeLayer(measureLayer);
				map.removeLayer(highlightLayer);
			},
			
			//多边形查询
			polygonQuery(newValue, oldValue, ownerInstance, instance){
				this.searchLayer = plus.storage.getItem("searchLayer");
				if(drawedFeature != null){
					ownerInstance.callMethod('showLoading');
					//设置查询参数与条件
					var featureRequest = new WFS().writeGetFeature({
						srsName: 'EPSG:4326',//坐标系统
						featureNS: 'http://onemap/ns',//命名空间 URI
						featurePrefix: 'onemap',//工作区名称
						featureTypes: [this.searchLayer],//查询图层，可以是同一个工作区下多个图层，逗号隔开
						maxFeatures: 100,
						outputFormat: 'application/json',
						filter: new intersects('geom',drawedFeature.getGeometry()) //查询过滤条件
					}); 
					
					//第一个参数是URL 
					fetch(api.domain + '/geoserver/onemap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + this.searchLayer + '&outputFormat=application%2Fjson&srsname=EPSG:4326', {
						method: 'POST',
						body: new XMLSerializer().serializeToString(featureRequest)
					}).then(function(response) { 
						return response.json(); 
					}).then(function(json) { 
						var features = new GeoJSON().readFeatures(json);
						// console.log("feature json:",json);
						// console.log("feature GeoJSON:",new GeoJSON().readFeatures(json)); 
						console.log("features length:",features.length);
						// console.log("features[0]:",features[0]);
						// 调用 service 层的方法
						ownerInstance.callMethod('setSearchList', {
							queryFeatures: features
						})
					});
				}
				else{
					ownerInstance.callMethod('showTip')
				}
			},
			
			
			//聚焦到选中要素
			toFeature(newValue, oldValue, ownerInstance, instance){ 
				var prop = newValue.values_;
				console.log("prop newValue:",prop)
				
				//设置图层
				var currentLayerValue = plus.storage.getItem("currentLayerValue")
				console.log("toFeature currentLayerValue:",currentLayerValue)
				var requestLayer;
				
				var currentLayerType = plus.storage.getItem("currentLayerType");
				console.log("currentLayerType:",currentLayerType)

				//选中要素高亮
				var shape = null;
				if(currentLayerType == 'line'){
					// 创建一个高亮要素
					shape = new Feature({
						geometry: new MultiLineString(prop.geometry.flatCoordinates,prop.geometry.layout,prop.geometry.ends_)
					}); 
					shape.setStyle(new Style({
						stroke: new Stroke({
						  color: 'red', 
						  width: 5 
						}) 
					}));
				}
				else if(currentLayerType == 'point'){
					shape = new Feature({
						geometry: new MultiPoint(prop.geometry.flatCoordinates,prop.geometry.layout)
					});
					shape.setStyle(new Style({
						image: new Circle({
							radius: 10,
							fill: new Fill({
								color: 'red'
							})
						})
					}))
				} 
				else if(currentLayerType == 'polygon'){
					shape = new Feature({
						geometry: new MultiPolygon(prop.geometry.flatCoordinates,prop.geometry.layout,prop.geometry.endss_)
					});
					shape.setStyle(new Style({
						stroke: new Stroke({
							color: 'red',
							// size: 2,
							width: 4
						}),
					}));
					
				}
				highlightLayer.getSource().clear();
				highlightLayer.getSource().addFeature(shape);
				map.removeLayer(highlightLayer); 
				map.addLayer(highlightLayer);
				
				for (var i = 0; i < layersControl.length; i++) {
					if(currentLayerValue == layersControl[i].value){
						requestLayer = layersControl[i];
						break; 
					}
				}
				
				console.log("toFeature requestLayer:",requestLayer)
				
				var content = document.getElementById('popup-content');
				content.innerHTML = '';
				
				for (var i = 0; i < requestLayer.displayProps.length; i++) {
					content.innerHTML += '<div><p>' + requestLayer.displayProps[i].name + ':</p>' + '<p>' + prop[requestLayer.displayProps[i].value] + '</p></div>';
				}
				
				// 设置overlay的位置，从而显示在道路的中间
				var coorArr = prop.geometry.flatCoordinates; 
				console.log("coorArr.length:",coorArr.length);
				//防止出现 经纬度不匹配的情况
				var centerLon = coorArr[Math.floor(coorArr.length / 2 / 2) * 2];
				var centerLat = coorArr[Math.floor(coorArr.length / 2 / 2) * 2 + 1];
				console.log("centerLon:",centerLon); 
				console.log("centerLat:",centerLat);
				var center = [centerLon,centerLat]
				overlay.setPosition(center);
				map.getView().animate({center:center,zoom:10,easing:easeOut});
				// map.getView().fit(vectorSource.getExtent());//缩放到查询出的feature
			},
			
			// 定位
			toLocation(){ 
				map.removeLayer(locationLayer);
				map.addLayer(locationLayer);
				var lonVal = parseFloat(plus.storage.getItem("lonVal"))
				var latVal = parseFloat(plus.storage.getItem("latVal"))
				console.log("lon:",lonVal)
				console.log("lat:",latVal)
				var center = [lonVal,latVal];
				inputLocationAnchor.setGeometry(new Point(center))
				// var center = [parseFloat(plus.storage.getItem("lonVal")),parseFloat(plus.storage.getItem("latVal"))];
				// locationAnchor.setPosition(center);
				map.getView().animate({center:center,zoom:13,easing:easeOut});
			}, 
			//定位当前位置
			toCurrentLocation(){
				map.removeLayer(locationLayer);
				map.addLayer(locationLayer);
				plus.geolocation.getCurrentPosition(function(p){
					console.log('Geolocation:\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
					plus.storage.setItem("myLocationLat",p.coords.latitude + '');
					plus.storage.setItem("myLocationLon",p.coords.longitude + '');
				});
				var myLocationLon = parseFloat(plus.storage.getItem("myLocationLon"))
				var myLocationLat = parseFloat(plus.storage.getItem("myLocationLat"))
				var center = [myLocationLon,myLocationLat];
				myLocationAnchor.setGeometry(new Point(center))
				// new Point([parseFloat(plus.storage.getItem("myLocationLon")),parseFloat(plus.storage.getItem("myLocationLat"))])
				// locationAnchor.setPosition(center); 
				map.getView().animate({center:center,zoom:13,easing:easeOut});
			},
			// 导航
			showNavigation(newValue, oldValue, ownerInstance, instance){
				console.log("showNavigation newValue:",newValue)
				var lonVal = plus.storage.getItem("lonVal");
				var latVal = plus.storage.getItem("latVal");
				var myLocationLon = plus.storage.getItem("myLocationLon");
				var myLocationLat = plus.storage.getItem("myLocationLat");
				console.log("navigation:\norigin:" + myLocationLon + "," + myLocationLat + "\ndestination:" + lonVal + "," + latVal)
				
				//交通方式
				var strategyUrl = '';
				if(newValue.strategy == 'driving'){
					strategyUrl = 'https://restapi.amap.com/v3/direction/driving';
				}
				else if(newValue.strategy == 'walking'){
					strategyUrl = 'https://restapi.amap.com/v3/direction/walking';
				}
				
				// 道路样式
				// var buttomPathStyle = new Style({
				//   stroke: new Stroke({
				//     color: [4, 110, 74],
				//     width: 4
				//   }),
				// })
				// var upperPathStyle = new Style({
				 
				//   stroke: new Stroke({
				//     color: [0, 186, 107],
				//     width: 8
				//   }),
				// })
				
				
				// 请求路径
				$.ajax({
					url: strategyUrl,
					type: 'GET',
					data:{
						key: 'cb003321f848fc897f55ca40cf0e6b01',
						origin: myLocationLon + ',' + myLocationLat,
						// origin:'118.108245,24.486208',
						destination: lonVal + ',' + latVal,
					},
					async: true,
					contentType: 'application/json;charset=utf-8',
					success: data => {
						console.log("data:",data)
						var polylineArr = [];
						var paths = data.route.paths[0];
						var stepsLength = paths.steps.length;
						for (var i = 0; i < stepsLength; i++) {
							polylineArr = polylineArr.concat(paths.steps[i].polyline.split(/[,;]/).map(parseFloat));
						}
						console.log("polylineArr:",polylineArr)
						
						// 创建一个高亮要素
						var road = new Feature({
							geometry: new LineString(polylineArr,"XY")
						}); 
						road.setStyle(new Style({
							stroke: new Stroke({
							  color: 'green', 
							  width: 5 
							})
						}));
						road.setId(1)
						
						var roadFeature = locationLayer.getSource().getFeatureById(1);
						console.log("roadFeature:",roadFeature)
						if(roadFeature != null){
							locationLayer.getSource().removeFeature(roadFeature);
						}
						locationLayer.getSource().addFeature(road);
						
						// baseMap.on('postrender', (evt) => {
						// 	var vct = getVectorContext(evt);
						// 	vct.drawFeature(road, buttomPathStyle)
						// 	vct.drawFeature(road, upperPathStyle)
						// })
						
						map.removeLayer(locationLayer);
						map.addLayer(locationLayer);
						// locationLayer.getSource().forEachFeature(e => {
						// 	console.log("forEachFeature:",e)
						// })
						ownerInstance.callMethod('showNavToast');
					}
				})
				
				
			},
			
			
			// 切换底图
			changeBasemap(){
				console.log("current source:",baseMap.getSource())
				if(this.isShapeMap){
					baseMap.setSource(gaodeImgSource);
				} else{
					baseMap.setSource(gaodeShapeSource);
				}
				this.isShapeMap = !this.isShapeMap;
			},
			
			//面积量测
			polygonMeasure(event,ownerInstance){
				if(!this.isMeasure){
					this.isMeasure = true;
					ownerInstance.callMethod('startDraw')
					map.removeLayer(measureLayer);
					map.addLayer(measureLayer);
					map.addInteraction(measureInteraction);
					// 监听线绘制结束事件
					measureInteraction.on('drawend', e => {
						// e.feature 就是当前绘制完成的线的Feature
						// console.log("e.feature.getGeometry().getCoordinates():",e.feature.getGeometry().getCoordinates())
						console.log("measureInteraction feature getGeometry:",e.feature.getGeometry())
						var measureFeature = e.feature;
						ownerInstance.callMethod('calArea', {
							area: measureFeature.getGeometry().getArea() * 1000000
						})
					});
				}
				else{
					this.isMeasure = false;
					ownerInstance.callMethod('stopDraw')
					map.removeInteraction(measureInteraction);
					measureLayer.getSource().clear();
					map.removeLayer(measureLayer);
					map.removeLayer(drawLayer);
					map.removeLayer(highlightLayer);
				}
			},
			
			
			clearLayer(event,ownerInstance){
				drawLayer.getSource().clear();
				measureLayer.getSource().clear();
				highlightLayer.getSource().clear();
				// locationLayer.getSource().clear();
				inputLocationAnchor.setGeometry(undefined)
				var roadFeature = locationLayer.getSource().getFeatureById(1);
				// console.log("roadFeature:",roadFeature)
				if(roadFeature != null){
					locationLayer.getSource().removeFeature(roadFeature);
				}
				map.removeLayer(drawLayer);
				map.removeLayer(measureLayer);
				map.removeLayer(highlightLayer);
				map.removeLayer(locationLayer);
				ownerInstance.callMethod('clearCurrentLayer')
			}
			
			
		}
		
	   
	}
	
</script>
	
<style>
	#map {
		width: 100%;
		height: calc(100vh - 50rpx - var(--status-bar-height));
		/* background-color: #ffff7f; */
	}
	
	
	/* 弹窗样式 */
	.ol-popup {
		position: absolute;
		background-color: white;
		box-shadow: 0 1rpx 4rpx rgba(0,0,0,0.2);
		/* padding: 15rpx 25rpx 15rpx 15rpx; */
		border-radius: 10rpx;
		/* border: 1rpx solid #0090ff; */
		bottom: 12rpx;
		left: -50rpx;
		width: 200rpx;
		/* min-height: 100rpx; */
	}
	.ol-popup:after, .ol-popup:before {
		top: 100%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}
	.ol-popup:after {
		border-top-color: white;
		border-width: 10rpx;
		left: 48rpx;
		margin-left: -10rpx;
	}
	.ol-popup:before {
		border-top-color: #cccccc;
		border-width: 11rpx;
		left: 48rpx;
		margin-left: -11rpx;
	}
	#popup-content{
		font-size: small;
	}
	
	
	/* 地图控件 */
	.map-control {
	    position: absolute;
	    bottom: 20rpx;
	    right: 10rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	.map-control-icon{
		margin-right: 15rpx;
		border-radius: 5rpx;
		background-color: #ffffff;
		color: #6d6d6d;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		font-size: 20rpx;
		/* box-shadow: 0px 0px 2px #b5b5b5; */
		box-shadow: 2px 4px 6px #595959;
	}
</style>
