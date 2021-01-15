<template>
	<view>
		<!-- 顶部导航栏单屏多屏监听器 -->
		<view :prop="currentMenu" :change:prop="multi.screenListener"></view>
		<!-- 监听图层变化 -->
		<view :prop="displayLayer" :change:prop="multi.displayLayerUpdate"></view>
		<!-- 双屏 -->
		<view style="display: flex;" v-show="screenCount == 2">
			<view style="position: relative;">
				<view class="two-map" id="twoMap1" style="border-right: 2rpx solid #000000;"></view>
				<multi-screen-control
					class="layer-control-icon"
					:selectedDefault="selectedDefault.twoMap[0]"
					screenId="twoMap1"
					screenIndex="0"
					layersControl="twoScreenLayers"
					@updateDisplayLayer="updateDisplayLayer"
				></multi-screen-control>
			</view>
			<view style="position: relative;">
				<view class="two-map" id="twoMap2" style="border-left: 2rpx solid #000000;"></view>
				<multi-screen-control
					class="layer-control-icon"
					:selectedDefault="selectedDefault.twoMap[1]"
					screenId="twoMap2"
					screenIndex="1"
					layersControl="twoScreenLayers"
					@updateDisplayLayer="updateDisplayLayer"
				></multi-screen-control>
			</view>
		</view>
		<!-- 四屏 -->
		<view  v-show="screenCount == 4">
			<view style="display: flex;flex-wrap: wrap;">
				<view style="position: relative;">
					<view class="four-map" id="fourMap1" style="border-bottom: 2rpx solid #000000;border-right: 2rpx solid #000000;"></view>
					<multi-screen-control
						class="layer-control-icon"
						:selectedDefault="selectedDefault.fourMap[0]"
						screenId="fourMap1"
						screenIndex="0"
						layersControl="fourScreenLayers"
						@updateDisplayLayer="updateDisplayLayer"
					></multi-screen-control>
				</view >
				<view style="position: relative;">
					<view class="four-map" id="fourMap2" style="border-bottom: 2rpx solid #000000;border-left: 2rpx solid #000000;"></view>
					<multi-screen-control
						class="layer-control-icon"
						:selectedDefault="selectedDefault.fourMap[1]"
						screenId="fourMap2"
						screenIndex="1"
						layersControl="fourScreenLayers"
						@updateDisplayLayer="updateDisplayLayer"
					></multi-screen-control>
				</view>
				<view style="position: relative;">
					<view class="four-map" id="fourMap3" style="border-top: 2rpx solid #000000;border-right: 2rpx solid #000000;"></view>
					<multi-screen-control
						class="layer-control-icon"
						:selectedDefault="selectedDefault.fourMap[2]"
						screenId="fourMap3"
						screenIndex="2"
						layersControl="fourScreenLayers"
						@updateDisplayLayer="updateDisplayLayer"
					></multi-screen-control>
				</view>
				<view style="position: relative;">
					<view class="four-map" id="fourMap4" style="border-top: 2rpx solid #000000;border-left: 2rpx solid #000000;"></view>
					<multi-screen-control
						class="layer-control-icon"
						:selectedDefault="selectedDefault.fourMap[3]"
						screenId="fourMap4"
						screenIndex="3"
						layersControl="fourScreenLayers"
						@updateDisplayLayer="updateDisplayLayer"
					></multi-screen-control>
				</view>
			</view>
		</view>
		<view class="multi-screen-btn" @click="changeScreenBtn" :prop="screenCount" :change:prop="multi.screenCountListener">
			分屏: {{screenCount}}屏
		</view>
	</view>
</template>


<script>
	
	import multiScreenControl from './multi-screen-control.vue'
	import home from '../../common/home.js'
	
	export default{
		data(){
			return{
				screenCount:2,
				// 各分屏默认选择的图层,值为图层数据中的value值
				selectedDefault:home.selectedDefault,
				displayLayer:{}
			}
		},
		components:{multiScreenControl},
		computed:{
			currentMenu: function(){return this.$store.state.home.currentMenu }
		},
		methods:{
			changeScreenBtn(){
				if(this.screenCount == 2){
					this.screenCount = 4;
				}
				else{
					this.screenCount = 2;
				}
				// console.log("management:",home.multiScreenManagement[0])
			},
			
			updateDisplayLayer(e){
				console.log("updateDisplayLayer:",e);
				this.displayLayer = e;
			}
			
		}
	}
	
</script>

<script module="multi" lang="renderjs">
	
	import home from '../../common/home.js'
	import api from '../../config/api.js'
	import {Map,View} from 'ol';
	import {Vector as VectorLayer,Tile as TileLayer} from 'ol/layer';
	import {Vector as VectorSource,OSM,XYZ,TileWMS,Cluster} from 'ol/source';
	import {fromLonLat,transform,Projection} from 'ol/proj';
	import {GeoJSON} from 'ol/format';
	import {Style,Stroke,Circle,Fill,Text,Icon} from 'ol/style';
	import * as control from 'ol/control';
	import {easeOut} from 'ol/easing';
	

	var twoMap1 = null;
	var twoMap2 = null;
	var fourMap1 = null;
	var fourMap2 = null;
	var fourMap3 = null;
	var fourMap4 = null;
	var gaodeShapeSource = null;
	var gaodeImgSource = null;
	var serviceSources = [];
	var twoScreenLayers = [
		{screenId:'twoMap1',layersArr:[]},
		{screenId:'twoMap2',layersArr:[]}
	];
	var fourScreenLayers = [
		{screenId:'fourMap1',layersArr:[]},
		{screenId:'fourMap2',layersArr:[]},
		{screenId:'fourMap3',layersArr:[]},
		{screenId:'fourMap4',layersArr:[]}
	];
	
	 
	export default{
		
		data(){
			return{
				loadServiceSource:false,
				loadTwoScreen:false,
				loadFourScreen:false,
				wfsSource:'onemap:bus_point',
				lineSource:'onemap:bus_road',
				polygonSource:'onemap:chengdu_region',
				multiScreenLayers:home.multiScreenLayers,
				selectedDefault:home.selectedDefault
			}
		},
		
		mounted() {
			// this.initBaseMap();
		},
		
		methods:{
			
			initServiceSource(){
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
				
				
				// 加载图层资源
				for (var i = 0; i < home.multiScreenLayers.length; i++) {
					var sourceItem = {
						value: home.multiScreenLayers[i].value,
						serviceSource: new TileWMS({
							url: home.multiScreenLayers[i].serviceUrl,
							transition: 0
						})
					}
					serviceSources.push(sourceItem);
					for(var j = 0; j < twoScreenLayers.length; j++) {
						var layersItem = {
							value: home.multiScreenLayers[i].value,
							layer: new TileLayer({
								name: sourceItem.value,
								source: sourceItem.serviceSource
							})
						} 
						twoScreenLayers[j].layersArr.push(layersItem);
					}
					for(var j = 0; j < fourScreenLayers.length; j++) {
						var layersItem = {
							value: home.multiScreenLayers[i].value,
							layer: new TileLayer({
								name: sourceItem.value,
								source: sourceItem.serviceSource
							})
						}
						fourScreenLayers[j].layersArr.push(layersItem);
					}
				}
				
				// console.log("twoScreenLayers:",twoScreenLayers)
				
				this.loadServiceSource = true;
				
				this.initTwoScreen(); 
				this.loadTwoScreen = true; 
			},
			
			screenListener(newValue){
				console.log("changeScreenListener:",newValue);
				if(newValue == 4 && !this.loadTwoScreen && !this.loadServiceSource){
					setTimeout(() => {
						this.initServiceSource();
					},200)
				}
			},
			
			screenCountListener(newValue){
				console.log("screenCountListener:",newValue);
				if(newValue == 2 && !this.loadTwoScreen){
					setTimeout(() => {
						this.initTwoScreen();
						this.loadTwoScreen = true;
					},200)
				}
				else if(newValue == 4 && !this.loadFourScreen){
					setTimeout(() => {
						this.initFourScreen(); 
						this.loadFourScreen = true;
					},200)
				}
			},
			
			initTwoScreen(){
				console.log("initTwoScreen...");
				var multiView = new View({
					projection: "EPSG:4326",
					zoom: 7,
					center: [119.215288, 26.042279],
					maxZoom: 15
					// minZoom: 8
				})
				
				twoMap1 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [
						new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						})
					],  
					view: multiView, 
					target: 'twoMap1'
				});
				twoMap2 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [
						new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						}) 
					],  
					view: multiView, 
					target: 'twoMap2'
				});
				
				for(var k = 0; k < 2; k++){
					for (var i = 0; i < this.multiScreenLayers.length; i++) {
						for (var j = 0; j < this.selectedDefault.twoMap[k].length; j++) {
							if(this.multiScreenLayers[i].value == this.selectedDefault.twoMap[k][j]){
								switch (k) {
									case 0:
										twoMap1.addLayer(twoScreenLayers[k].layersArr[i].layer);
										break;
									case 1:
										twoMap2.addLayer(twoScreenLayers[k].layersArr[i].layer);
								}
							}
						}
					}
				}
				
			},
			
			initFourScreen(){
				console.log("initFourScreen...");
				var multiView = new View({
					projection: "EPSG:4326",
					zoom: 7,
					center: [119.215288, 26.042279],
					maxZoom: 15
					// minZoom: 8
				})
				
				fourMap1 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						})],  
					view: multiView, 
					target: 'fourMap1'
				});
				fourMap2 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [
						new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						})
					],  
					view: multiView, 
					target: 'fourMap2'
				});
				fourMap3 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [
						new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						})
					],  
					view: multiView, 
					target: 'fourMap3'
				});
				
				fourMap4 = new Map({
					controls: control.defaults({attribution: false,zoom: false}),
					layers: [
						new TileLayer({
							name: 'baseMap',
							source: gaodeShapeSource,
							wrapX: false
						})
					],  
					view: multiView, 
					target: 'fourMap4'
				});
				
				for(var k = 0; k < 4; k++){
					for (var i = 0; i < this.multiScreenLayers.length; i++) {
						for (var j = 0; j < this.selectedDefault.fourMap[k].length; j++) {
							if(this.multiScreenLayers[i].value == this.selectedDefault.fourMap[k][j]){
								switch (k) {
									case 0:
										fourMap1.addLayer(fourScreenLayers[k].layersArr[i].layer);
										break;
									case 1:
										fourMap2.addLayer(fourScreenLayers[k].layersArr[i].layer);
										break;
									case 2:
										fourMap3.addLayer(fourScreenLayers[k].layersArr[i].layer);
										break;
									case 3:
										fourMap4.addLayer(fourScreenLayers[k].layersArr[i].layer);
								}
							}
						}
					}
				}
				
				
				// fourMap2.addLayer(fourScreenLayers[1].layersArr[0].layer);
				// fourMap3.addLayer(fourScreenLayers[2].layersArr[1].layer);
				// fourMap4.addLayer(fourScreenLayers[3].layersArr[2].layer);
				
			},
			
			displayLayerUpdate(newValue){
				console.log("displayLayerUpdate newValue:",newValue)
				var selectedLayers = newValue.selectedLayers;
				var updateMap = eval(newValue.screenId);
				var layersControl = eval(newValue.layersControl);
				var index = parseInt(newValue.screenIndex)
				
				var layersLen = updateMap.getLayers().getLength();
				// console.log("updateMap.getlayers:",updateMap.getLayers())
				for (var i = 1; i < layersLen; i++) {
					var removeLayerName = updateMap.getLayers().array_[1].values_.name;
					// console.log("layer[" + i + "]:",removeLayerName);
					for(var j = 0; j < layersControl[index].layersArr.length; j++) {
						if(removeLayerName == layersControl[index].layersArr[j].value){
							updateMap.removeLayer(layersControl[index].layersArr[j].layer);
							break;
						}
					}
				}
				for (var i = 0; i < layersControl[index].layersArr.length; i++) {
					for(var j = 0; j < selectedLayers.length; j++) {
						if(layersControl[index].layersArr[i].value == selectedLayers[j]){
							updateMap.addLayer(layersControl[index].layersArr[i].layer);
							break;
						}
					}
				}
				
			}
			
		}
		
	}
	
</script>
	
<style>
	.two-map{
		width: 50vw;
		height: calc(100vh - 50rpx - var(--status-bar-height));
	}
	.four-map{
		width: calc(50vw - 2rpx);
		height: calc(((100vh - 50rpx - var(--status-bar-height)) / 2) - 2rpx);
	}
	
	.multi-screen-btn{
		font-size: 18rpx;
		background-color: #FFFFFF;
		width: 100rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		position: absolute; 
		right: 20rpx; 
		top: calc(50rpx + var(--status-bar-height) + 20rpx);
		border-radius: 10rpx;
		
	}
	.layer-control-icon{
		position: absolute;
		left: 20rpx;
		top: 20rpx;
	}
	
	
</style>
