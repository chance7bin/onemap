<template>
	<view class="side-menu">
		<view class="menu-top">
			<view class="menu-top-title">数据目录</view>
			<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
		</view>
		<view class="menu-padding">
			<scroll-view scroll-y="true" scroll-x="true"  class="layer-scroll">
				<y-treebox :layers="layerItemsDisplay" @chooseLayer="chooseLayerDisplay" ></y-treebox>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	import yTreebox from '@/components/y-treebox/y-treebox.vue'
	import home from '../../common/home.js'
	import { mapState } from 'vuex'
	
	export default{
		
		data(){
			return{
				layerItemsDisplay:home.layerItemsDisplay,
			}
		},
		components:{
			yTreebox
		},
		computed:mapState({
			currentMenu: state => state.home.currentMenu,
			// dispalyLayers: state => state.layer.dispalyLayers
		}),
		
		methods:{
			//监听图层变化
			chooseLayerDisplay(e){
				this.$store.commit('setDispalyLayers',{
					dispalyLayers:e.value
				})
			}
			
		}
		
	}
	
</script>
	
<style>
</style>
