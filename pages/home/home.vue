<template>
	<view>
		<!-- 占位符 -->
		<view class="top-wrapper"></view>
		<!-- 顶部导航栏 -->
		<top-navigation></top-navigation>
		<!-- 地图模块 -->
		<map-container></map-container>
		<!-- 菜单模块 -->
		<view>
			<!-- 图层菜单 --> 
			<layer-menu v-show="currentMenu == 0"></layer-menu>
			<!-- 查询菜单 -->
			<query-menu v-show="currentMenu == 1"></query-menu>
			<!-- 统计菜单 -->
			<statistic-menu v-show="currentMenu == 2"></statistic-menu>
			<!-- 定位 -->
			<location-menu v-show="currentMenu == 3"></location-menu>
		</view>
		
	</view>
</template> 

<script>
	
	import { mapState } from 'vuex'
	import topNavigation from "@/components/home/top-navigation.vue"
	import mapContainer from "../../components/home/map-container.vue"
	import layerMenu from "../../components/home/layer-menu.vue"
	import queryMenu from "../../components/home/query-menu.vue"
	import statisticMenu from "../../components/home/statistic-menu.vue"
	import locationMenu from "../../components/home/location-menu.vue"

	export default { 
		data() {
			return {
				
			}
		},
		components: {
			topNavigation,
			mapContainer,
			layerMenu,
			queryMenu,
			statisticMenu,
			locationMenu
		},
		onLoad() {
			console.log("onload...");
			
			// 清缓存
			// plus.storage.clear();
			
			plus.geolocation.getCurrentPosition(function(p){
				console.log('Geolocation:\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
				plus.storage.setItem("myLocationLat",p.coords.latitude + '');
				plus.storage.setItem("myLocationLon",p.coords.longitude + '');
			});
			plus.storage.setItem("latVal",'0');
			plus.storage.setItem("lonVal",'0');
		},
		computed: mapState({
			currentMenu: state => state.home.currentMenu
		}),
		
		methods: {
			
			//测试代码
			testFun(e){
				console.log("testFun:",e);
			}
			
		}
	}
</script>

<style>
	/* * {
	   touch-action: none;
	} */
	
	/* 字体 small 对应 14rpx 默认用14rpx*/
	/* .side-menu{
		padding: 10rpx;
		width: 180rpx;
		height: 300rpx; */
	
</style>
